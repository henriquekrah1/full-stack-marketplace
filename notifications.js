document.addEventListener('DOMContentLoaded', function () {
  // Function to display notifications as pop-ups
  function displayNotifications(notifications) {
    const notificationContainer = document.getElementById("popup-notification-container");
    notificationContainer.innerHTML = ""; // Clear existing notifications

    notifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.className = "notification-item";
      notificationItem.textContent = `${notification.message} ${notification.timestamp || ''}`;

      // Add the notification to the container
      notificationContainer.appendChild(notificationItem);

      // Optional: Automatically remove the notification after a few seconds
      setTimeout(() => {
        notificationItem.style.opacity = "0";
        notificationItem.style.transform = "translateY(-10px)";
        setTimeout(() => notificationItem.remove(), 300); // Remove from DOM after fade-out
      }, 5000); // 5 seconds
    });
  }

  // Check if the user is logged in and retrieve the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user is logged in
  if (user) {
    // Create a unique key for this user based on their username (or email)
    const userNotificationsKey = `notificationsShown_${user.username || user.email}`;

    // Check if notifications have been shown already for this user
    const notificationsShown = localStorage.getItem(userNotificationsKey);

    // Show notifications only once per user after login
    if (!notificationsShown) {
      const notifications = [];

      // 1st notification: Welcome message (no date/time)
      const welcomeNotification = {
        message: `Welcome, ${user.username}!`,
      };
      notifications.push(welcomeNotification);

      // Display the welcome notification immediately
      displayNotifications([welcomeNotification]);

      // 2nd notification: No new notifications (appears 2 seconds later)
      setTimeout(() => {
        const noNewNotification = {
          message: "No new notifications",
          timestamp: new Date().toLocaleString(),
        };
        notifications.push(noNewNotification);

        // Display the second notification after 2 seconds (along with the welcome message)
        displayNotifications([noNewNotification]);

        // Both notifications will disappear after 5 seconds, but in sequence (welcome first)
        setTimeout(() => {
          // Notifications fade out in sequence: welcome message first, followed by "no new notifications"
        }, 5000);  // First notification disappears after 5 seconds
      }, 2000);  // Show second notification 2 seconds later

      // Set the flag to indicate notifications have been shown for this user
      localStorage.setItem(userNotificationsKey, 'true');
    }
  }
});