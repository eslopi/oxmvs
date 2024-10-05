mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45.0792, 23.8859],
    zoom: 5
});

let places = [];

function fetchPlaces() {
    fetch('/api/places')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched places:', data); // للتحقق من البيانات المستلمة
            places = data;
            addMarkers();
        })
        .catch(error => {
            console.error('Error fetching places:', error);
        });
}

function addMarkers() {
    places.forEach(place => {
        if (!place.lng || !place.lat) {
            console.error('Invalid coordinates for place:', place);
            return;
        }

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = place.icon ? `url(${place.icon})` : 'url(https://placekitten.com/g/40/40)';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            showPlaceInfo(place);
        });

        try {
            new mapboxgl.Marker(el)
                .setLngLat([parseFloat(place.lng), parseFloat(place.lat)])
                .addTo(map);
            console.log('Marker added for:', place.name);
        } catch (error) {
            console.error('Error adding marker for:', place.name, error);
        }
    });
}

function showPlaceInfo(place) {
    document.getElementById('place-name').textContent = place.name || 'غير معروف';
    document.getElementById('place-description').textContent = place.description || 'لا يوجد وصف';
    document.getElementById('place-image').src = place.image || 'https://placekitten.com/g/300/200';
    document.getElementById('no-place-selected').style.display = 'none';
    document.getElementById('place-info').style.display = 'block';
}

// تحميل الأماكن عند تحميل الصفحة
map.on('load', fetchPlaces);
