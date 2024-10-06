// مفتاح خريطة Mapbox الخاص بك
mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';

let map;
let marker;

// تحميل الخريطة وتحديد الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initMap(); // تهيئة الخريطة
    loadLocations(); // تحميل المواقع المخزنة وعرضها في الجدول

    document.getElementById('locationForm').addEventListener('submit', addLocation); // إضافة موقع جديد
    document.getElementById('locateButton').addEventListener('click', locateUser); // تحديد موقع المستخدم الحالي
});

// تهيئة الخريطة باستخدام Mapbox
function initMap() {
    map = new mapboxgl.Map({
        container: 'map', // العنصر HTML الذي يحتوي على الخريطة
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [46.6753, 24.7136], // خطوط الطول والعرض لمدينة الرياض
        zoom: 9
    });

    // عند تحميل الخريطة، السماح للمستخدم بإضافة علامة مكان عن طريق النقر على الخريطة
    map.on('load', function () {
        map.on('click', function(e) {
            setMarker(e.lngLat); // إضافة الماركر عند النقر
        });
    });
}

// إضافة أو تحديث الماركر على الخريطة بناءً على الإحداثيات
function setMarker(lngLat) {
    if (marker) {
        marker.remove();
    }
    marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map);

    document.getElementById('latitude').value = lngLat.lat.toFixed(6); // تحديث الحقول بالقيم الجديدة
    document.getElementById('longitude').value = lngLat.lng.toFixed(6);
}

// تحديد موقع المستخدم بناءً على الـ GPS الخاص بالمتصفح
function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lngLat = {
                lng: position.coords.longitude,
                lat: position.coords.latitude
            };
            map.flyTo({
                center: lngLat,
                zoom: 14
            });
            setMarker(lngLat); // تحديث الماركر بموقع المستخدم
        }, function(error) {
            console.error("خطأ في تحديد الموقع:", error);
            alert("لم نتمكن من تحديد موقعك. يرجى التأكد من تفعيل خدمة تحديد الموقع في متصفحك.");
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("متصفحك لا يدعم تحديد الموقع.");
    }
}

// إرسال موقع جديد إلى الخادم وإضافته إلى قاعدة البيانات
document.getElementById('add-location-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    const newLocation = { name, description, latitude, longitude };

    try {
        const response = await fetch('/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLocation)
        });

        if (response.ok) {
            alert('تم إضافة الموقع بنجاح');
            loadLocations(); // تحديث المواقع بعد الإضافة
        } else {
            alert('حدث خطأ أثناء إضافة الموقع');
        }
    } catch (error) {
        alert('حدث خطأ أثناء الاتصال بالخادم');
    }
});

// تحميل المواقع وعرضها في الجدول
async function loadLocations() {
    try {
        const response = await fetch('/api/locations');
        const locations = await response.json();

        const tableBody = document.getElementById('locationsTableBody');
        tableBody.innerHTML = ''; // تفريغ الجدول قبل إضافة البيانات الجديدة

        locations.forEach((location, index) => {
            const row = tableBody.insertRow(); // إنشاء صف جديد في الجدول
            row.insertCell(0).textContent = location.name; // اسم الموقع
            row.insertCell(1).textContent = location.description; // وصف الموقع
            row.insertCell(2).textContent = `${location.latitude}, ${location.longitude}`; // الإحداثيات

            const actionsCell = row.insertCell(3);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteLocation(location._id); // إضافة زر حذف
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('خطأ في تحميل المواقع:', error);
    }
}

// حذف الموقع من قاعدة البيانات
async function deleteLocation(id) {
    try {
        const response = await fetch(`/api/locations/${id}`, { method: 'DELETE' });

        if (response.ok) {
            loadLocations(); // تحديث المواقع بعد الحذف
        } else {
            const errorData = await response.json();
            alert(`خطأ: ${errorData.message}`);
        }
    } catch (error) {
        console.error('خطأ في حذف الموقع:', error);
    }
}
