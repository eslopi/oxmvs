mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});

const form = document.getElementById('place-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('image-url').value;
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);

    new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}</p>`))
        .addTo(map);

    const places = JSON.parse(localStorage.getItem('places') || '[]');
    places.push({ name, description, imageUrl, lat, lng });
    localStorage.setItem('places', JSON.stringify(places));

    form.reset();
});

const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');
savedPlaces.forEach(place => {
    new mapboxgl.Marker()
        .setLngLat([place.lng, place.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3><p>${place.description}</p>`))
        .addTo(map);
});

// إضافة زر تحديد الموقع
const locateButton = document.getElementById('locate-button');
locateButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // تحديث حقول الإدخال بالإحداثيات الحالية
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            
            // تحريك الخريطة إلى الموقع الحالي
            map.flyTo({
                center: [lng, lat],
                zoom: 14
            });

            // إضافة علامة على الموقع الحالي
            new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);
        }, (error) => {
            console.error("خطأ في تحديد الموقع:", error.message);
            alert("حدث خطأ أثناء محاولة تحديد موقعك. يرجى التأكد من تفعيل خدمة تحديد الموقع.");
        });
    } else {
        alert("متصفحك لا يدعم تحديد الموقع.");
    }
});
