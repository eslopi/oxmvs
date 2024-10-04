mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
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

// إضافة زر تحديد الموقع
const locateButton = document.getElementById('locate-button');
let userLocationMarker;

locateButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // تحريك الخريطة إلى الموقع الحالي
            map.flyTo({
                center: [lng, lat],
                zoom: 14
            });

            // إزالة العلامة السابقة للمستخدم إن وجدت
            if (userLocationMarker) {
                userLocationMarker.remove();
            }

            // إضافة علامة جديدة على الموقع الحالي
            userLocationMarker = new mapboxgl.Marker({ color: '#FF0000' })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML("<h3>موقعك الحالي</h3>"))
                .addTo(map);
        }, (error) => {
            console.error("خطأ في تحديد الموقع:", error.message);
            alert("حدث خطأ أثناء محاولة تحديد موقعك. يرجى التأكد من تفعيل خدمة تحديد الموقع.");
        });
    } else {
        alert("متصفحك لا يدعم تحديد الموقع.");
    }
});
