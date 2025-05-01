/**
 * Sign-Up Form Validation and Handling
 * 
 * This script handles all form validation, submission, and user interaction
 * for the sign-up page. It includes password strength validation, error handling,
 * and accessibility features.
 */

// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', () => {
    // Get all form elements we need to work with
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const submitButton = document.querySelector('button[type="submit"]');

    /**
     * Password Requirements Configuration
     * 
     * This object defines the password strength requirements.
     * You can easily modify these requirements by changing the values.
     */
    const passwordRequirements = {
        minLength: 8,              // Minimum password length
        requireUppercase: true,    // Require at least one uppercase letter
        requireLowercase: true,    // Require at least one lowercase letter
        requireNumbers: true,      // Require at least one number
        requireSpecialChars: true  // Require at least one special character
    };

    /**
     * Validates password strength against requirements
     * @param {string} password - The password to validate
     * @returns {Array} Array of error messages, empty if password is valid
     */
    function validatePassword(password) {
        const errors = [];
        
        // Check minimum length
        if (password.length < passwordRequirements.minLength) {
            errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
        }
        
        // Check for uppercase letter
        if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        // Check for lowercase letter
        if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        // Check for numbers
        if (passwordRequirements.requireNumbers && !/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        // Check for special characters
        if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return errors;
    }

    /**
     * Displays an error message for a form field
     * @param {HTMLElement} input - The input element to show error for
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        
        // Remove any existing error message
        const existingError = input.parentElement.querySelector('.text-red-500');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message and highlight input
        input.parentElement.appendChild(errorDiv);
        input.classList.add('border-red-500');
    }

    /**
     * Clears error message for a form field
     * @param {HTMLElement} input - The input element to clear error for
     */
    function clearError(input) {
        const errorDiv = input.parentElement.querySelector('.text-red-500');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('border-red-500');
    }

    /**
     * Toggles password visibility between text and password type
     * @param {HTMLElement} input - The password input element
     */
    function togglePasswordVisibility(input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    }

    /**
     * Adds password visibility toggle buttons to password fields
     * This creates an eye icon button next to each password field
     */
    function addPasswordVisibilityToggles() {
        [passwordInput, confirmPasswordInput].forEach(input => {
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500';
            toggleButton.onclick = () => togglePasswordVisibility(input);
            
            // Position the button correctly
            input.parentElement.style.position = 'relative';
            input.parentElement.appendChild(toggleButton);
        });
    }

    /**
     * Handles form submission with validation and loading states
     * @param {Event} e - The form submission event
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Clear any previous error messages
        [emailInput, passwordInput, confirmPasswordInput].forEach(clearError);
        
        // Validate email format
        if (!emailInput.value.includes('@')) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Validate password strength
        const passwordErrors = validatePassword(passwordInput.value);
        if (passwordErrors.length > 0) {
            passwordErrors.forEach(error => showError(passwordInput, error));
            return;
        }
        
        // Validate password match
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            return;
        }
        
        // Validate terms checkbox
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'You must agree to the terms and conditions');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Creating Account...';
        
        try {
            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message and redirect
            alert('Account created successfully!');
            window.location.href = 'index.html';
        } catch (error) {
            // Handle any errors during submission
            showError(submitButton, 'An error occurred. Please try again.');
        } finally {
            // Reset button state regardless of success or failure
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
        }
    }

    // Initialize form by adding event listeners
    form.addEventListener('submit', handleSubmit);
    addPasswordVisibilityToggles();
}); 