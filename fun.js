// Interactive Canvas Background
class InteractiveCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isActive = true;
        
        this.resizeCanvas();
        this.init();
        this.addEventListeners();
        this.animate();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2,
                opacity: Math.random() * 0.5 + 0.3,
                color: `hsl(44, 100%, ${Math.random() * 30 + 40}%)`
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('focus', () => {
            this.isActive = true;
            console.log('Window focused - animations resumed');
        });
        
        window.addEventListener('blur', () => {
            this.isActive = false;
            console.log('Window blurred - animations paused');
        });
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.width) {
                particle.vx *= -1;
            }
            if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.height) {
                particle.vy *= -1;
            }
            
            // Keep in bounds
            particle.x = Math.max(particle.radius, Math.min(this.width - particle.radius, particle.x));
            particle.y = Math.max(particle.radius, Math.min(this.height - particle.radius, particle.y));
            
            // Mouse interaction
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = 150;
            
            if (distance < force) {
                const angle = Math.atan2(dy, dx);
                const strength = (1 - distance / force) * 5;
                particle.vx += Math.cos(angle) * strength;
                particle.vy += Math.sin(angle) * strength;
            }
            
            // Apply gentle friction with minimum velocity boost
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            // Keep particles moving with minimum velocity
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed < 0.5) {
                const angle = Math.random() * Math.PI * 2;
                particle.vx += Math.cos(angle) * 0.3;
                particle.vy += Math.sin(angle) * 0.3;
            }
        });
    }
    
    draw() {
        // Clear with gradient - pure black background
        const backgroundGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        backgroundGradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        backgroundGradient.addColorStop(1, 'rgba(20, 20, 20, 0.95)');
        this.ctx.fillStyle = backgroundGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw connecting lines in yellow/gold
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${(1 - distance / 100) * 0.4})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw yellow glow at mouse
        const radialGradient = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 100);
        radialGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        radialGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(this.mouse.x - 100, this.mouse.y - 100, 200, 200);
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize interactive canvas when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero canvas
    new InteractiveCanvas('interactiveCanvas');
    
    // Initialize section canvases
    const sectionCanvases = ['canvasAbout', 'canvasEducation', 'canvasProjects', 'canvasContact'];
    sectionCanvases.forEach(canvasId => {
        new InteractiveCanvas(canvasId);
    });
});

// Typing Animation for Hero Section
function typeText(element, texts, speed = 100) {
    let textIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (textIndex < texts.length) {
            if (charIndex < texts[textIndex].length) {
                element.textContent += texts[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    // Delete text
                    let deleteSpeed = 50;
                    let deleteInterval = setInterval(() => {
                        element.textContent = element.textContent.slice(0, -1);
                        if (element.textContent.length === 0) {
                            clearInterval(deleteInterval);
                            textIndex++;
                            charIndex = 0;
                            if (textIndex < texts.length) {
                                setTimeout(type, 500);
                            } else {
                                textIndex = 0;
                                charIndex = 0;
                                setTimeout(type, 500);
                            }
                        }
                    }, deleteSpeed);
                }, 2000);
            }
        }
    }
    
    type();
}

// Initialize typing animation
const typingElement = document.getElementById('typingText');
if (typingElement) {
    const phrases = [
        'Full Stack Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Web Designer'
    ];
    typeText(typingElement, phrases, 80);
}

// Interactive Hero Background with Particles
function createParticles() {
    const heroBackground = document.getElementById('heroBackground');
    if (heroBackground) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            const duration = 3 + Math.random() * 5;
            particle.style.animation = `floatParticle ${duration}s infinite`;
            
            heroBackground.appendChild(particle);
        }
    }
}

// Add particle animation to style
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(50px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

// Service Box Animation on Hover
document.querySelectorAll('.stat-box').forEach((box) => {
    box.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.08) translateY(-5px)';
        this.style.background = 'rgba(255, 215, 0, 0.15)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'rgba(255, 215, 0, 0.1)';
    });
});

// Parallax Mouse Movement on Hero
function heroMouseParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        document.addEventListener('mousemove', (e) => {
            const heroRect = hero.getBoundingClientRect();
            
            if (e.clientY < heroRect.bottom && e.clientY > heroRect.top) {
                const x = (e.clientX - heroRect.left - heroRect.width / 2) / 100;
                const y = (e.clientY - heroRect.top - heroRect.height / 2) / 100;
                
                const heroContent = hero.querySelectorAll('h1, .typing-text, p, .cta-button');
                heroContent.forEach((el, index) => {
                    el.style.transform = `translateX(${x * (index + 1)}px) translateY(${y * (index + 1)}px)`;
                });
            }
        });
    }
}

heroMouseParallax();

// Stat Box Click Animation
document.querySelectorAll('.stat-box').forEach((box, index) => {
    box.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'pulse 0.6s ease';
        }, 10);
    });
});

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(pulseStyle);

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNav();
        }
    });
});

// Smooth Scroll for CTA Button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector('#projects');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Update Active Navigation on Scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Add Active Link Styles
const style = document.createElement('style');
style.textContent = `
    nav a.active {
        background: rgba(255, 215, 0, 0.2);
        border-radius: 5px;
    }
    
    .fade-in {
        animation: fadeInElement 0.6s ease forwards;
    }
    
    @keyframes fadeInElement {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to cards and content
document.querySelectorAll('.project-card, .education-item, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// Scroll to Top Button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
    color: #000000;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Add Click Events to Project Cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
    
    card.addEventListener('click', function() {
        alert(`Project ${index + 1} - More details coming soon!`);
    });
});

// Add Click Events to Education Items
document.querySelectorAll('.education-item').forEach((item, index) => {
    item.style.cursor = 'pointer';
    
    item.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(102, 126, 234, 0.05)';
        this.style.transform = 'translateX(10px)';
        this.style.transition = 'all 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
        this.style.transform = 'translateX(0)';
    });
});

// Contact Links Interaction
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Contact link - Connect on this platform!');
    });
});

// Skill Tags Animation
document.querySelectorAll('.skill-tag').forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.style.animation = 'slideInSkill 0.5s ease forwards';
});

const skillAnimation = document.createElement('style');
skillAnimation.textContent = `
    @keyframes slideInSkill {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(skillAnimation);

// Intersection Observer for parallax effect on hero
const heroSectionParallax = document.querySelector('.hero');
if (heroSectionParallax) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-interactive-bg');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    console.log('Portfolio interactive features loaded!');
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Home') {
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
});

// Add Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Fade In on Page Load
window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.6s ease';
        setTimeout(() => {
            section.style.opacity = '1';
        }, index * 100);
    });
});

