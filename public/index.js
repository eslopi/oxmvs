mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});


// جلب المواقع من قاعدة البيانات باستخدام API وعرضها على الخريطة
async function fetchLocations() {
    try {
        const response = await fetch('/api/locations');
        const locations = await response.json();

        locations.forEach((location) => {
            // إضافة المواقع إلى الخريطة باستخدام Mapbox
            new mapboxgl.Marker()
                .setLngLat([location.longitude, location.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3><p>${location.description}</p>`))
                .addTo(map);
        });
    } catch (error) {
        console.error('حدث خطأ أثناء جلب المواقع:', error);
    }
}

// استدعاء دالة جلب المواقع عند تحميل الصفحة
fetchLocations();
