// Define la función validateProduct
function validateProduct(product) {
    return Object.values(product).every(value => value !== '');
}

// Define la función saveToLocalStorage
function saveToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

document.addEventListener('DOMContentLoaded', () => {
    const viewCartButton = document.getElementById('view-cart');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');

    viewCartButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

// Primer event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const imageInput = document.getElementById('imagen');
        const reader = new FileReader();

        reader.onload = () => {
            const newProduct = {
                presupuesto: document.getElementById('presupuesto').value,
                unidad: document.getElementById('unidad').value,
                producto: document.getElementById('producto').value,
                cantidad: document.getElementById('cantidad').value,
                valorUnitario: document.getElementById('valor-unitario').value,
                fechaAdquisicion: document.getElementById('fecha-adquisicion').value,
                proveedor: document.getElementById('proveedor').value,
                imagen: reader.result,
                nombre: document.getElementById('nombre-producto').value // Tomar el nombre del producto del campo correspondiente
            };

            if (validateProduct(newProduct)) {
                saveToLocalStorage(newProduct);
                form.reset();
            } else {
                alert('Todos los campos son requeridos y deben tener valores válidos.');
            }
        };

        if (imageInput.files.length > 0) {
            reader.readAsDataURL(imageInput.files[0]);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('products');
    const cartSection = document.getElementById('cart-section');
    const cartContainer = document.getElementById('cart');
    const viewCartButton = document.getElementById('view-cart');
    const emptyCartButton = document.getElementById('empty-cart');
    const totalValueSpan = document.getElementById('total-value');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDOM() {
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            // Cálculo del valor total para el ítem actual
            const valorTotal = parseFloat(item.valorUnitario) * parseInt(item.cantidad);

            cartItem.innerHTML = `
                <h3>${item.producto}</h3>
                <p>Valor Unitario: $${item.valorUnitario}</p>
                <p>Cantidad:</p>
                <input type="number" min="1" value="${item.cantidad}">
                <p>Valor Total: $${valorTotal.toFixed(2)}</p> <!-- Mostrar el valor total calculado -->
                <p>Proveedor: ${item.proveedor}</p>
                <button class="remove-from-cart-btn">Eliminar</button>
            `;

            const removeFromCartBtn = cartItem.querySelector('.remove-from-cart-btn');
            removeFromCartBtn.addEventListener('click', () => {
                removeFromCart(item);
            });

            const quantityInput = cartItem.querySelector('input[type="number"]');
            quantityInput.addEventListener('change', () => {
                item.cantidad = parseInt(quantityInput.value);
                item.valorTotal = parseFloat(item.valorUnitario) * item.cantidad; // Recalcula el valor total del ítem
                saveCart();
                updateCartDOM();
                updateTotalValue(); // Actualiza el valor total del carrito
            });

            cartContainer.appendChild(cartItem);
        });

        // Actualiza el valor total cada vez que se actualiza el carrito
        updateTotalValue();
    }

    function removeFromCart(item) {
        cart = cart.filter(cartItem => cartItem !== item);
        saveCart();
        updateCartDOM();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imagen}" alt="${product.producto}">
                <h3>${product.producto}</h3>
                <p>Presupuesto: $${product.presupuesto}</p>
                <p>Unidad: ${product.unidad}</p>
                <p>Cantidad: ${product.cantidad}</p>
                <p>Valor Unitario: $${product.valorUnitario}</p>
                <p>Fecha de Adquisición: ${product.fechaAdquisicion}</p>
                <p>Proveedor: ${product.proveedor}</p>
                <button class="add-to-cart-btn">Añadir al Carrito</button>
            `;

            productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                addToCart(product);
            });

            productList.appendChild(productCard);
        });

        // Después de cargar los productos, actualiza el DOM del carrito
        updateCartDOM();
    }

    function addToCart(product) {
        const cartItem = cart.find(item => item.producto === product.producto);
        if (cartItem) {
            cartItem.cantidad++;
            cartItem.valorTotal = parseFloat(cartItem.valorUnitario) * cartItem.cantidad; // Corregir el cálculo del valor total
        } else {
            const newItem = { ...product, cantidad: 1, valorTotal: parseFloat(product.valorUnitario) };
            cart.push(newItem);
        }
        saveCart();
        updateCartDOM();
        updateTotalValue();
    }

    viewCartButton.addEventListener('click', () => {
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
        updateCartDOM();
    });

    emptyCartButton.addEventListener('click', () => {
        cart = [];
        saveCart();
        updateCartDOM();
    });

    function calculateTotalValue() {
        let totalValue = 0;
        cart.forEach(item => {
            totalValue += parseFloat(item.valorTotal); // Suma el valor total de cada ítem en el carrito
        });
        return totalValue;
    }

    function updateTotalValue() {
        totalValueSpan.innerHTML = `<strong>TOTAL A PAGAR:</strong> $${calculateTotalValue().toFixed(2)}`; // Redondear a 2 decimales
    }

    // Llama a la función para mostrar el valor total al cargar la página
    updateTotalValue();

    loadProducts(); // Cargar los productos al cargar la página
});
