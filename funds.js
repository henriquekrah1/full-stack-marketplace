document.addEventListener('DOMContentLoaded', function () {
    const addFundsButton = document.getElementById('add-funds-button');
    const backToHomeButton = document.getElementById('back-to-home-btn');

    if (addFundsButton) {
        addFundsButton.addEventListener('click', function (event) {
            event.preventDefault();

            const fundsAmount = parseFloat(document.getElementById("funds-amount").value);
            const cardNumber = document.getElementById("card-number").value;
            const expiry = document.getElementById("expiry").value;
            const cvv = document.getElementById("cvv").value;

            if (isNaN(fundsAmount) || fundsAmount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            // Retrieve current user
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Unique key for user's funds
                const userFundsKey = `funds_${user.username}`;
                let userFunds = parseFloat(localStorage.getItem(userFundsKey)) || 0;
                userFunds += fundsAmount;
                localStorage.setItem(userFundsKey, userFunds.toFixed(2));

                alert(`Funds added successfully! Amount: $${fundsAmount.toFixed(2)}`);
                window.location.href = "homepage.html";
            } else {
                alert("User not logged in. Please log in first.");
                window.location.href = "login.html";
            }
        });
    }

    // Handle "Back to Home" button click
    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', function () {
            window.location.href = "homepage.html";
        });
    }
});
