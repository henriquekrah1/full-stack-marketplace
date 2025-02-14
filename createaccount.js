document
  .getElementById("createAccountForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get input values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMsg = document.getElementById("error-msg");

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      errorMsg.textContent = "Please fill in all fields";
      errorMsg.style.display = "block";
      return;
    }

    if (password !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match";
      errorMsg.style.display = "block";
      return;
    }

    try {
      // Call backend for account creation
      const response = await fetch("http://127.0.0.1:5000/api/auth/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        errorMsg.style.display = "none";
        // Optionally redirect to the login page
        window.location.href = "login.html";
      } else {
        errorMsg.textContent = data.message;
        errorMsg.style.display = "block";
      }
    } catch (error) {
      errorMsg.textContent = "Error connecting to the server";
      errorMsg.style.display = "block";
    }
  });
