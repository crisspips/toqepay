// Efecto sticky en el header al hacer scroll
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 50);
});

// Detectar cuando los elementos entren en la vista y aplicar fade-in
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    observer.observe(element);
});

// Añadir la clase "fade-in" a los elementos al cargar la página
window.addEventListener('load', function() {
    document.querySelectorAll('.fade-in').forEach(element => {
        element.classList.add('fade-in');
    });
});

// Función para actualizar la bandera seleccionada
function actualizarBandera(selectId, flagClass) {
    const select = document.getElementById(selectId);
    const flagImg = select.nextElementSibling;
    const selectedOption = select.options[select.selectedIndex];
    const flagSrc = selectedOption.getAttribute('data-flag');
    flagImg.src = flagSrc;
    flagImg.alt = `Bandera de ${selectedOption.text}`;
}

// Función para actualizar la moneda opuesta
function actualizarMonedaOpuesta(changedSelectId) {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    
    if (changedSelectId === "fromCurrency") {
        toCurrency.value = fromCurrency.value === "CLP" ? "BOB" : "CLP";
        actualizarBandera("toCurrency", "to-flag");
    } else {
        fromCurrency.value = toCurrency.value === "CLP" ? "BOB" : "CLP";
        actualizarBandera("fromCurrency", "from-flag");
    }
}

// Event listeners para los selectores de moneda
document.getElementById("fromCurrency").addEventListener("change", function() {
    actualizarBandera("fromCurrency", "from-flag");
    actualizarMonedaOpuesta("fromCurrency");
    obtenerTasaDeCambio();
});

document.getElementById("toCurrency").addEventListener("change", function() {
    actualizarBandera("toCurrency", "to-flag");
    actualizarMonedaOpuesta("toCurrency");
    obtenerTasaDeCambio();
});

// Inicializar las monedas y banderas al cargar la página
window.addEventListener('load', function() {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    // Establecer valores por defecto
    fromCurrency.value = "CLP";
    toCurrency.value = "BOB";

    actualizarBandera("fromCurrency", "from-flag");
    actualizarBandera("toCurrency", "to-flag");
    obtenerTasaDeCambio();
});

// Función para obtener la tasa de cambio
function obtenerTasaDeCambio() {
    const monto = parseFloat(document.getElementById("amount").value);
    const deMoneda = document.getElementById("fromCurrency").value;
    const aMoneda = document.getElementById("toCurrency").value;
    
    if (isNaN(monto)) {
        alert("Por favor, ingrese un monto válido.");
        return;
    }

    const tasasDeCambio = {
        "CLP_BOB": 0.0120,   // AQUI SE REALIZA EL CAMBIO DE TAZA DIARIO
        "BOB_CLP": 80,
    };

    const tasaClave = `${deMoneda}_${aMoneda}`;
    let tasaDeCambio = tasasDeCambio[tasaClave] || 1 / tasasDeCambio[`${aMoneda}_${deMoneda}`] || 1;

    const total = monto * tasaDeCambio;
    document.getElementById("exchangeRate").innerText = `${monto.toFixed(2)} ${deMoneda} = ${total.toFixed(2)} ${aMoneda}`;
    document.getElementById("lastUpdate").innerText = `Última actualización de la tasa: ${new Date().toLocaleString()}`;
}

// Agregar un event listener para el campo de monto
document.getElementById("amount").addEventListener("input", obtenerTasaDeCambio);
