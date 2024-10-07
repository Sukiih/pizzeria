const menu = document.getElementById('menu');
const menuItems = menu.querySelectorAll('.card');
const carritoBtn = document.getElementById('carritoBtn');
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
const listaProductos = document.getElementById('listaProductos');
const totalElement = document.getElementById('total');
const mensajeBusqueda = document.getElementById('mensajeBusqueda');
let productosCarrito = [];
let totalPrecio = 0;
const numeroWhatsApp = '56945146281';

// obtener el precio de las pizzas
const obtenerPrecio = (pizza) => {
    const precioText = pizza.querySelector('.card-price').textContent;
    const precioMatch = precioText.match(/[\d.,]+/);
    return precioMatch ? parseFloat(precioMatch[0].replace(',', '.')) : NaN;
};

// agregar productos al carrito
const agregarAlCarrito = (pizza) => {
    const nombre = pizza.querySelector('.card-title').textContent;
    const precio = obtenerPrecio(pizza);

    if (isNaN(precio)) {
        console.error('No se pudo obtener el precio de la pizza:', pizza);
        return; 
    }

    productosCarrito.push({ nombre, precio });
    totalPrecio += precio;
    mostrarProductosCarrito();
    mostrarMensaje('Producto agregado'); 
};

const mostrarMensaje = (mensaje) => {
    const mensajeElemento = document.createElement('div');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.className = 'mensaje'; 
    document.body.appendChild(mensajeElemento);
    
    setTimeout(() => {
        mensajeElemento.remove(); 
    }, 3000);
};

// mostrar productos en el carrito
const mostrarProductosCarrito = () => {
    listaProductos.innerHTML = productosCarrito.map((producto, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${producto.nombre} 
            <span>$${producto.precio.toFixed(2)}</span>
            <button class="btn btn-danger btn-sm ms-2" data-index="${index}">Eliminar</button>
        </li>
    `).join('');

    document.getElementById('cantidadProductos').textContent = productosCarrito.length;
    totalElement.textContent = `Total: $${totalPrecio.toFixed(2)}`;
};

// eliminar un producto del carrito
const eliminarProducto = (index) => {
    totalPrecio -= productosCarrito[index].precio;
    productosCarrito.splice(index, 1);
    mostrarProductosCarrito();
};

// vaciar el carrito
const vaciarCarrito = () => {
    productosCarrito = [];
    totalPrecio = 0;
    mostrarProductosCarrito();
    alert('El carrito ha sido vaciado.'); //modificar
}; 

// Evento vaciar carrito
document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);

// Abrir carrito
carritoBtn.addEventListener('click', () => {
    carritoModal.show();
});

// Botón de pago (redirige a pag que aún no hago x.x)
document.getElementById('pagar').addEventListener('click', () => {
    window.location.href = 'pagina-de-pago.html';
});

// Agregar productos al carrito
menuItems.forEach((item) => {
    item.querySelector('button').addEventListener('click', () => {
        agregarAlCarrito(item);
    });
});

// Formulario de contacto
const formulario = document.getElementById('contacto');
const nombreInput = formulario.querySelector('#nombre');
const telefonoInput = formulario.querySelector('#telefono');
const mensajeInput = formulario.querySelector('#mensaje');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!nombreInput.value || !telefonoInput.value || !mensajeInput.value) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const mensaje = `Nombre: ${nombreInput.value}\nTeléfono: ${telefonoInput.value}\nMensaje: ${mensajeInput.value}`;
    const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(enlaceWhatsApp, '_blank');
});

// Aplicar descuentos a las pizzas (aún no lo aplico)
const aplicarDescuentos = () => {
    const pizzas = document.querySelectorAll('.card');
    pizzas.forEach((pizza) => {
        const descuento = pizza.querySelector('.text-danger'); 
        const precio = obtenerPrecio(pizza);

        if (descuento) {
            const porcentaje = parseFloat(descuento.textContent.replace('%', ''));
            const nuevoPrecio = calcularDescuento(precio, porcentaje);
            pizza.querySelector('.card-price').textContent = `Precio: ${nuevoPrecio}`;
        }
    });
};

const calcularDescuento = (precio, porcentaje) => {
    return `$${(precio - (precio * porcentaje / 100)).toFixed(2)}`;
};

// barra de busqueda
const buscar = document.getElementById('buscar');

buscar.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const pizzas = document.querySelectorAll('.card');
    let hayCoincidencias = false;
    const coincidencias = [];

    pizzas.forEach((pizza) => {
        const titulo = pizza.querySelector('.card-title').textContent.toLowerCase();
        if (titulo.includes(texto)) {
            pizza.style.display = 'inline-block';
            hayCoincidencias = true; 
            coincidencias.push(pizza);
        } else {
            pizza.style.display = 'none';
        }
    });

    if (!hayCoincidencias) {
        mensajeBusqueda.textContent = "No hay coincidencias para tu búsqueda.";
        mensajeBusqueda.style.display = 'block'; 
        mensajeBusqueda.style.textAlign = 'center';
        mensajeBusqueda.style.marginTop = '100px';
    } else {
        mensajeBusqueda.style.display = 'none'; 
    }

    reorganizarTarjetas(coincidencias);
});

// reorganizar tarjetas eliminando espacios en blanco
function reorganizarTarjetas(coincidencias) {
    const menuContainer = document.getElementById('menu');
    coincidencias.forEach((pizza) => {
        menuContainer.appendChild(pizza); 
    });
}

listaProductos.addEventListener('click', (e) => {
    if (e.target.matches('.btn-danger')) {
        const index = e.target.dataset.index;
        eliminarProducto(index);
    }
});
