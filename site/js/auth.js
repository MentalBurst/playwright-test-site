// Authentication logic for login page
$(document).ready(function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
    
    // Handle login form submission
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');
        
        // Clear any previous error messages
        $('#errorMessage').hide();
        
        // Simple validation (for demo purposes)
        if (username === '' || password === '') {
            showError('Please enter both username and password');
            return;
        }
        
        // Demo authentication - accept any non-empty credentials
        // In production, this would be an API call
        if (username.length >= 3 && password.length >= 3) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid username or password. Please use at least 3 characters.');
        }
    });
    
    function showError(message) {
        $('#errorMessage').text(message).fadeIn();
        
        // Shake animation
        $('.login-card').addClass('shake');
        setTimeout(function() {
            $('.login-card').removeClass('shake');
        }, 500);
    }
});

