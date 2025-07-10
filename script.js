document.addEventListener('DOMContentLoaded', function() {
    // Add a greeting based on the time of day in the header
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting.textContent = 'Good morning!';
    } else if (hour < 18) {
        greeting.textContent = 'Good afternoon!';
    } else {
        greeting.textContent = 'Good evening!';
    }
}); 