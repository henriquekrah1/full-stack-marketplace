document.getElementById("login-btn").addEventListener("click", function () {
    // Open the login page
    window.location.href = 'login.html';
});

document.getElementById("create-account-btn").addEventListener("click", function () {
    // Open the create account page
    window.location.href = 'createaccount.html';
});

document.getElementById("create-listing").addEventListener("click", function () {
    // Open the create listing page
    window.location.href = 'createlisting.html';
});

document.querySelector(".profile-icon").addEventListener("click", function () {
    var dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Cart functionality
document.addEventListener('DOMContentLoaded', function () {
    const accountDropdown = document.getElementById('dropdown-content');
    const token = localStorage.getItem('token');
    const logoutBtn = document.getElementById('logout-btn');
    const myAccountBtn = document.getElementById('my-account-btn');
    const loginBtn = document.getElementById('login-btn');
    const createAccountBtn = document.getElementById('create-account-btn');

    if (token) {
        // User is logged in, show account and logout options
        loginBtn.style.display = 'none';
        createAccountBtn.style.display = 'none';
        myAccountBtn.style.display = 'block';
        logoutBtn.style.display = 'block';

        // My Account Button - navigate to myaccount.html
        myAccountBtn.addEventListener('click', function () {
            window.location.href = 'myaccount.html';
        });

        // Log Out Button - log out the user
        logoutBtn.addEventListener('click', function () {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const userNotificationsKey = `notificationsShown_${user.username || user.email}`;
                localStorage.removeItem(userNotificationsKey);
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    } else {
        // If user is not logged in, show login and create account options
        loginBtn.style.display = 'block';
        createAccountBtn.style.display = 'block';
        myAccountBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }

    // Load listings from localStorage
    const listings = JSON.parse(localStorage.getItem('listings')) || [];

    // Get the marketplace container
    const marketplace = document.getElementById('marketplace');

    // Loop through the listings and display them
    listings.forEach(listing => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('product-card');
        itemDiv.setAttribute('data-weapon-type', listing.type || "");
        itemDiv.setAttribute('data-rarity', listing.rarity || "");
        itemDiv.setAttribute('data-price', listing.price || 0);
        itemDiv.setAttribute('data-product-id', listing.id || "");

        itemDiv.innerHTML = `
            <img src="${listing.imageUrl || ''}" alt="${listing.title || 'No Title'}" />
            <div class="product-info">
                <p class="title">${listing.title || 'No Title'}</p>
                <p class="price">$${parseFloat(listing.price).toLocaleString() || '0.00'}</p>
                <button class="buy-now" onclick="buyNowFromHomepage({title: '${listing.title || 'No Title'}', price: ${listing.price || 0}}); event.stopPropagation();">Buy Now</button>
            </div>
        `;

        itemDiv.addEventListener('click', function () {
            window.location.href = `product.html?id=${listing.id || ''}&title=${encodeURIComponent(listing.title || 'No Title')}&image=${encodeURIComponent(listing.imageUrl || '')}&price=${listing.price || '0.00'}&description=${encodeURIComponent(listing.description || 'No Description')}`;
        });

        marketplace.appendChild(itemDiv);
    });

    // Add click event listener to each product (including pre-added items)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(product => {
        product.addEventListener('click', function () {
            const productId = product.getAttribute('data-product-id');
            const productTitle = product.querySelector('.title').textContent;
            const productImage = product.querySelector('img').src;
            const productPrice = product.getAttribute('data-price');
            const productDescription = product.getAttribute('data-description') || 'No Description';

            window.location.href = `product.html?id=${productId}&title=${encodeURIComponent(productTitle)}&image=${encodeURIComponent(productImage)}&price=${productPrice}&description=${encodeURIComponent(productDescription)}`;
        });
    });

    // Add event listener for "Buy Now" buttons
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productTitle = productCard.querySelector('.title').textContent;
            const productImage = productCard.querySelector('img').src;
            const productPrice = parseFloat(productCard.getAttribute('data-price')) || 0;
            const productDescription = productCard.getAttribute('data-description') || 'No Description';

            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push({ productId, productTitle, productImage, productPrice, productDescription });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            alert('Product added to cart!');
        });
    });

    // Filter and sort functionality
    function filterProducts() {
        const weaponType = document.getElementById('weapon-type').value;
        const rarity = document.getElementById('rarity').value;
        const priceFrom = parseFloat(document.querySelector('.price-filter input[placeholder="From"]').value) || 0;
        const priceTo = parseFloat(document.querySelector('.price-filter input[placeholder="To"]').value) || Infinity;

        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const productType = product.getAttribute('data-weapon-type');
            const productRarity = product.getAttribute('data-rarity');
            const productPrice = parseFloat(product.getAttribute('data-price'));

            const matchesType = !weaponType || productType === weaponType;
            const matchesRarity = !rarity || productRarity === rarity;
            const matchesPrice = productPrice >= priceFrom && productPrice <= priceTo;

            product.style.display = matchesType && matchesRarity && matchesPrice ? '' : 'none';
        });
    }

    function sortProducts() {
        const sortBy = document.getElementById('sort').value;
        const productGrid = document.querySelector('.product-grid');
        const products = Array.from(productGrid.children);

        products.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));

            if (sortBy === 'priceLow') return priceA - priceB;
            if (sortBy === 'priceHigh') return priceB - priceA;
            if (sortBy === 'rarity') {
                const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
                return rarityOrder.indexOf(a.getAttribute('data-rarity')) - rarityOrder.indexOf(b.getAttribute('data-rarity'));
            }
            return 0;
        });

        productGrid.innerHTML = '';
        products.forEach(product => productGrid.appendChild(product));
    }
        // Function to filter products based on the search query
        function searchProducts() {
            const searchQuery = document.querySelector('.search-bar').value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
    
            products.forEach(product => {
                const productName = product.querySelector('.title').textContent.toLowerCase();
                const productRarity = product.getAttribute('data-rarity').toLowerCase();
                const productType = product.getAttribute('data-weapon-type').toLowerCase();
    
                // Check if the product matches the search query
                if (
                    productName.includes(searchQuery) ||
                    productRarity.includes(searchQuery) ||
                    productType.includes(searchQuery)
                ) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        }
    
        // Add event listener to the search bar
        document.querySelector('.search-bar').addEventListener('input', searchProducts);

    document.getElementById('weapon-type').addEventListener('change', filterProducts);
    document.getElementById('rarity').addEventListener('change', filterProducts);
    document.querySelector('.price-filter input[placeholder="From"]').addEventListener('input', filterProducts);
    document.querySelector('.price-filter input[placeholder="To"]').addEventListener('input', filterProducts);
    document.getElementById('sort').addEventListener('change', sortProducts);

    filterProducts();
    sortProducts();

    
});

// Close dropdowns on outside click
document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("dropdown-content");
    const accountButton = document.querySelector(".profile-icon");

    if (!dropdown.contains(event.target) && !accountButton.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

document.getElementById("cart-btn").addEventListener("click", function () {
    window.location.href = 'cart.html';
});

document.getElementById("add-funds-btn").addEventListener("click", function () {
    window.location.href = 'funds.html';
});
