document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Display username and email if available
        document.getElementById('username').textContent = user.username || 'N/A';
        document.getElementById('email').textContent = user.email || 'N/A';

        // Load and display user's funds
        const userFundsKey = `funds_${user.username}`; // Unique key for each user's funds
        const userFunds = parseFloat(localStorage.getItem(userFundsKey)) || 0;
        document.getElementById('funds').textContent = userFunds.toFixed(2);

        // Load and display user-specific purchase history
        const purchaseHistoryContainer = document.getElementById('purchase-history');
        const purchaseHistoryKey = `purchaseHistory_${user.username}`; // Unique key for each user's history
        const purchaseHistory = JSON.parse(localStorage.getItem(purchaseHistoryKey)) || [];

        if (purchaseHistory.length === 0) {
            purchaseHistoryContainer.innerHTML = '<p>No purchase history available.</p>';
        } else {
            purchaseHistoryContainer.innerHTML = '';
            purchaseHistory.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'history-item';
                itemElement.innerHTML = `
                    <h3>${item.productTitle}</h3>
                    <img src="${item.productImage}" alt="${item.productTitle}" class="history-item-image">
                    <p class="history-item-price">$${parseFloat(item.productPrice).toFixed(2)}</p>
                    <p class="history-item-description">${item.productDescription}</p>
                `;
                purchaseHistoryContainer.appendChild(itemElement);
            });
        }
    } else {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }

    // Handle "Home" button click
    document.getElementById('home-button').addEventListener('click', function () {
        window.location.href = 'homepage.html';
    });
});
