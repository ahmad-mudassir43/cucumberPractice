// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');

// Toggle between login and register forms
function toggleForm() {
    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('show');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle login form submission
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginFormElement);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Validate form
    if (!loginData.username || !loginData.password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/feed';
            }, 1000);
        } else {
            showToast(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
});

// Handle register form submission
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerFormElement);
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Validate form
    if (!registerData.firstName || !registerData.lastName || !registerData.username || 
        !registerData.email || !registerData.password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (registerData.password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = '/feed';
            }, 1000);
        } else {
            showToast(result.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
});

// Real-time form validation
document.getElementById('registerPassword').addEventListener('input', (e) => {
    const password = e.target.value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    
    if (password.length < 6 && password.length > 0) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '#dddfe2';
    }
});

document.getElementById('email').addEventListener('input', (e) => {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email) && email.length > 0) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '#dddfe2';
    }
});

// Close toast on click
toast.addEventListener('click', () => {
    toast.classList.remove('show');
});

// Handle Enter key in forms
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('.form-container.active form');
        if (activeForm) {
            e.preventDefault();
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Initialize form focus
document.addEventListener('DOMContentLoaded', () => {
    const firstInput = document.querySelector('.form-container.active input');
    if (firstInput) {
        firstInput.focus();
    }
});