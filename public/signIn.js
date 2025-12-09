
// Backend API URL - UPDATE THIS TO YOUR ACTUAL DOMAINS
const API_URL = 'https://culturecraft-3.onrender.com/api';


// Debug logging
console.log('🌐 Frontend Origin:', window.location.origin);
console.log('🔗 API URL:', API_URL);

// ==================== DOM ELEMENTS ====================

const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const userDashboard = document.getElementById('userDashboard');
const googleSigninBtn = document.getElementById('googleSigninBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const showSignupBtn = document.getElementById('showSignup');
const showSigninBtn = document.getElementById('showSignin');
const forgotPasswordLink = document.querySelector('.forgot');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhoto = document.getElementById('userPhoto');

// Auth Forms
const emailSigninForm = document.querySelector('#signinForm .auth-form');
const emailSignupForm = document.querySelector('#signupForm .auth-form');

// Product Form Elements
const productUploadForm = document.getElementById('productUploadForm');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const addMaterialBtn = document.querySelector('.add-material-btn');
const materialInput = document.querySelector('.material-input');
const materialsList = document.getElementById('materialsList');
const uploadSuccess = document.getElementById('uploadSuccess');
const viewProductsBtn = document.getElementById('viewProductsBtn');

// Store current user and materials
let currentUser = null;
let materialsArray = [];

// ==================== HELPER FUNCTIONS ====================

function showError(message) {
    console.error('❌ Error:', message);
    alert(message);
}

function showSuccess(message) {
    console.log('✅ Success:', message);
    alert(message);
}

// API request helper with proper credentials
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
        credentials: 'include', // CRITICAL: Include cookies
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
        delete defaultOptions.headers['Content-Type'];
    }
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    if (options.body instanceof FormData) {
        delete finalOptions.headers['Content-Type'];
    }
    
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        console.log(`📥 Response (${response.status}):`, data);
        
        return { response, data, ok: response.ok };
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// ==================== GOOGLE IDENTITY SERVICES ====================

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    console.log('🔵 Initializing Google Sign-In...');
    
    // Load Google Identity Services script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        console.log('✅ Google Identity Services loaded');
        setupGoogleButtons();
    };
    document.head.appendChild(script);
}

function setupGoogleButtons() {
    // Configure Google Sign-In
    window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
    });

    // Render Google buttons
    if (googleSigninBtn) {
        googleSigninBtn.addEventListener('click', () => {
            console.log('🔵 Google Sign-In button clicked');
            window.google.accounts.id.prompt(); // Show One Tap or popup
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            console.log('🔵 Google Sign-Up button clicked');
            window.google.accounts.id.prompt();
        });
    }
}

// Handle Google Sign-In response
async function handleGoogleResponse(response) {
    console.log('🔵 Google Sign-In response received');
    
    if (!response.credential) {
        showError('No credential received from Google');
        return;
    }

    try {
        console.log('📤 Sending credential to backend...');
        
        const { data, ok } = await apiRequest('/auth/google', {
            method: 'POST',
            body: JSON.stringify({
                credential: response.credential
            })
        });

        if (ok && data.success) {
            console.log('✅ Backend authentication successful');
            showSuccess(data.message);
            currentUser = data.user;
            showDashboard(currentUser);
        } else {
            throw new Error(data.error || 'Authentication failed');
        }

    } catch (error) {
        console.error('❌ Google authentication error:', error);
        showError('Google sign-in failed: ' + error.message);
    }
}

// ==================== AUTH FUNCTIONS ====================

// Switch between Sign In and Sign Up
showSignupBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('📝 Switching to Sign Up form');
    signinForm.classList.remove('active');
    signupForm.classList.add('active');
});

showSigninBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('🔐 Switching to Sign In form');
    signupForm.classList.remove('active');
    signinForm.classList.add('active');
});

// Forgot Password
forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔐 Password Reset\n\nPlease contact support at support@culturecraft.com to reset your password.\n\nOr use "Continue with Google" for easier sign-in!');
});

// Email/Password Sign In
emailSigninForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📧 Email Sign-In submitted');

    const emailInput = emailSigninForm.querySelector('input[type="email"]');
    const passwordInput = emailSigninForm.querySelector('input[type="password"]');
    const submitBtn = emailSigninForm.querySelector('.submit-btn');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
        const { data, ok } = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (ok && data.success) {
            showSuccess(data.message);
            currentUser = data.user;
            showDashboard(currentUser);
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
});

// Email/Password Sign Up
emailSignupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Email Sign-Up submitted');

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const termsCheckbox = signupForm.querySelector('.terms input[type="checkbox"]');
    const submitBtn = emailSignupForm.querySelector('.submit-btn');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (!termsCheckbox.checked) {
        showError('Please agree to the Terms of Service');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
        const { data, ok } = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (ok && data.success) {
            showSuccess(data.message);
            currentUser = data.user;
            showDashboard(currentUser);
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('❌ Registration error:', error);
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
});

