document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    localStorage.setItem("email", email);
    localStorage.setItem("senha", senha);

    if (latSelecionada !== null && lngSelecionada !== null) {
        localStorage.setItem("latitude", latSelecionada);
        localStorage.setItem("longitude", lngSelecionada);
    } else {
        alert("Por favor, selecione sua localização no mapa antes de enviar.");
        return; 
    }

    alert("Dados salvos com sucesso!");
});

document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('mapa').setView([-24.9555, -53.4555], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    setTimeout(() => {
        map.invalidateSize();
    }, 200);

    var marker;

    let latSelecionada = null;
    let lngSelecionada = null;

    map.on('click', function(e) {
    latSelecionada = e.latlng.lat;
    lngSelecionada = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([latSelecionada, lngSelecionada]).addTo(map).openPopup();
    });

});
