mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A'; // مفتاح Mapbox API

let map;

document.addEventListener('DOMContentLoaded', function () {
    initMap(); // تهيئة الخريطة عند تحميل الصفحة
    loadLocations(); // تحميل وعرض المواقع على الخريطة وعرض المعلومات
});

// تهيئة الخريطة
function initMap() {
    map = new mapboxgl.Map({
        container: 'map', // اسم العنصر HTML الذي يحتوي على الخريطة
        style: 'mapbox://styles/mapbox/streets-v11', // نمط الخريطة
        center: [46.6753, 24.7136], // خطوط الطول والعرض الافتراضية (الرياض)
        zoom: 9 // مستوى التكبير الافتراضي
    });
}

// دالة لتحميل المواقع من الخادم وعرضها على الخريطة وفي صفحة المعلومات
async function loadLocations() {
    try {
        const response = await fetch('/api/locations'); // جلب البيانات من الخادم
        const locations = await response.json();

        locations.forEach((location) => {
            // إضافة المواقع إلى الخريطة باستخدام Mapbox
            new mapboxgl.Marker()
                .setLngLat([location.longitude, location.latitude]) // استخدام خطوط الطول والعرض
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3><p>${location.description}</p>`))
                .addTo(map);

            // إضافة معلومات المواقع في الجدول
            addLocationToTable(location);
        });
    } catch (error) {
        console.error('حدث خطأ أثناء جلب المواقع:', error);
    }
}

// دالة لإضافة معلومات الموقع إلى الجدول
function addLocationToTable(location) {
    const tableBody = document.getElementById('locationsTableBody');

    const row = tableBody.insertRow(); // إنشاء صف جديد
    const nameCell = row.insertCell(0); // خلية اسم المكان
    const descriptionCell = row.insertCell(1); // خلية الوصف
    const coordinatesCell = row.insertCell(2); // خلية الإحداثيات

    nameCell.textContent = location.name;
    descriptionCell.textContent = location.description;
    coordinatesCell.textContent = `(${location.latitude}, ${location.longitude})`;
}
