mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45.0792, 23.8859],
    zoom: 5
});

let places = [];

fetch('/api/places')
    .then(response => response.json())
    .then(data => {
        places = data;
        addMarkers();
    });

function addMarkers() {
    places.forEach(place => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${place.icon})`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            showPlaceInfo(place);
        });

        new mapboxgl.Marker(el)
            .setLngLat([place.lng, place.lat])
            .addTo(map);
    });
}

function showPlaceInfo(place) {
    document.getElementById('place-name').textContent = place.name;
    document.getElementById('place-description').textContent = place.description;
    document.getElementById('place-image').src = place.image;
    document.getElementById('info-panel').style.display = 'block';
}

document.getElementById('close-info').addEventListener('click', () => {
    document.getElementById('info-panel').style.display = 'none';
});
