// // API Configuration
// const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

// const API_BASE_URL = 'http://localhost:5000';

const API_BASE_URL = 'http://localhost:5000/api';




// DOM Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const contactForm = document.getElementById('contactForm');
const issuesList = document.getElementById('issuesList');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Modal Controls
const loginBtns = [
    document.getElementById('loginBtn'),
    document.getElementById('heroLoginBtn'),
    document.getElementById('ctaLoginBtn')
];
const signupBtns = [
    document.getElementById('signupBtn'),
    document.getElementById('heroSignupBtn'),
    document.getElementById('ctaSignupBtn')
];

// Global Variables
let allIssues = [];
let filteredIssues = [];
let displayedIssues = [];
let currentPage = 1;
const issuesPerPage = 6;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadPublicIssues();
    checkAuthStatus();
    initializeAnimations();
});

// Setup Event Listeners
function setupEventListeners() {
    // Login button events
    loginBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => openModal(loginModal));
        }
    });

    // Signup button events
    signupBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => openModal(signupModal));
        }
    });

    // Modal close events
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    // Switch between login and signup
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModals();
            setTimeout(() => openModal(signupModal), 100);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModals();
            setTimeout(() => openModal(loginModal), 100);
        });
    }

    // Form submissions
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);

    // Filters and search
    if (statusFilter) statusFilter.addEventListener('change', filterIssues);
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchIssues, 300));
    }

    // Load more button
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreIssues);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === signupModal) {
            closeModals();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle (for future implementation)
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Modal Functions
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Add focus trap for accessibility
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }
}

function closeModals() {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// // Authentication Functions
// async function handleLogin(e) {
//     e.preventDefault();
//     showLoadingOverlay(true);
    
//     const formData = new FormData(loginForm);
//     const loginData = {
//         email: formData.get('email'),
//         password: formData.get('password')
//     };

//     try {
//         // Simulate API call for demo
//         await simulateApiCall();
        
//         // For demo purposes, simulate successful login
//         const mockResponse = {
//             success: true,
//             token: 'mock-jwt-token',
//             user: {
//                 id: 1,
//                 name: 'John Doe',
//                 email: loginData.email,
//                 role: loginData.email.includes('admin') ? 'admin' : 'citizen'
//             }
//         };

//         if (mockResponse.success) {
//             // Store user data
//             localStorage.setItem('token', mockResponse.token);
//             localStorage.setItem('user', JSON.stringify(mockResponse.user));
            
//             showMessage('Login successful! Redirecting...', 'success');
//             closeModals();
            
//             // Redirect based on role
//             setTimeout(() => {
//                 if (mockResponse.user.role === 'admin') {
//                     window.location.href = 'admin.html';
//                 } else {
//                     window.location.href = 'citizen.html';
//                 }
//             }, 1500);
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         showMessage('Login failed. Please try again.', 'error');
//     } finally {
//         showLoadingOverlay(false);
//     }
// }
// async function handleLogin(e) {
//     e.preventDefault();
//     showLoadingOverlay(true);

//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;

//     try {
//         const res = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await res.json();

//         // 🔍 DEBUG — DO NOT REMOVE
//         console.log('LOGIN API RESPONSE:', data);

//         if (!res.ok) {
//             throw new Error(data.message || 'Login failed');
//         }

//         // ✅ STORE REAL DATA
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify({
//             email,
//             role: data.role
//         }));

//         showMessage('Login successful! Redirecting...', 'success');
//         closeModals();

//         setTimeout(() => {
//             if (data.role === 'admin') {
//                 window.location.href = 'admin.html';
//             } else {
//                 window.location.href = 'citizen.html';
//             }
//         }, 1000);

//     } catch (error) {
//         console.error('LOGIN ERROR:', error);
//         showMessage(error.message || 'Login failed', 'error');
//     } finally {
//         showLoadingOverlay(false);
//     }
// }

//handle login real api calll 
async function handleLogin(e) {
    e.preventDefault();
    showLoadingOverlay(true);

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log('LOGIN API RESPONSE:', data);

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        const user = data.user || {};
        const role = user.role || 'citizen';

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            name: user.name,
            email: user.email,
            role: role
        }));

        showMessage('Login successful! Redirecting...', 'success');
        closeModals();

        setTimeout(() => {
            window.location.href = role === 'admin' ? 'admin.html' : 'citizen.html';
        }, 1000);

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        showMessage(error.message || 'Login failed', 'error');
    } finally {
        showLoadingOverlay(false);
    }
}






// async function handleSignup(e) {
//     e.preventDefault();
    
//     const formData = new FormData(signupForm);
//     const password = formData.get('password');
//     const confirmPassword = formData.get('confirmPassword');
    
//     // Validate passwords match
//     if (password !== confirmPassword) {
//         showMessage('Passwords do not match!', 'error');
//         return;
//     }

//     // Validate password strength
//     if (!isValidPassword(password)) {
//         showMessage('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.', 'error');
//         return;
//     }

//     showLoadingOverlay(true);
    
