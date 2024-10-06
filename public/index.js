mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});

const infoContainer = document.getElementById('info-container');

const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');

savedPlaces.forEach(place => {
    new mapboxgl.Marker()
        .setLngLat([place.lng, place.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3><p>${place.description}</p>`))
        .addTo(map);

    const placeInfo = document.createElement('div');
    placeInfo.className = 'place-info';
    placeInfo.innerHTML = `
        <h2>${place.name}</h2>
        <p>${place.description}</p>
        ${place.imageUrl ? `<img src="${place.imageUrl}" alt="${place.name}">` : ''}
        <p>الإحداثيات: ${place.lat}, ${place.lng}</p>
    `;
    infoContainer.appendChild(placeInfo);
});

if (savedPlaces.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    savedPlaces.forEach(place => {
        bounds.extend([place.lng, place.lat]);
    });
    map.fitBounds(bounds, { padding: 50 });
}
