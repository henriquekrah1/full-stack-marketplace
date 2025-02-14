document.addEventListener("DOMContentLoaded", function () {
  loadSavedListings(); // Ensure the function is called on page load

  // Retrieve the current user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
      const userSavedListingsKey = `savedListings_${user.username}`; // Unique key for each user's saved listings
      const savedListings = JSON.parse(localStorage.getItem(userSavedListingsKey)) || [];
      const container = document.getElementById('savedListingsContainer');

      container.innerHTML = ''; // Clear existing listings

      if (savedListings.length === 0) {
          // Display a message if there are no saved listings
          const emptyMessage = document.createElement('p');
          emptyMessage.classList.add('empty-message');
          emptyMessage.textContent = 'You have no saved listings yet.';
          container.appendChild(emptyMessage);
      } else {
          // Iterate over saved listings and display them
          savedListings.forEach(listing => {
              const itemDiv = document.createElement('div');
              itemDiv.classList.add('product-card');
              itemDiv.innerHTML = `
                  <a href="product.html?title=${encodeURIComponent(listing.productTitle)}&image=${encodeURIComponent(listing.productImage)}&price=${encodeURIComponent(listing.productPrice)}&description=${encodeURIComponent(listing.productDescription)}" class="product-link">
                      <img src="${listing.productImage}" alt="${listing.productTitle}">
                      <div class="product-info">
                          <h3>${listing.productTitle}</h3>
                          <p class="price">$${listing.productPrice.toLocaleString()}</p>
                      </div>
                  </a>
                  <button class="remove-button" onclick="removeSavedListing('${listing.productTitle}')">Remove</button>
              `;
              container.appendChild(itemDiv);
          });
      }
  } else {
      // If the user is not logged in, redirect to the login page
      alert('Please log in to view your saved listings.');
      window.location.href = 'login.html';
  }
});

// Function to remove a saved listing
function removeSavedListing(title) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
      const userSavedListingsKey = `savedListings_${user.username}`;
      let savedListings = JSON.parse(localStorage.getItem(userSavedListingsKey)) || [];

      // Find and remove the listing with the specified title
      savedListings = savedListings.filter(listing => listing.productTitle !== title);
      localStorage.setItem(userSavedListingsKey, JSON.stringify(savedListings));

      // Reload the saved listings to reflect changes
      loadSavedListings();
  }
}

// Function to load saved listings from localStorage
function loadSavedListings() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
      const userSavedListingsKey = `savedListings_${user.username}`;
      const savedListings = JSON.parse(localStorage.getItem(userSavedListingsKey)) || [];
      const container = document.getElementById('savedListingsContainer');

      container.innerHTML = ''; // Clear existing listings

      if (savedListings.length === 0) {
          const emptyMessage = document.createElement('p');
          emptyMessage.classList.add('empty-message');
          emptyMessage.textContent = 'You have no saved listings yet.';
          container.appendChild(emptyMessage);
      } else {
          savedListings.forEach(listing => {
              const itemDiv = document.createElement('div');
              itemDiv.classList.add('product-card');
              itemDiv.innerHTML = `
                  <a href="product.html?title=${encodeURIComponent(listing.productTitle)}&image=${encodeURIComponent(listing.productImage)}&price=${encodeURIComponent(listing.productPrice)}&description=${encodeURIComponent(listing.productDescription)}" class="product-link">
                      <img src="${listing.productImage}" alt="${listing.productTitle}">
                      <div class="product-info">
                          <h3>${listing.productTitle}</h3>
                          <p class="price">$${listing.productPrice.toLocaleString()}</p>
                      </div>
                  </a>
                  <button class="remove-button" onclick="removeSavedListing('${listing.productTitle}')">Remove</button>
              `;
              container.appendChild(itemDiv);
          });
      }
  }
}
