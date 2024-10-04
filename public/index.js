mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A'; // استبدل بمفتاح الوصول الخاص بك

let map;

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadLocations();
});

function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [46.6753, 24.7136], // خطوط الطول والعرض لمدينة الرياض
        zoom: 9
    });
}

function loadLocations() {
    const locations = JSON.parse(localStorage.getItem('locations')) || [];
    locations.forEach(location => {
        const marker = new mapboxgl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .addTo(map);

        marker.getElement().addEventListener('click', () => {
            showLocationInfo(location);
        });
    });
}

function showLocationInfo(location) {
    const infoPanel = document.getElementById('location-info');
    infoPanel.innerHTML = `
        <h3>${location.name}</h3>
        <p><strong>الوصف:</strong> ${location.description}</p>
        <p><strong>معلومات إضافية:</strong> ${location.info}</p>
        <p><strong>الموقع:</strong> ${location.latitude}, ${location.longitude}</p>
    `;
}