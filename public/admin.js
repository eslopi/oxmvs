mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45.0792, 23.8859],
    zoom: 5
});

let places = [];
let markers = [];

// إنشاء اتصال Socket.IO
const socket = io();

function fetchPlaces() {
    fetch('/api/places')
        .then(response => response.json())
        .then(data => {
            places = data;
            clearMarkers();
            addMarkers();
        });
}

function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

function addMarkers() {
    places.forEach(place => {
        addMarker(place);
    });
}

function addMarker(place) {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(${place.icon})`;
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundSize = '100%';

    el.addEventListener('click', () => {
        showPlaceInfo(place);
    });

    const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lng, place.lat])
        .addTo(map);

    markers.push(marker);
}

function showPlaceInfo(place) {
    document.getElementById('place-name').textContent = place.name;
    document.getElementById('place-description').textContent = place.description;
    document.getElementById('place-image').src = place.image;
    document.getElementById('no-place-selected').style.display = 'none';
    document.getElementById('place-info').style.display = 'block';
}

// استمع لأحداث إضافة مكان جديد
socket.on('newPlace', (place) => {
    places.push(place);
    addMarker(place);
});

// التحميل الأولي للأماكن
fetchPlaces();
