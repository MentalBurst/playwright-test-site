// Profile page functionality
$(document).ready(function() {
    const username = localStorage.getItem('username') || 'testuser';
    
    // Load profile data from localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    
    // Populate form fields
    $('#fullName').val(profileData.fullName || '');
    $('#email').val(profileData.email || '');
    $('#phone').val(profileData.phone || '');
    $('#bio').val(profileData.bio || '');
    
    // Handle profile form submission
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        
        const updatedProfile = {
            fullName: $('#fullName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            bio: $('#bio').val().trim()
        };
        
        // Save to localStorage
        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
        
        // Show success message
        $('#successMessage').fadeIn();
        
        setTimeout(function() {
            $('#successMessage').fadeOut();
        }, 3000);
    });
    
    // Handle password form submission
    $('#passwordForm').on('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Hide previous messages
        $('#passwordError').hide();
        $('#passwordSuccess').hide();
        
        // Validation
        if (currentPassword.length < 3) {
            showPasswordError('Current password is too short');
            return;
        }
        
        if (newPassword.length < 6) {
            showPasswordError('New password must be at least 6 characters');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showPasswordError('Passwords do not match');
            return;
        }
        
        // Simulate password change (in production, this would be an API call)
        $('#passwordSuccess').fadeIn();
        $('#passwordForm')[0].reset();
        
        setTimeout(function() {
            $('#passwordSuccess').fadeOut();
        }, 3000);
    });
    
    function showPasswordError(message) {
        $('#passwordError').text(message).fadeIn();
        
        setTimeout(function() {
            $('#passwordError').fadeOut();
        }, 5000);
    }
});

