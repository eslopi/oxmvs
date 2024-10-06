mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});

const infoContainer = document.getElementById('info-container');

// جلب المواقع من MongoDB وعرضها على الخريطة وفي قائمة المعلومات
async function loadLocations() {
    try {
        const response = await fetch('/api/locations');
        const places = await response.json();

        places.forEach(place => {
            // إضافة الماركرات على الخريطة
            new mapboxgl.Marker()
                .setLngLat([place.lng, place.lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3><p>${place.description}</p>`))
                .addTo(map);

            // إضافة المعلومات في الجزء الخاص بالمعلومات
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

        if (places.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            places.forEach(place => {
                bounds.extend([place.lng, place.lat]);
            });
            map.fitBounds(bounds, { padding: 50 });
        }
    } catch (error) {
        console.error('حدث خطأ أثناء جلب المواقع:', error);
    }
}

// استدعاء دالة تحميل المواقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadLocations);
