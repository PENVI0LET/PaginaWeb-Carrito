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
    const productList = document.getElementById('products');

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imagen}" alt="${product.producto}">
                <h3>${product.producto}</h3>
                <p>Presupuesto: $${product.presupuesto}</p>
                <p>Unidad: ${product.unidad}</p>
                <p>Cantidad: ${product.cantidad}</p>
                <p>Valor Unitario: $${product.valorUnitario}</p>
                <p>Valor Total: $${product.valorTotal}</p>
                <p>Fecha de Adquisición: ${product.fechaAdquisicion}</p>
                <p>Proveedor: ${product.proveedor}</p>
                <button class="delete-product-btn" data-index="${index}">Eliminar</button>
            `;

            const deleteProductBtn = productCard.querySelector('.delete-product-btn');
            if (deleteProductBtn) {
                deleteProductBtn.addEventListener('click', () => {
                    deleteProduct(index);
                });
            }

            productList.appendChild(productCard);
        });
    }

    function deleteProduct(index) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        productList.innerHTML = ''; // Limpiar la lista de productos
        loadProducts(); // Volver a cargar los productos
    }

    loadProducts();
});
