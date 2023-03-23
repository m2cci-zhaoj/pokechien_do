const participantsUrl = 'http://localhost:8080/participants/find?nom=';

const app = Vue.createApp({
    data() {
        return {
            newMarker: null,
            participantName: '',  // valeur de nom pour la recherche de participants
            participants: [], // liste des participants trouvés correspondant à l'adresse saisie
            map: null, // la map associée à la vue
            errorMessage: null, // pour afficher des messages d'erreur
            colors: ['#e9002c', '#c7ff39', '#bba958', '#c1ca7f', '#d8e7ad', '#edcf6e', '#dca28a', '#c27990', '#a0577f', '#744348'],
        }
    },
    methods: {
        /**
         * pour chercher un participant
         */
        async findParticipants() {
            this.errorMessage = null;
            try {
                if (this.participants.length > 0) {
                    for (let participant of this.participants) {
                        if (participant.stopsLayer)
                            participant.stopsLayer.remove(this.map);
                    }
                }
                let response = await fetch(participantsUrl + encodeURI(this.participantName))
                if (response.ok) {
                    let data = await response.json();
                    if (data.length > 0) {
                        this.participants = data
                        for (let i = 0; i < data.length; i++) {
                            this.participants[i].markerColor = this.colors[i % this.colors.length];
                        }
                    }
                    else {
                        this.errorMessage = `Pas de participant dont le nom contient ${this.participantName}`;
                    }
                } else {
                    this.errorMessage = "Erreur " + response.status;
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = "Erreur " + error.message;
            }
        },
        async displayStops(participant) {
            if (!participant.stopsLayer) {

                let geojsonMarkerOptions = {
                    radius: 8,
                    fillColor: participant.markerColor,
                    color: "#000",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                let response = await fetch("http://localhost:8080/stops/" + participant.id);
                let geoJSON = await response.json();
                participant.stopsLayer = L.geoJSON(geoJSON, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(`<p>${participant.prenom} ${participant.nom}</p>
                         date début : ${feature.properties.date_debut}<br>
                         date fin : ${feature.properties.date_fin}
                        `);
                    }
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
    },
    mounted() {
        // méthode invoquée quand le composant Vue a été monté
        // initialise la carte centrée sur Grenoble
        this.map = L.map('map').setView([45.1875602, 5.7357819], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1
        }).addTo(this.map);

        // Ajouter un événement click à la carte
        this.map.on('click', e => {
            // Récupérer les coordonnées du point cliqué
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            if (this.newMarker) {
                this.newMarker.remove();
            }

            // Afficher les coordonnées dans la console
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            this.newMarker = L.marker(e.latlng).addTo(this.map)
        });

    },

})
    .mount("#app")