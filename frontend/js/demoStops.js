const participantsUrl = "http://localhost:8080/participants/find?nom=";
const loginUrl = "http://localhost:8080/auth/login";
let myModal = null;
class APIError extends Error {
    constructor(mess, status, statusText, url) {
        super(mess);
        this.name = 'APIError';
        this.status = status;
        this.statusText = statusText;
        this.url = url;
    }
}

const vueApp = Vue.createApp({
	data() {
		return {
			currentUser: null, // login de l'utilisateur connecté (null = non connecté)
			currentParticipantId: null, // participant_id de l'utilisateur connecté
			showWelcome: false, // true = page de bienvenue, false = page carte
			authView: "login", // "login" | "register" | "forgot password"
			loginData: { login: "", password: "" }, // données du formulaire de connexion
			loginError: null, // message d'erreur de connexion
			registerData: { login: "", password: "", confirmPassword: "", nom: "", prenom: "" },
			registerError: null,
			registerSuccess: false,
			resetData: { login: "", nom: "", prenom: "", newPassword: "", confirmPassword: "" },
			resetError: null,
			resetSuccess: false,
			welcomeMessage: "", // message de bienvenue après connexion
			filterDateDebut: "",  // date de début du filtre
			filterDateFin: "",    // date de fin du filtre
			filterHeureDebut: "", // heure de début du filtre (optionnel)
			filterHeureFin: "",   // heure de fin du filtre (optionnel)
			participantName: "", // valeur de nom pour la recherche de participants
			participants: null, // liste des participants trouvés correspondant au nom de participant saisi
			map: null, // la map associée à la vue
			selectedStop: null, // le stop sélectionné
			selectedStopComment: null, // le commentaire du stop sélectionné
			colors: ["#e9002c", "#c7ff39", "#bba958", "#c1ca7f", "#d8e7ad", "#edcf6e", "#dca28a", "#c27990", "#a0577f", "#744348"],
			movesVisible: true, // visibilité des trajectoires
			movesLayer: null,   // layer Leaflet des trajectoires
			erreur : null, // objet Error en cas d'erreur d'exécution
		};
	},
	methods: {
		/**
		 * connexion de l'utilisateur
		 */
		async login() {
			this.loginError = null;
			const response = await fetch(loginUrl, {
				method: "POST",
				body: JSON.stringify(this.loginData),
				headers: { "Content-Type": "application/json" },
			});
			if (response.ok) {
				const data = await response.json();
				this.welcomeMessage = data.message;
				this.currentUser = this.loginData.login;
				this.currentParticipantId = data.participantId;
				this.showWelcome = true;
				this.loginData = { login: "", password: "" };
			} else {
				this.loginError = "Login ou mot de passe incorrect";
			}
		},
		/**
		 * création d'un compte
		 */
		async register() {
			this.registerError = null;
			this.registerSuccess = false;
			if (this.registerData.password !== this.registerData.confirmPassword) {
				this.registerError = "Les mots de passe ne correspondent pas";
				return;
			}
			const response = await fetch("http://localhost:8080/auth/register", {
				method: "POST",
				body: JSON.stringify({
					login: this.registerData.login,
					password: this.registerData.password,
					nom: this.registerData.nom,
					prenom: this.registerData.prenom,
				}),
				headers: { "Content-Type": "application/json" },
			});
			if (response.ok) {
				this.registerSuccess = true;
				this.registerData = { login: "", password: "", confirmPassword: "", nom: "", prenom: "" };
			} else if (response.status === 409) {
				this.registerError = "Ce login est déjà utilisé";
			} else {
				this.registerError = "Erreur lors de la création du compte";
			}
		},
		/**
		 * réinitialisation du mot de passe
		 */
		async resetPassword() {
			this.resetError = null;
			this.resetSuccess = false;
			if (this.resetData.newPassword !== this.resetData.confirmPassword) {
				this.resetError = "Les mots de passe ne correspondent pas";
				return;
			}
			const response = await fetch("http://localhost:8080/auth/reset-password", {
				method: "POST",
				body: JSON.stringify({
					login: this.resetData.login,
					nom: this.resetData.nom,
					prenom: this.resetData.prenom,
					newPassword: this.resetData.newPassword,
				}),
				headers: { "Content-Type": "application/json" },
			});
			if (response.ok) {
				this.resetSuccess = true;
				this.resetData = { login: "", nom: "", prenom: "", newPassword: "", confirmPassword: "" };
			} else {
				this.resetError = "Login, nom ou prénom incorrect";
			}
		},
		/**
		 * navigation vers la page carte
		 */
		async goToMap() {
			this.showWelcome = false;
			await this.$nextTick();
			if (!this.map) {
				this.map = L.map("map").setView([45.1875602, 5.7357819], 13);
				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
					maxZoom: 18,
					tileSize: 512,
					zoomOffset: -1,
				}).addTo(this.map);
			}
			// charger et afficher automatiquement les stops et moves de l'utilisateur connecté
			const meParticipant = {
				id: this.currentParticipantId,
				markerColor: "#0d6efd",
				stopsLayer: null,
				stopsVisible: false,
			};
			this.participants = [meParticipant];
			await this.displayStops(meParticipant);
			await this.displayMoves(this.currentParticipantId);
		},
		/**
		 * déconnexion de l'utilisateur
		 */
		logout() {
			if (this.participants) {
				for (let participant of this.participants) {
					if (participant.stopsLayer) participant.stopsLayer.remove(this.map);
				}
			}
			if (this.movesLayer) {
				this.movesLayer.remove(this.map);
				this.movesLayer = null;
			}
			this.currentUser = null;
			this.currentParticipantId = null;
			this.showWelcome = false;
			this.participants = null;
			this.welcomeMessage = "";
			this.map = null;
		},
		/**
		 * pour chercher un participant
		 */
		async findParticipants() {
				if (this.participants && this.participants.length > 0) {
					for (let participant of this.participants) {
						if (participant.stopsLayer) participant.stopsLayer.remove(this.map);
					}
				}
				this.participants = null;
				let response = await fetch(participantsUrl + encodeURI(this.participantName));
				if (response.ok) {
					this.participants = await response.json();
					if (this.participants.length > 0) {
						for (let i = 0; i < this.participants.length; i++) {
							this.participants[i].markerColor = this.colors[i % this.colors.length];
						}
					} 
				} else {
					throw new APIError(`Erreur API recherche de participants`,response.status,response.statusText,response.url);   
				}
		},
		/**
		 * filtrer les stops de l'utilisateur connecté par période
		 */
		async filterStops() {
			if (!this.filterDateDebut || !this.filterDateFin) return;
			const participant = this.participants[0];
			if (participant.stopsLayer) {
				participant.stopsLayer.remove(this.map);
				participant.stopsLayer = null;
			}
			await this.displayStops(participant);
		},
		/**
		 * réinitialiser le filtre et afficher tous les stops
		 */
		async resetFilter() {
			this.filterDateDebut = "";
			this.filterDateFin = "";
			this.filterHeureDebut = "";
			this.filterHeureFin = "";
			const participant = this.participants[0];
			if (participant.stopsLayer) {
				participant.stopsLayer.remove(this.map);
				participant.stopsLayer = null;
			}
			await this.displayStops(participant);
		},
		async displayStops(participant) {
			let self = this;
			if (!participant.stopsLayer) {
				let geojsonMarkerOptions = {
					radius: 8,
					fillColor: participant.markerColor,
					color: "#000",
					weight: 2,
					opacity: 1,
					fillOpacity: 0.8,
				};
				let url = "http://localhost:8080/stops/" + participant.id;
				if (this.filterDateDebut && this.filterDateFin) {
					const heureDebut = this.filterHeureDebut ? this.filterHeureDebut + ":00" : "00:00:00";
					const heureFin = this.filterHeureFin ? this.filterHeureFin + ":00" : "23:59:59";
					url += "?dateDebut=" + this.filterDateDebut + "T" + heureDebut + "&dateFin=" + this.filterDateFin + "T" + heureFin;
				}
				let response = await fetch(url);
				let geoJSON = await response.json();
				// si aucun résultat, features est null → on arrête ici
				if (!geoJSON.features) return;
				// trier par date_debut croissant
				geoJSON.features.sort((a, b) => new Date(a.properties.date_debut) - new Date(b.properties.date_debut));
				// calculer durée, distance, vitesse pour chaque stop
				for (let i = 0; i < geoJSON.features.length; i++) {
					const props = geoJSON.features[i].properties;
					const coords = geoJSON.features[i].geometry.coordinates; // [lng, lat]
					if (props.date_debut && props.date_fin) {
						props.duree = self.formatDuree(new Date(props.date_fin) - new Date(props.date_debut));
					}
					if (i > 0) {
						const prevCoords = geoJSON.features[i - 1].geometry.coordinates;
						const prevFin = new Date(geoJSON.features[i - 1].properties.date_fin);
						const distM = L.latLng(coords[1], coords[0]).distanceTo(L.latLng(prevCoords[1], prevCoords[0]));
						props.distance = (distM / 1000).toFixed(2) + " km";
						const timeMs = new Date(props.date_debut) - prevFin;
						props.vitesse = (timeMs > 0 && distM > 0) ? ((distM / 1000) / (timeMs / 3600000)).toFixed(1) + " km/h" : "-";
					} else {
						props.distance = "-";
						props.vitesse = "-";
					}
				}
				participant.stopsLayer = L.geoJSON(geoJSON, {
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, geojsonMarkerOptions);
					},
					onEachFeature: function (feature, layer) {
						// layer.bindPopup(`<p>${participant.prenom} ${participant.nom}</p>
						//  date début : ${feature.properties.date_debut}<br>
						//  date fin : ${feature.properties.date_fin}
						// `);
						layer.on("click", (evt) => {
							console.log("click " + evt.target.defaultOptions.fillColor);
							self.selectedStop = feature.properties;
							self.selectedStopComment = self.selectedStop.commentaire;
							myModal = new bootstrap.Modal(document.getElementById("featureDetails"));
							const myModalEl = document.getElementById("featureDetails");
							myModalEl.addEventListener("hidden.bs.modal", (event) => {
								evt.target.setStyle({ fillColor: evt.target.defaultOptions.fillColor });
							});

							evt.target.setStyle({ fillColor: "red" });
							myModal.show();
						});
					},
				});
			}
			participant.stopsLayer.setStyle({ fillColor: participant.markerColor });
			participant.stopsLayer.addTo(this.map);
			participant.stopsVisible = true;
		},
		async hideStops(participant) {
			if (participant.stopsLayer) {
				participant.stopsLayer.remove(this.map);
				participant.stopsVisible = false;
			}
		},
		changeColor(event, participant) {
			participant.markerColor = event.target.value;
			if (participant.stopsVisible) {
				participant.stopsLayer.setStyle({ fillColor: participant.markerColor });
			}
		},
		displayInfos(participant) {
			return `id : ${participant.id} Nom : ${participant.nom} Prenom : ${participant.prenom} Nbre stops : ${participant.nbreStops}`;
		},
		formatDuree(ms) {
			if (ms <= 0) return "0 min";
			const totalMinutes = Math.floor(ms / 60000);
			const hours = Math.floor(totalMinutes / 60);
			const minutes = totalMinutes % 60;
			return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
		},
		async displayMoves(participantId) {
			if (this.movesLayer) {
				this.movesLayer.remove(this.map);
				this.movesLayer = null;
			}
			const response = await fetch("http://localhost:8080/moves/" + participantId);
			const geoJSON = await response.json();
			if (!geoJSON.features || geoJSON.features.length === 0) return;
			this.movesLayer = L.geoJSON(geoJSON, {
				style: {
					color: "#ff7800",
					weight: 3,
					opacity: 0.8,
				},
			}).addTo(this.map);
			this.movesVisible = true;
		},
		toggleMoves() {
			if (this.movesVisible) {
				this.movesLayer.remove(this.map);
				this.movesVisible = false;
			} else {
				this.movesLayer.addTo(this.map);
				this.movesVisible = true;
			}
		},
		async updateStop() {
			console.log(this.selectedStopComment);
			this.selectedStop.commentaire = this.selectedStopComment;
			let stop = {
				stopId: this.selectedStop.stop_id,
				participantId: this.selectedStop.particpantId,
				latitude: 0, // n'a pas d'importance pour la mise à jour
				longitude: 0, // n'a pas d'importance pour la mise à jour
				commentaire: this.selectedStopComment,
			};
			await fetch("http://localhost:8080/stop", {
				method: "PUT",
				body: JSON.stringify(stop),  // transforme l'objet stop en chaîne JSON
				headers: {
					"Content-Type": "application/json",
				},
			});
			myModal.hide();
		},
	},
	mounted() {
		// la carte est initialisée après la connexion (dans la méthode login)
	},
});
vueApp.config.errorHandler = (err, instance, info) => {
	console.log("Erreur **************************************");
	console.log("Message : " + err.message);
	console.log(`vueApp.erreur : ${vueApp.erreur}`);
	console.log(`info : ${info}`);
    console.error(err);

	const error = Vue.toRef(instance, "erreur");
	error.value = err;

	// recupérer l'instance de la fenêtre modale pour l'affichage des erreurs
	// et l'afficher
	const modal = bootstrap.Modal.getOrCreateInstance("#errorDialog");
	modal.show();
};
vueApp.mount("#app");