// Logout
logoutBtn?.addEventListener('click', async () => {
    console.log('🔓 Logout clicked');
    
    try {
        const { data, ok } = await apiRequest('/auth/logout', {
            method: 'POST'
        });

        if (ok) {
            console.log('✅ Logged out successfully');
            currentUser = null;
            materialsArray = [];
            showSignInForm();
            
            // Sign out from Google
            if (window.google?.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
            }
        }
    } catch (error) {
        console.error('❌ Logout error:', error);
        showError('Logout failed. Please try again.');
    }
});

// Show Dashboard
function showDashboard(user) {
    console.log('📊 Showing dashboard for:', user.email);
    
    signinForm.classList.remove('active');
    signupForm.classList.remove('active');
    userDashboard.classList.add('active');

    userName.textContent = user.name || 'Welcome!';
    userEmail.textContent = user.email || '';
    userPhoto.src = user.photoURL || 'https://via.placeholder.com/100?text=' + (user.name?.[0] || 'U');
}

// Show Sign In Form
function showSignInForm() {
    console.log('🔐 Showing sign-in form');
    
    userDashboard.classList.remove('active');
    signupForm.classList.remove('active');
    signinForm.classList.add('active');
}

// Check existing session on page load
async function checkSession() {
    console.log('\n🔄 Page loaded - checking for existing session...');
    
    try {
        const { data, ok } = await apiRequest('/auth/check');

        if (ok && data.loggedIn && data.user) {
            console.log('✅ Active session found:', data.user.email);
            currentUser = data.user;
            showDashboard(currentUser);
        } else {
            console.log('ℹ️ No active session found');
            showSignInForm();
        }
    } catch (error) {
        console.error('❌ Session check error:', error);
        showSignInForm();
    }
}

// ==================== PRODUCT UPLOAD ====================

// Image Preview
productImage?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        console.log('🖼️ Image selected:', file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewImg.style.display = 'block';
            imagePreview.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Materials Management
addMaterialBtn?.addEventListener('click', () => {
    const material = materialInput.value.trim();
    if (material) {
        console.log('➕ Adding material:', material);
        materialsArray.push(material);
        renderMaterials();
        materialInput.value = '';
    }
});

materialInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addMaterialBtn.click();
    }
});

function renderMaterials() {
    materialsList.innerHTML = '';
    materialsArray.forEach((material, index) => {
        const tag = document.createElement('div');
        tag.className = 'material-tag';
        tag.innerHTML = `
            ${material}
            <button type="button" onclick="removeMaterial(${index})">×</button>
        `;
        materialsList.appendChild(tag);
    });
}

window.removeMaterial = function(index) {
    console.log('➖ Removing material at index:', index);
    materialsArray.splice(index, 1);
    renderMaterials();
};

// Product Upload Form
productUploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📤 Product upload submitted');

    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const stock = document.getElementById('productStock').value;
    const imageFile = productImage.files[0];

    // Validation
    if (!name || !description || !price || !imageFile) {
        showError('Please fill in all required fields and select an image');
        return;
    }

    if (materialsArray.length === 0) {
        showError('Please add at least one material');
        return;
    }

    const submitBtn = productUploadForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳</span> Uploading...';

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('materials', JSON.stringify(materialsArray));
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('image', imageFile);

        const { data, ok } = await apiRequest('/products', {
            method: 'POST',
            body: formData
        });

        if (ok && data.success) {
            console.log('✅ Product uploaded:', data.product);
            
            // Show success message
            uploadSuccess.style.display = 'flex';
            setTimeout(() => {
                uploadSuccess.style.display = 'none';
            }, 3000);

            // Reset form
            productUploadForm.reset();
            materialsArray = [];
            renderMaterials();
            previewImg.style.display = 'none';
            imagePreview.style.display = 'flex';
            
            showSuccess('Product uploaded successfully!');
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
        showError('Upload failed: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📤</span> Upload Product';
    }
});

// View Products Button
viewProductsBtn?.addEventListener('click', async () => {
    console.log('👁️ View My Products clicked');
    
    try {
        const { data, ok } = await apiRequest('/products/my');

        if (ok && data.success) {
            if (data.count === 0) {
                alert('You haven\'t uploaded any products yet!');
            } else {
                // For now, just show count. Later can navigate to products page
                alert(`You have ${data.count} product(s)!\n\nView functionality coming soon.`);
            }
        } else {
            throw new Error(data.error || 'Failed to fetch products');
        }
    } catch (error) {
        console.error('❌ Fetch products error:', error);
        showError('Failed to load your products');
    }
});

// ==================== INITIALIZATION ====================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page initialized');
    
    // Check if Google Client ID is configured
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com') {
        console.warn('⚠️ GOOGLE_CLIENT_ID not configured! Please update it in signIn.js');
    }
    
    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Check for existing session
    checkSession();
});