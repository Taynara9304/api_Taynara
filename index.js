//gerar mapa
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

        obterEnderecoPorCoordenadas(latSelecionada, lngSelecionada);
    });

    carregarEstados(); //modifiquei aqui

    document.getElementById('cep').addEventListener('blur', consultarCEP);


});

//enviar dados do form
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


// function obterEnderecoPorCoordenadas(lat, lon) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.address) {
//                 const address = data.address;

//                 document.getElementById('rua').value = address.road || '';
//                 document.getElementById('bairro').value = address.suburb || address.village || address.hamlet || '';
//                 document.getElementById('cidade').value = address.city || address.town || address.village || '';
//                 document.getElementById('estado').value = address.state || '';
//                 document.getElementById('cep').value = address.postcode || '';
                
//                 document.getElementById('num').value = address.house_number || '';
//             } else {
//                 alert('Endereço não encontrado para essas coordenadas.');
//             }
//         })
//         .catch(error => {
//             console.error('Erro ao obter endereço:', error);
//             alert('Erro ao buscar o endereço pelas coordenadas.');
//         });
// }

function obterEnderecoPorCoordenadas(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                const address = data.address;

                document.getElementById('rua').value = address.road || '';
                document.getElementById('bairro').value = address.suburb || address.village || address.hamlet || '';
                document.getElementById('cidade').value = address.city || address.town || address.village || '';
                
                // Mapeia nome do estado para sigla
                const estadosBR = {
                    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
                    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
                    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
                    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
                    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
                    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
                    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
                };

                const siglaEstado = estadosBR[address.state] || '';
                document.getElementById('estado').value = siglaEstado;

                document.getElementById('num').value = address.house_number || '';
                document.getElementById('cep').value = address.postcode || '';
            } else {
                alert('Endereço não encontrado para essas coordenadas.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter endereço:', error);
            alert('Erro ao buscar o endereço pelas coordenadas.');
        });
}


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
                limparCamposEndereco();
            } else {
                document.getElementById('rua').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || ''; //modifiquei aqui
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

// function obterEnderecoPorCoordenadas(lat, lon) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.address) {
//                 const address = data.address;

//                 document.getElementById('rua').value = address.road || '';
//                 document.getElementById('bairro').value = address.suburb || address.village || address.hamlet || '';
//                 document.getElementById('cidade').value = address.city || address.town || address.village || '';
//                 document.getElementById('estado').value = ufRecebidaDaAPI;
//                 document.getElementById('estado').value = address.state ||  address.state_code || ''; //modifiquei aqui
//                 document.getElementById('num').value = address.house_number || ''; //modifiquei aqui
//                 document.getElementById('cep').value = address.postcode || '';
                
//             } else {
//                 alert('Endereço não encontrado para essas coordenadas.');
//             }
//         })
//         .catch(error => {
//             console.error('Erro ao obter endereço:', error);
//             alert('Erro ao buscar o endereço pelas coordenadas.');
//         });
// }

function obterEnderecoPorCoordenadas(lat, lon) {
    console.log('Consultando endereço para:', lat, lon);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=pt`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta Nominatim:', data);

            if (data && data.address) {
                const address = data.address;

                const estadosBR = {
                    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
                    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
                    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
                    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
                    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
                    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
                    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
                };

                document.getElementById('rua').value = address.road || '';
                document.getElementById('bairro').value = address.suburb || address.village || address.hamlet || '';
                document.getElementById('cidade').value = address.city || address.town || address.village || '';
                document.getElementById('num').value = address.house_number || '';
                document.getElementById('cep').value = address.postcode || '';

                const siglaEstado = estadosBR[address.state] || '';
                document.getElementById('estado').value = siglaEstado;

            } else {
                alert('Endereço não encontrado para essas coordenadas.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter endereço:', error);
            alert('Erro ao buscar o endereço pelas coordenadas.');
        });
}


function carregarEstados() {
    const selectEstado = document.getElementById("estado");
    selectEstado.innerHTML = '<option value="">Selecione um estado</option>';

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(response => response.json())
        .then(estados => {
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            estados.forEach(estado => {
                const option = document.createElement("option");
                option.value = estado.sigla;
                option.textContent = estado.nome;
                selectEstado.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar estados:", error);
        });
}

const estadosBR = {
    "Acre": "AC",
    "Alagoas": "AL",
    "Amapá": "AP",
    "Amazonas": "AM",
    "Bahia": "BA",
    "Ceará": "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    "Pará": "PA",
    "Paraíba": "PB",
    "Paraná": "PR",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    "Rondônia": "RO",
    "Roraima": "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    "Sergipe": "SE",
    "Tocantins": "TO"
};
