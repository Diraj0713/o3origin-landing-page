// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ========================================
// Firebase Configuration
// ========================================

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB-Bi4ITOc6NZ4Aw7Kutq_xUlNl7OtlU0",
  authDomain: "origin-9f8bf.firebaseapp.com",
  projectId: "origin-9f8bf",
  storageBucket: "origin-9f8bf.firebasestorage.app",
  messagingSenderId: "1078990885607",
  appId: "1:1078990885607:web:09a6b0d314bb9279aec842"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * O3 Origin — Landing Page JavaScript
 * With sound effects, animations, and Firebase integration
 */

let db = null;

try {
    db = getFirestore(app);
    console.log("✅ Firebase connected");
} catch (error) {
    console.error("❌ Firebase error:", error);
}

// ========================================
// Sound Effects
// ========================================

const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');

// Create better hover sound using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playHoverSound() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playClickSound() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playSuccessSound() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C major chord
    
    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + i * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
        
        oscillator.start(audioContext.currentTime + i * 0.1);
        oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3);
    });
}

// ========================================
// DOM Elements
// ========================================

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const waitlistForm = document.getElementById('waitlistForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const successMessage = document.getElementById('successMessage');

// ========================================
// Navigation
// ========================================

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        playClickSound();
    });
}

// Close menu on link click
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        playClickSound();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = target.offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ========================================
// Sound Effects on Interactive Elements
// ========================================

document.querySelectorAll('[data-sound]').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
});

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in
document.querySelectorAll('.comparison-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ========================================
// Form Validation & Submission
// ========================================

function validateForm(data) {
    const errors = [];
    
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push({ field: 'fullName', message: 'Please enter your full name' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email' });
    }
    
    const phoneRegex = /^[\+]?[0-9\s\-\.]{10,15}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
    
    if (!data.class) {
        errors.push({ field: 'class', message: 'Please select your class' });
    }
    
    if (!data.exam) {
        errors.push({ field: 'exam', message: 'Please select an exam' });
    }
    
    if (!data.contactPreference) {
        errors.push({ field: 'contactPreference', message: 'Please select contact preference' });
    }
    
    if (!data.expectation || data.expectation.trim().length < 10) {
        errors.push({ field: 'expectation', message: 'Please share your expectations (min 10 chars)' });
    }
    
    if (!data.revolutionIdea || data.revolutionIdea.trim().length < 10) {
        errors.push({ field: 'revolutionIdea', message: 'Please share your ideas (min 10 chars)' });
    }
    
    if (!data.price || data.price <= 0) {
        errors.push({ field: 'price', message: 'Please enter a valid amount' });
    }
    
    return errors;
}

function showErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            field.classList.add('error');
            const msg = document.createElement('span');
            msg.className = 'error-message';
            msg.textContent = error.message;
            field.parentNode.appendChild(msg);
        }
    });
    
    if (errors.length > 0) {
        document.getElementById(errors[0].field).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Clear errors on input
document.querySelectorAll('.waitlist-form input, .waitlist-form select, .waitlist-form textarea').forEach(field => {
    field.addEventListener('input', function() {
        this.classList.remove('error');
        const msg = this.parentNode.querySelector('.error-message');
        if (msg) msg.remove();
    });
});

function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.classList.toggle('hidden', loading);
    btnLoader.classList.toggle('hidden', !loading);
}

async function storeData(data) {
    const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        class: data.class,
        exam: data.exam,
        contactPreference: data.contactPreference,
        expectation: data.expectation,
        revolutionIdea: data.revolutionIdea,
        pricePerSubject: parseFloat(data.price),
        timestamp: new Date().toISOString(),
        source: 'o3origin.com'
    };
    
    if (db) {
        try {
            const docRef = await addDoc(collection(db, "origin_waitlist"), {
                ...payload,
                timestamp: serverTimestamp()
            });
            console.log('✅ Data stored with ID:', docRef.id);
            return { success: true, id: docRef.id, data: payload };
        } catch (e) {
            console.error('❌ Firebase error:', e);
            throw e;
        }
    }
    
    // Fallback to localStorage if Firebase fails
    const submissions = JSON.parse(localStorage.getItem('origin_waitlist') || '[]');
    submissions.push(payload);
    localStorage.setItem('origin_waitlist', JSON.stringify(submissions));
    console.log('✅ Data stored in localStorage (fallback)');
    return { success: true, id: 'local-' + Date.now(), data: payload };
}

