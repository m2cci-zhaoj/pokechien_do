const participantsUrl = "http://localhost:8080/participants/find?nom=";
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
			participantName: "", // valeur de nom pour la recherche de participants
			participants: null, // liste des participants trouvés correspondant au nom de participant saisi
			map: null, // la map associée à la vue
			selectedStop: null, // le stop sélectionné
			selectedStopComment: null, // le commentaire du stop sélectionné
			colors: ["#e9002c", "#c7ff39", "#bba958", "#c1ca7f", "#d8e7ad", "#edcf6e", "#dca28a", "#c27990", "#a0577f", "#744348"],
			erreur : null, // objet Error en cas d'erreur d'exécution
		};
	},
	methods: {
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
				let response = await fetch("http://localhost:8080/stops/" + participant.id);
				let geoJSON = await response.json();
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
				method: "POST",
				body: JSON.stringify(stop),  // transforme l'opbjet post en chaîne JSON
				headers: {
					"Content-Type": "application/json",
				},
			});
			myModal.hide();
		},
	},
	mounted() {
		// méthode invoquée quand le composant Vue a été monté
		// initialise la carte centrée sur Grenoble
		this.map = L.map("map").setView([45.1875602, 5.7357819], 13);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom: 18,
			tileSize: 512,
			zoomOffset: -1,
		}).addTo(this.map);
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