//     const signupData = {
//         firstName: formData.get('firstName'),
//         lastName: formData.get('lastName'),
//         email: formData.get('email'),
//         phone: formData.get('phone'),
//         password: password
//     };

//     try {
//         // Simulate API call for demo
//         await simulateApiCall();
        
//         showMessage('Registration successful! Please login to continue.', 'success');
//         signupForm.reset();
//         closeModals();
//         setTimeout(() => openModal(loginModal), 1000);
//     } catch (error) {
//         console.error('Signup error:', error);
//         showMessage('Registration failed. Please try again.', 'error');
//     } finally {
//         showLoadingOverlay(false);
//     }
// }

//replace sign up with real api call 
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(signupForm);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }

    if (!isValidPassword(password)) {
        showMessage('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.', 'error');
        return;
    }

    showLoadingOverlay(true);

const signupData = {
    name: `${formData.get('firstName')} ${formData.get('lastName')}`, // combine names
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: password
};


    try {
        // const res = await fetch(`${API_BASE_URL}/auth/register`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(signupData)
        // });
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupData)
});

        const data = await res.json();
        console.log('SIGNUP API RESPONSE:', data);

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        showMessage('Registration successful! Please login.', 'success');
        signupForm.reset();
        closeModals();
        setTimeout(() => openModal(loginModal), 1000);

    } catch (error) {
        console.error('Signup error:', error);
        showMessage(error.message || 'Registration failed', 'error');
    } finally {
        showLoadingOverlay(false);
    }
}





