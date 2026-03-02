document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const formWrapper = document.querySelector('.form-wrapper');

    // Validation functions
    function validateFullName(name) {
        if (name.trim().length < 3) {
            return 'Name must be at least 3 characters long';
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return 'Name should only contain letters and spaces';
        }
        return '';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return 'Please enter a valid phone number';
        }
        return '';
    }

    function validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return '';
    }

    function validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    }

    // Show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    // Clear error message
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
    }

    // Clear all errors
    function clearAllErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => error.textContent = '');
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearAllErrors();

        let isValid = true;

        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const country = document.getElementById('country').value;
        const terms = document.getElementById('terms').checked;

        // Validate Full Name
        const nameError = validateFullName(fullName);
        if (nameError) {
            showError('fullNameError', nameError);
            isValid = false;
        }

        // Validate Email
        const emailError = validateEmail(email);
        if (emailError) {
            showError('emailError', emailError);
            isValid = false;
        }

        // Validate Phone
        const phoneError = validatePhone(phone);
        if (phoneError) {
            showError('phoneError', phoneError);
            isValid = false;
        }

        // Validate Password
        const passwordError = validatePassword(password);
        if (passwordError) {
            showError('passwordError', passwordError);
            isValid = false;
        }

        // Validate Confirm Password
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
        if (confirmPasswordError) {
            showError('confirmPasswordError', confirmPasswordError);
            isValid = false;
        }

        // Validate Country
        if (!country) {
            showError('countryError', 'Please select a country');
            isValid = false;
        }

        // Validate Terms
        if (!terms) {
            showError('termsError', 'You must agree to the terms and conditions');
            isValid = false;
        }

        // If form is valid, show success message
        if (isValid) {
            // Store data in localStorage (optional)
            const userData = {
                fullName: fullName,
                email: email,
                phone: phone,
                country: country,
                registeredAt: new Date().toISOString()
            };
            localStorage.setItem('registeredUser', JSON.stringify(userData));

            // Hide form and show success message
            formWrapper.classList.add('hidden');
            successMessage.classList.add('show');

            // Log the data (for demonstration)
            console.log('Registration Data:', userData);
        }
    });

    // Real-time validation on input blur
    document.getElementById('fullName').addEventListener('blur', function() {
        const error = validateFullName(this.value);
        showError('fullNameError', error);
    });

    document.getElementById('email').addEventListener('blur', function() {
        const error = validateEmail(this.value);
        showError('emailError', error);
    });

    document.getElementById('phone').addEventListener('blur', function() {
        const error = validatePhone(this.value);
        showError('phoneError', error);
    });

    document.getElementById('password').addEventListener('blur', function() {
        const error = validatePassword(this.value);
        showError('passwordError', error);
    });

    document.getElementById('confirmPassword').addEventListener('blur', function() {
        const password = document.getElementById('password').value;
        const error = validateConfirmPassword(password, this.value);
        showError('confirmPasswordError', error);
    });
});
