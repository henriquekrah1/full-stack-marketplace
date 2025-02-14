document.addEventListener('DOMContentLoaded', function () {
    const buyNowButton = document.getElementById('buy-now-button');
    const saveListingButton = document.getElementById('save-listing-button'); // New Save Listing Button

    if (buyNowButton) {
        buyNowButton.addEventListener('click', function () {
            const productId = new URLSearchParams(window.location.search).get('id');
            const productTitle = document.getElementById('product-title').textContent;
            const productImage = document.getElementById('product-image').src;
            const productPrice = parseFloat(document.getElementById('product-price').textContent.replace(/[^0-9.-]+/g, ""));
            const productDescription = document.getElementById('product-description').textContent;

            const product = {
                productId,
                productTitle,
                productImage,
                productPrice,
                productDescription
            };

            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            alert('Product added to cart!');
            window.location.href = 'cart.html';
        });
    }

    if (saveListingButton) {
        saveListingButton.addEventListener('click', function () {
            const productTitle = document.getElementById('product-title').textContent;
            const productImage = document.getElementById('product-image').src;
            const productPrice = parseFloat(document.getElementById('product-price').textContent.replace(/[^0-9.-]+/g, ""));
            const productDescription = document.getElementById('product-description').textContent;
        
            // Retrieve the current user
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const userSavedListingsKey = `savedListings_${user.username}`; // Unique key for each user's saved listings
                let savedListings = JSON.parse(localStorage.getItem(userSavedListingsKey)) || [];
        
                // Check if the listing already exists in saved listings
                const existingListing = savedListings.find(listing => listing.productTitle === productTitle);
        
                if (existingListing) {
                    alert(`${productTitle} is already in your saved listings.`);
                } else {
                    savedListings.push({ productTitle, productImage, productPrice, productDescription });
                    localStorage.setItem(userSavedListingsKey, JSON.stringify(savedListings));
                    alert(`${productTitle} has been added to your saved listings.`);
                }
            } else {
                alert('Please log in to save listings.');
            }
        });
    }
});
