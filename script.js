document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const formWrapper = document.getElementById('formWrapper');
    const submitBtn = document.querySelector('.submit-btn');

    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1SP_3ouoZSthSr4Z1Oar2eR--hTP7F6piT7-z3Lq-0uNeIMblX0X1BMyGhVYujlf_yw/exec';

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
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLower || !hasUpper || !hasNumber) {
            return 'Password must contain uppercase, lowercase, and number';
        }
        return '';
    }

    function validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearAllErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(function(error) {
            error.textContent = '';
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearAllErrors();

        let isValid = true;

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const country = document.getElementById('country').value;
        const terms = document.getElementById('terms').checked;

        const nameError = validateFullName(fullName);
        if (nameError) {
            showError('fullNameError', nameError);
            isValid = false;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            showError('emailError', emailError);
            isValid = false;
        }

        const phoneError = validatePhone(phone);
        if (phoneError) {
            showError('phoneError', phoneError);
            isValid = false;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showError('passwordError', passwordError);
            isValid = false;
        }

        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
        if (confirmPasswordError) {
            showError('confirmPasswordError', confirmPasswordError);
            isValid = false;
        }

        if (!country) {
            showError('countryError', 'Please select a country');
            isValid = false;
        }

        if (!terms) {
            showError('termsError', 'You must agree to the terms and conditions');
            isValid = false;
        }

        if (isValid) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const userData = {
                fullName: fullName,
                email: email,
                phone: phone,
                country: country
            };

            console.log('Sending data to Google Sheets:', userData);

            // Send to Google Sheets using form submission (more reliable)
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('country', country);

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
            .then(function() {
                console.log('Data sent successfully!');
                
                try {
                    localStorage.setItem('registeredUser', JSON.stringify(userData));
                } catch (e) {
                    console.log('LocalStorage error:', e);
                }

                formWrapper.classList.add('hidden');
                successMessage.classList.add('show');

                console.log('Registration Data:', userData);
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
            });
        }
    });

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
