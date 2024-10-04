mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [45, 25],
    zoom: 5
});

let marker;

map.on('click', (e) => {
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);

    if (marker) marker.remove();
    marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
});

const form = document.getElementById('place-form');
const placesTable = document.getElementById('places-table').getElementsByTagName('tbody')[0];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const imageUrl = document.getElementById('imageUrl').value;

    const newPlace = { name, description, lat, lng, imageUrl };
    
    const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');
    savedPlaces.push(newPlace);
    localStorage.setItem('places', JSON.stringify(savedPlaces));

    form.reset();
    if (marker) marker.remove();
    updatePlacesTable();
    alert('تمت إضافة المكان بنجاح!');
});

function updatePlacesTable() {
    const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');
    placesTable.innerHTML = '';

    savedPlaces.forEach((place, index) => {
        const row = placesTable.insertRow();
        row.innerHTML = `
            <td>${place.name}</td>
            <td>${place.description.substring(0, 50)}${place.description.length > 50 ? '...' : ''}</td>
            <td>${place.lat}</td>
            <td>${place.lng}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editPlace(${index})">تعديل</button>
                    <button class="delete-btn" onclick="deletePlace(${index})">حذف</button>
                </div>
            </td>
        `;
    });
}

function editPlace(index) {
    const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');
    const place = savedPlaces[index];

    document.getElementById('name').value = place.name;
    document.getElementById('description').value = place.description;
    document.getElementById('lat').value = place.lat;
    document.getElementById('lng').value = place.lng;
    document.getElementById('imageUrl').value = place.imageUrl || '';

    if (marker) marker.remove();
    marker = new mapboxgl.Marker()
        .setLngLat([place.lng, place.lat])
        .addTo(map);

    map.flyTo({
        center: [place.lng, place.lat],
        zoom: 14
    });

    savedPlaces.splice(index, 1);
    localStorage.setItem('places', JSON.stringify(savedPlaces));
    updatePlacesTable();
}

function deletePlace(index) {
    if (confirm('هل أنت متأكد من حذف هذا المكان؟')) {
        const savedPlaces = JSON.parse(localStorage.getItem('places') || '[]');
        savedPlaces.splice(index, 1);
        localStorage.setItem('places', JSON.stringify(savedPlaces));
        updatePlacesTable();
    }
}

// تحديث الجدول عند تحميل الصفحة
updatePlacesTable();
