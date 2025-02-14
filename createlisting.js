document.getElementById('listing-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form values
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value).toFixed(2);
  const type = document.getElementById('type').value;
  const rarity = document.getElementById('rarity').value;
  const image = document.getElementById('image').files[0];

  // Validate form values
  if (!title || !description || !price || !type || !rarity || !image) {
      alert('Please fill in all fields.');
      return;
  }

  // Create a new FileReader to read the image file
  const reader = new FileReader();
  reader.onload = function(e) {
      const imageUrl = e.target.result;

      // Create a listing object
      const listing = {
          title,
          description,
          price,
          type,
          rarity,
          imageUrl
      };

      // Retrieve existing listings from LocalStorage or initialize to an empty array
      const listings = JSON.parse(localStorage.getItem('listings')) || [];

      // Add the new listing to the array
      listings.push(listing);

      // Save updated listings to LocalStorage
      localStorage.setItem('listings', JSON.stringify(listings));

      // Redirect to homepage
      window.location.href = 'homepage.html';
  };

  // Read the image file as a data URL
  reader.readAsDataURL(image);
});