async function handleContactForm(e) {
    e.preventDefault();
    showLoadingOverlay(true);
    
    try {
        // Simulate API call for demo
        await simulateApiCall();
        
        showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Contact form error:', error);
        showMessage('Failed to send message. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            updateNavForLoggedInUser(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}

function updateNavForLoggedInUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn && signupBtn) {
        loginBtn.innerHTML = `<i class="fas fa-tachometer-alt"></i> Dashboard`;
        loginBtn.onclick = () => {
            window.location.href = user.role === 'admin' ? 'admin.html' : 'citizen.html';
        };
        signupBtn.style.display = 'none';
    }
}

// Issues Functions
async function loadPublicIssues() {
    try {
        showLoadingInIssuesList(true);
        
        // Simulate API call - in real implementation, replace with actual API call
        await simulateApiCall();
        
        // Load sample data for demo
        allIssues = generateSampleIssues();
        filteredIssues = [...allIssues];
        displayIssues();
        
    } catch (error) {
        console.error('Error loading issues:', error);
        showErrorInIssuesList();
    }
}

function generateSampleIssues() {
    const sampleIssues = [
        {
            id: 1,
            title: 'Broken Street Light on Main Street',
            description: 'The street light at the intersection of Main Street and Oak Avenue has been flickering for weeks and is now completely out. This creates a safety hazard for pedestrians and drivers, especially during evening hours.',
            status: 'pending',
            location: 'Main Street & Oak Avenue, Downtown',
            reportedAt: '2024-12-20T10:30:00Z',
            reportedBy: 'Anonymous Citizen',
            priority: 'high'
        },
        {
            id: 2,
            title: 'Large Pothole on Highway 101',
            description: 'There is a significant pothole on Highway 101 near mile marker 15 that is causing damage to vehicles. Multiple cars have reported tire damage from this hazard.',
            status: 'in-progress',
            location: 'Highway 101, Mile Marker 15',
            reportedAt: '2024-12-19T14:15:00Z',
            reportedBy: 'John D.',
            priority: 'high'
        },
        {
            id: 3,
            title: 'Overflowing Garbage Bin at Central Park',
            description: 'The public garbage bin near the east entrance of Central Park has been overflowing for several days. It\'s attracting pests and creating an unsanitary environment.',
            status: 'resolved',
            location: 'Central Park, East Entrance',
            reportedAt: '2024-12-18T09:45:00Z',
            reportedBy: 'Sarah M.',
            priority: 'medium'
        },
        {
            id: 4,
            title: 'Cracked Sidewalk Creating Trip Hazard',
            description: 'The sidewalk on Oak Avenue has several large cracks that create a tripping hazard for pedestrians, particularly dangerous for elderly residents and children.',
            status: 'pending',
            location: 'Oak Avenue, Block 200-300',
            reportedAt: '2024-12-17T16:20:00Z',
            reportedBy: 'Mike R.',
            priority: 'medium'
        },
        {
            id: 5,
            title: 'Graffiti on Public Building',
            description: 'Vandalism has occurred on the exterior wall of the community center. The graffiti is visible from the main road and detracts from the neighborhood appearance.',
            status: 'in-progress',
            location: 'Community Center, 456 Elm Street',
            reportedAt: '2024-12-16T11:30:00Z',
            reportedBy: 'Lisa K.',
            priority: 'low'
        },
        {
            id: 6,
            title: 'Malfunctioning Traffic Signal',
            description: 'The traffic light at the intersection of Pine Street and 2nd Avenue is stuck on red in all directions, causing traffic delays and confusion.',
            status: 'pending',
            location: 'Pine Street & 2nd Avenue',
            reportedAt: '2024-12-15T08:45:00Z',
            reportedBy: 'David L.',
            priority: 'high'
        },
        {
            id: 7,
            title: 'Damaged Park Bench',
            description: 'One of the benches in Riverside Park has a broken slat and is unsafe to use. It needs repair or replacement.',
            status: 'resolved',
            location: 'Riverside Park, Near Playground',
            reportedAt: '2024-12-14T13:20:00Z',
            reportedBy: 'Emma T.',
            priority: 'low'
        },
        {
            id: 8,
            title: 'Blocked Storm Drain',
            description: 'The storm drain on Maple Street is completely blocked with debris, causing water to pool during rain and creating flooding issues.',
            status: 'in-progress',
            location: 'Maple Street, Near School',
            reportedAt: '2024-12-13T07:15:00Z',
            reportedBy: 'Robert H.',
            priority: 'high'
        }
    ];
    
    return sampleIssues;
}

function displayIssues() {
    const startIndex = 0;
    const endIndex = Math.min(issuesPerPage, filteredIssues.length);
    displayedIssues = filteredIssues.slice(startIndex, endIndex);
    
    if (displayedIssues.length === 0) {
        issuesList.innerHTML = '<div class="loading">No issues found matching your criteria.</div>';
        loadMoreBtn.style.display = 'none';
        return;
    }

    issuesList.innerHTML = displayedIssues.map(issue => createIssueCard(issue)).join('');
    
    // Show/hide load more button
    if (filteredIssues.length > displayedIssues.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    currentPage = 1;
}

function loadMoreIssues() {
    const startIndex = currentPage * issuesPerPage;
    const endIndex = Math.min(startIndex + issuesPerPage, filteredIssues.length);
    const newIssues = filteredIssues.slice(startIndex, endIndex);
    
    displayedIssues = [...displayedIssues, ...newIssues];
    
    // Append new issues to existing ones
    const newIssuesHTML = newIssues.map(issue => createIssueCard(issue)).join('');
    issuesList.innerHTML += newIssuesHTML;
    
    currentPage++;
    
    // Hide load more button if all issues are displayed
    if (displayedIssues.length >= filteredIssues.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function createIssueCard(issue) {
    const statusClass = `status-${issue.status.replace(' ', '-')}`;
    const formattedDate = formatDate(issue.reportedAt);
    const priorityIcon = getPriorityIcon(issue.priority);
    
    return `
        <div class="issue-card" data-status="${issue.status}" data-priority="${issue.priority}">
            <div class="issue-header">
                <div>
                    <div class="issue-title">${issue.title}</div>
                    <div class="issue-location">
                        <i class="fas fa-map-marker-alt"></i> ${issue.location}
                    </div>
                </div>
                <div>
                    <span class="issue-status ${statusClass}">${formatStatus(issue.status)}</span>
                    ${priorityIcon}
                </div>
            </div>
            <div class="issue-description">${issue.description}</div>
            <div class="issue-meta">
                <span class="issue-reporter">
                    <i class="fas fa-user"></i> ${issue.reportedBy}
                </span>
                <span class="issue-date">${formattedDate}</span>
            </div>
        </div>
    `;
}

function filterIssues() {
    const selectedStatus = statusFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredIssues = allIssues.filter(issue => {
        const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
        const matchesSearch = searchTerm === '' || 
            issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            issue.location.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
    
    displayIssues();
}

function searchIssues() {
    filterIssues();
}

function showLoadingInIssuesList(show) {
    if (show) {
        issuesList.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading community issues...</span>
            </div>
        `;
    }
}

function showErrorInIssuesList() {
    issuesList.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Failed to load issues. Please try again later.</span>
        </div>
    `;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getPriorityIcon(priority) {
    const icons = {
        high: '<i class="fas fa-exclamation-circle" style="color: #e74c3c;" title="High Priority"></i>',
        medium: '<i class="fas fa-minus-circle" style="color: #f39c12;" title="Medium Priority"></i>',
        low: '<i class="fas fa-info-circle" style="color: #27ae60;" title="Low Priority"></i>'
    };
    return icons[priority] || '';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.toast-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `toast-message toast-${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ${type === 'success' ? 'background: linear-gradient(135deg, #27ae60, #2ecc71);' : 'background: linear-gradient(135deg, #e74c3c, #c0392b);'}
    `;
    
    // Add animation styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
            }
            .toast-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close functionality
    const closeBtn = messageDiv.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => messageDiv.remove());
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showLoadingOverlay(show) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

async function simulateApiCall(delay = 1000) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Mobile menu toggle (placeholder for future implementation)
function toggleMobileMenu() {
    // Implementation for mobile menu toggle
    console.log('Mobile menu toggle clicked');
}

// Newsletter signup
async function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        await simulateApiCall(500);
        showMessage('Successfully subscribed to newsletter!', 'success');
        e.target.querySelector('input[type="email"]').value = '';
    } catch (error) {
        showMessage('Failed to subscribe. Please try again.', 'error');
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
}

// Initialize animations and effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .issue-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Logout function (if needed)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showMessage('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Export functions for potential external use
window.CivicTracker = {
    openModal,
    closeModals,
    logout,
    showMessage
};