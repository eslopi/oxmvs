mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});

const form = document.getElementById('place-form');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // جلب بيانات المدخلات من النموذج
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('image-url').value;
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);

    // إرسال البيانات إلى الخادم لحفظها في MongoDB
    try {
        const response = await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, imageUrl, lat, lng })
        });

        if (response.ok) {
            new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}</p>`))
                .addTo(map);
            
            alert('تمت إضافة المكان بنجاح');
        } else {
            alert('حدث خطأ أثناء إضافة المكان');
        }
    } catch (error) {
        console.error('حدث خطأ أثناء الاتصال بالخادم:', error);
    }

    form.reset(); // إعادة تعيين النموذج بعد الإضافة
});

// تحميل المواقع المخزنة من MongoDB وعرضها على الخريطة
async function loadLocations() {
    try {
        const response = await fetch('/api/locations');
        const places = await response.json();

        places.forEach(place => {
            new mapboxgl.Marker()
                .setLngLat([place.lng, place.lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3><p>${place.description}</p>`))
                .addTo(map);
        });
    } catch (error) {
        console.error('خطأ في تحميل المواقع:', error);
    }
}

// استدعاء دالة تحميل المواقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadLocations);
