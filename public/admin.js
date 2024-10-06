// admin.js

mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A'; // استبدل بمفتاح الوصول الخاص بك

let map;
let marker;

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadLocations();

    document.getElementById('locationForm').addEventListener('submit', addLocation);
    document.getElementById('locateButton').addEventListener('click', locateUser);
});

function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [46.6753, 24.7136], // خطوط الطول والعرض لمدينة الرياض
        zoom: 9
    });

    map.on('load', function () {
        map.on('click', function(e) {
            setMarker(e.lngLat);
        });
    });
}

function setMarker(lngLat) {
    if (marker) {
        marker.remove();
    }
    marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map);

    document.getElementById('latitude').value = lngLat.lat.toFixed(6);
    document.getElementById('longitude').value = lngLat.lng.toFixed(6);
}

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
            setMarker(lngLat);
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

async function addLocation(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const info = document.getElementById('info').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    if (!name || isNaN(latitude) || isNaN(longitude)) {
        alert('الرجاء إدخال جميع البيانات المطلوبة بشكل صحيح');
        return;
    }

    const location = { name, description, info, latitude, longitude };

    try {
        const response = await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location)
        });

        if (response.ok) {
            loadLocations();
            document.getElementById('locationForm').reset();
        } else {
            const errorData = await response.json();
            alert(`خطأ: ${errorData.message}`);
        }
    } catch (error) {
        console.error('خطأ في إضافة الموقع:', error);
    }
}

async function loadLocations() {
    try {
        const response = await fetch('/api/locations');
        const locations = await response.json();

        const tableBody = document.getElementById('locationsTableBody');
        tableBody.innerHTML = '';

        locations.forEach((location, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = location.name;
            row.insertCell(1).textContent = location.description;
            row.insertCell(2).textContent = location.info;
            row.insertCell(3).textContent = location.latitude;
            row.insertCell(4).textContent = location.longitude;

            const actionsCell = row.insertCell(5);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.onclick = () => deleteLocation(location._id);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('خطأ في تحميل المواقع:', error);
    }
}

async function deleteLocation(id) {
    try {
        const response = await fetch(`/api/locations/${id}`, { method: 'DELETE' });

        if (response.ok) {
            loadLocations();
        } else {
            const errorData = await response.json();
            alert(`خطأ: ${errorData.message}`);
        }
    } catch (error) {
        console.error('خطأ في حذف الموقع:', error);
    }
}