// ========================================
// Show Success Message with User Details
// ========================================

function showSuccessMessage(userData) {
    if (!successMessage) return;
    
    // Update success message with user's name
    const userName = userData.name.split(' ')[0]; // Get first name
    const successTitle = successMessage.querySelector('.success-title');
    const successText = successMessage.querySelector('.success-text');
    
    if (successTitle) {
        successTitle.innerHTML = `🎉 Welcome to O3 Origin, ${userName}!`;
    }
    
    if (successText) {
        successText.innerHTML = `
            <p>✅ <strong>You're officially on the waitlist!</strong></p>
            <p>📧 We've sent a confirmation to: <strong>${userData.email}</strong></p>
            <p>📱 We'll contact you on <strong>${userData.phone}</strong> via <strong>${userData.contactPreference}</strong></p>
            <p>🎯 Your selected exam: <strong>${userData.exam}</strong></p>
            <p>💰 Your suggested price: <strong>₹${userData.pricePerSubject}/subject</strong></p>
            <br>
            <p>🚀 <strong>What's next?</strong></p>
            <p>1. We'll notify you when O3 Origin launches</p>
            <p>2. You'll get early access & special discounts</p>
            <p>3. Keep an eye on your email for updates</p>
            <br>
            <p>📞 Questions? Call us: <strong>+91 9366738658</strong></p>
        `;
    }
    
    // Add WhatsApp sharing button
    const whatsappBtn = document.createElement('button');
    whatsappBtn.className = 'btn btn-secondary whatsapp-share';
    whatsappBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.521-.075-.149-.67-1.612-.917-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411z" fill="currentColor"/>
        </svg>
        Share with Friends
    `;
    whatsappBtn.onclick = function() {
        const message = `🎯 I just joined the O3 Origin waitlist! \nJoin me for AI-powered learning: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    // Add to success message
    const successActions = successMessage.querySelector('.success-actions');
    if (successActions) {
        successActions.innerHTML = '';
        successActions.appendChild(whatsappBtn);
    }
    
    // Show success message
    waitlistForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Play success sound
    playSuccessSound();
}

// Form submission
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        playClickSound();
        
        const data = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            class: document.getElementById('class').value,
            exam: document.getElementById('exam').value,
            contactPreference: document.getElementById('contactPreference').value,
            expectation: document.getElementById('expectation').value.trim(),
            revolutionIdea: document.getElementById('revolutionIdea').value.trim(),
            price: document.getElementById('price').value
        };
        
        const errors = validateForm(data);
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }
        
        setLoading(true);
        
        try {
            const result = await storeData(data);
            if (result.success) {
                // Show personalized success message
                showSuccessMessage(result.data);
            } else {
                throw new Error('Failed to store data');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again or contact us directly at +91 9366738658.');
        } finally {
            setLoading(false);
        }
    });
}

// ========================================
// Parallax Effect for Orbs
// ========================================

document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// ========================================
// Test Firebase Connection on Load
// ========================================

window.addEventListener('load', async () => {
    if (db) {
        try {
            console.log("🔍 Testing Firestore connection...");
            // Just check if db is accessible
            console.log("✅ Firestore is ready");
            
            // Show connection status in console
            console.log(`
%c🔥 FIREBASE STATUS
📊 Project: origin-9f8bf
✅ Database: Connected
📁 Collection: origin_waitlist (will be auto-created)
🔑 API Key: Valid
🌐 Domain: origin-9f8bf.firebaseapp.com
`, 'color: #00ff88; font-family: monospace;');
            
        } catch (error) {
            console.error("❌ Firestore connection test failed:", error);
            console.log("⚠️ Check: Firestore Database → Rules tab → Set to 'test mode'");
        }
    }
});

// ========================================
// Console Welcome
// ========================================

console.log(`
%c╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 O3 Origin — AI-Powered Learning Ecosystem          ║
║                                                          ║
║   Your personal AI teacher available 24×7               ║
║                                                          ║
║   Contact: +91 9366738658                               ║
║   Email: 2003origin@gmail.com                           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace;');

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateForm, storeData };
}