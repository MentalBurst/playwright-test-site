// Common functionality across all pages
$(document).ready(function() {
    // Check if user is logged in (for protected pages)
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== 'index.html' && currentPage !== '') {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'index.html';
            return;
        }
        
        // Display username in navbar
        const username = localStorage.getItem('username') || 'User';
        $('#userDisplay').text('Hello, ' + username);
    }
    
    // Handle logout
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        
        // Clear login state
        localStorage.removeItem('isLoggedIn');
        
        // Keep username if "remember me" was checked
        if (localStorage.getItem('rememberMe') !== 'true') {
            localStorage.removeItem('username');
        }
        
        // Redirect to login page
        window.location.href = 'index.html';
    });
});

