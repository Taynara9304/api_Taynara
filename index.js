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

    // Adiciona evento no campo CEP para buscar os dados ao sair do campo
    document.getElementById('cep').addEventListener('blur', consultarCEP);
});

function consultarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    if (cep.length !== 8) {
        alert("CEP inválido. Por favor, digite um CEP válido.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado.');
                // Limpa os campos caso CEP inválido
                limparCamposEndereco();
            } else {
                // Preenche os campos automaticamente
                document.getElementById('rua').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || '';
            }
        })
        .catch(error => {
            alert('Ocorreu um erro ao consultar o CEP.');
            console.error(error);
            limparCamposEndereco();
        });
}

function limparCamposEndereco() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

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
