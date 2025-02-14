document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    if (username === '' || password === '') {
        errorMsg.textContent = 'Please fill in all fields';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        // Call backend for authentication
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Login successful!');
            errorMsg.style.display = 'none';
            
            // Save the token and user info
            localStorage.setItem('token', data.access_token);  // Save token for further requests
            localStorage.setItem('user', JSON.stringify(data.user)); // Save the user object (username & email)

            // Optionally redirect to another page
            window.location.href = 'homepage.html'; // Redirect to the homepage
        } else {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.textContent = 'Error connecting to the server';
        errorMsg.style.display = 'block';
    }
});
