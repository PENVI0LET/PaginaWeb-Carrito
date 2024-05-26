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
                valorTotal: document.getElementById('valor-total').value,
                fechaAdquisicion: document.getElementById('fecha-adquisicion').value,
                proveedor: document.getElementById('proveedor').value,
                imagen: reader.result
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
