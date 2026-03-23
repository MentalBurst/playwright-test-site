// Products page functionality
$(document).ready(function() {
    // Sample products data
    let products = [
        { id: 1, name: 'Laptop Pro 15', category: 'electronics', price: 1299.99, icon: '💻' },
        { id: 2, name: 'Wireless Mouse', category: 'electronics', price: 29.99, icon: '🖱️' },
        { id: 3, name: 'Cotton T-Shirt', category: 'clothing', price: 19.99, icon: '👕' },
        { id: 4, name: 'Running Shoes', category: 'clothing', price: 89.99, icon: '👟' },
        { id: 5, name: 'JavaScript Guide', category: 'books', price: 39.99, icon: '📚' },
        { id: 6, name: 'Coffee Beans', category: 'food', price: 14.99, icon: '☕' }
    ];
    
    // Load products from localStorage if available
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Display products
    function displayProducts(productsToShow) {
        const grid = $('#productsGrid');
        grid.empty();
        
        if (productsToShow.length === 0) {
            grid.html('<p style="grid-column: 1/-1; text-align: center; color: #718096;">No products found</p>');
            return;
        }
        
        productsToShow.forEach(function(product) {
            const productCard = $(`
                <div class="product-card" data-testid="product-card-${product.id}">
                    <div class="product-image">${product.icon}</div>
                    <h3 class="product-name" data-testid="product-name">${product.name}</h3>
                    <p class="product-category" data-testid="product-category">${product.category}</p>
                    <p class="product-price" data-testid="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn btn-secondary view-btn" data-id="${product.id}" data-testid="view-product-${product.id}">
                            View
                        </button>
                        <button class="btn btn-primary delete-btn" data-id="${product.id}" data-testid="delete-product-${product.id}">
                            Delete
                        </button>
                    </div>
                </div>
            `);
            grid.append(productCard);
        });
    }
    
    // Initial display
    displayProducts(products);
    
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filtered = products.filter(function(product) {
            return product.name.toLowerCase().includes(searchTerm) ||
                   product.category.toLowerCase().includes(searchTerm);
        });
        displayProducts(filtered);
    });
    
    // Show add product modal
    $('#addProductBtn').on('click', function() {
        $('#addProductModal').fadeIn();
    });
    
    // Close modal
    $('.modal-close, #cancelBtn').on('click', function() {
        $('#addProductModal').fadeOut();
        $('#addProductForm')[0].reset();
    });
    
    // Click outside modal to close
    $('#addProductModal').on('click', function(e) {
        if ($(e.target).is('#addProductModal')) {
            $(this).fadeOut();
            $('#addProductForm')[0].reset();
        }
    });
    
    // Handle add product form submission
    $('#addProductForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#productName').val().trim();
        const price = parseFloat($('#productPrice').val());
        const category = $('#productCategory').val();
        
        // Category icons
        const categoryIcons = {
            electronics: '💻',
            clothing: '👕',
            books: '📚',
            food: '🍕'
        };
        
        // Create new product
        const newProduct = {
            id: Date.now(),
            name: name,
            category: category,
            price: price,
            icon: categoryIcons[category] || '📦'
        };
        
        // Add to products array
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        // Refresh display
        displayProducts(products);
        
        // Close modal and reset form
        $('#addProductModal').fadeOut();
        $('#addProductForm')[0].reset();
        
        // Clear search if active
        $('#searchInput').val('');
    });
    
    // Handle delete product
    $(document).on('click', '.delete-btn', function() {
        const productId = parseInt($(this).data('id'));
        
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(function(product) {
                return product.id !== productId;
            });
            
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts(products);
            
            // Clear search if active
            $('#searchInput').val('');
        }
    });
    
    // Handle view product (demo alert)
    $(document).on('click', '.view-btn', function() {
        const productId = parseInt($(this).data('id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            alert(`Product Details:\n\nName: ${product.name}\nCategory: ${product.category}\nPrice: $${product.price.toFixed(2)}`);
        }
    });
});

