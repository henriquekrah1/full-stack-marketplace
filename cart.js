document.addEventListener('DOMContentLoaded', function () {
    const checkoutButton = document.getElementById('checkout-button');
    const useFundsCheckbox = document.getElementById('use-funds-checkbox');
    const availableFundsElement = document.getElementById('available-funds');
    const useFundsContainer = document.getElementById('use-funds-container');
  
    let total = 0;
    const user = JSON.parse(localStorage.getItem('user'));
    let userFunds = 0;
  
    if (user) {
      // Retrieve the unique key for the user's funds
      const userFundsKey = `funds_${user.username}`;
      userFunds = parseFloat(localStorage.getItem(userFundsKey)) || 0;
  
      // Display available funds if the user has added funds
      if (userFunds > 0) {
        availableFundsElement.textContent = userFunds.toFixed(2);
        useFundsContainer.style.display = 'block';
      }
    }
  
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function (event) {
        event.preventDefault();
  
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiry = document.getElementById("expiry").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        let amountToPay = total;
        let fundsUsed = false;
  
        // Validate payment fields if funds are not fully covering the total
        if (!useFundsCheckbox.checked || amountToPay > 0) {
          if (!cardNumber || !expiry || !cvv) {
            alert("Please fill in all payment fields.");
            return;
          }
        }
  
        // Check if the user wants to use their funds
        if (useFundsCheckbox.checked && userFunds > 0) {
          if (userFunds >= total) {
            amountToPay = 0; // Use all funds to cover the total
            userFunds -= total;
            fundsUsed = true;
          } else {
            amountToPay = total - userFunds; // Partially use funds
            userFunds = 0;
            fundsUsed = true;
          }
  
          // Update the user's funds in localStorage
          const userFundsKey = `funds_${user.username}`;
          localStorage.setItem(userFundsKey, userFunds.toFixed(2));
        }
  
        // Display transaction success message
        if (fundsUsed) {
          alert("Transaction successful! Amount covered partially or fully by account funds.");
        } else {
          alert("Transaction successful! Amount charged on you account funds: $" + amountToPay.toFixed(2));
        }
  
        // Update purchase history
        const purchaseHistoryKey = `purchaseHistory_${user.username}`;
        const currentHistory = JSON.parse(localStorage.getItem(purchaseHistoryKey)) || [];
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        currentHistory.push(...cartItems);
        localStorage.setItem(purchaseHistoryKey, JSON.stringify(currentHistory));
  
        // Clear the cart and reset localStorage
        localStorage.removeItem("cartItems");
        window.location.href = "homepage.html"; // Redirect to the homepage
      });
    }
  
    loadCart();
  });
  
  function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    total = 0;
  
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cartItemsContainer.innerHTML = '';
      cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
  
        const itemPrice = parseFloat(item.productPrice);
        if (!isNaN(itemPrice)) {
          total += itemPrice;
        } else {
          console.error(`Invalid product price: ${item.productPrice}`);
        }
  
        itemElement.innerHTML = `
          <img src="${item.productImage}" alt="${item.productTitle}" class="cart-item-image">
          <div class="cart-item-details">
            <h2 class="cart-item-title">${item.productTitle}</h2>
            <p class="cart-item-price">$${itemPrice.toFixed(2)}</p>
            <p class="cart-item-description">${item.productDescription}</p>
            <button class="remove-item-button" data-index="${index}">Remove</button>
          </div>
        `;
  
        cartItemsContainer.appendChild(itemElement);
      });
  
      document.getElementById("total-price").textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  
    document.querySelectorAll('.remove-item-button').forEach(button => {
      button.addEventListener('click', function () {
        const itemIndex = this.getAttribute('data-index');
        removeItemFromCart(itemIndex);
      });
    });
  }
  
  function removeItemFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    location.reload();
  }
  