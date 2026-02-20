

// ==================== SPA NAVIGATION ====================
const PAGES = ['accueil', 'services', 'portfolio', 'apropos', 'avis', 'contact'];

let currentPageId = 'accueil';

function showPage(pageId) {
    if (!PAGES.includes(pageId)) pageId = 'accueil';
    document.querySelectorAll('.page-section').forEach(section => {
        const belongs = section.getAttribute('data-page') === pageId;
        section.classList.toggle('page-hidden', !belongs);
        section.classList.toggle('page-visible', belongs);
    });
    document.querySelectorAll('.nav-link, .nav-link-page').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || link.getAttribute('data-page');
        if (href === '#' + pageId || href === pageId) link.classList.add('active');
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    currentPageId = pageId;
    if (pageId === 'portfolio') setTimeout(() => renderPage(1), 50);
    if (pageId === 'accueil') {
        stopSlideshow();
        startSlideshow();
    }
    if (pageId === 'avis') renderAvis();
}

function handleNavClick(e, targetId) {
    e.preventDefault();
    const serviceAnchors = ['design-graphique', 'dev-web', 'dev-mobile', 'securite', 'animation-logo-3d', 'maquette-figma', 'english-skills', 'databases'];
    if (serviceAnchors.includes(targetId)) {
        showPage('services');
        setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
        return;
    }
    if (PAGES.includes(targetId)) {
        showPage(targetId);
        return;
    }
    const el = document.getElementById(targetId);
    if (el) {
        const page = el.closest('.page-section')?.getAttribute('data-page');
        if (page) {
            showPage(page);
            setTimeout(() => el.scrollIntoView({
                behavior: 'smooth'
            }), 100);
        }
    }
}

function bindNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.replace('#', '');
            if (!targetId) return;
            handleNavClick(e, targetId);
        });
    });
}

// ==================== NAVBAR SCROLL ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.pageYOffset > 50);
});

// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== HERO SLIDER ====================
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let currentSlide = 0, slideInterval;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    indicators.forEach(i => i.classList.remove('active'));
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopSlideshow(); startSlideshow(); });
if (prevBtn) prevBtn.addEventListener('click', () => { previousSlide(); stopSlideshow(); startSlideshow(); });
indicators.forEach((ind, i) => { ind.addEventListener('click', () => { showSlide(i); stopSlideshow(); startSlideshow(); }); });
const sliderContainer = document.querySelector('.hero-slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopSlideshow);
    sliderContainer.addEventListener('mouseleave', startSlideshow);
}

// ==================== CONTACT FORM ====================


// ==================== NOTIFICATION ====================
function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}

// ==================== PORTFOLIO ====================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
const ITEMS_PER_PAGE = 9;
let currentFilter = 'all', currentPage = 1;

const portfolioContainer = document.querySelector('.portfolio .container');
let paginationEl = document.getElementById('portfolioPagination');
if (!paginationEl && portfolioContainer) {
    paginationEl = document.createElement('div');
    paginationEl.id = 'portfolioPagination';
    paginationEl.className = 'portfolio-pagination';
    portfolioContainer.appendChild(paginationEl);
}

function getFilteredItems() {
    return currentFilter === 'all' ? portfolioItems : portfolioItems.filter(i => i.getAttribute('data-category') === currentFilter);
}

function renderPage(page) {
    const filtered = getFilteredItems();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    portfolioItems.forEach(item => { item.classList.add('hidden'); item.classList.remove('visible'); item.style.animationDelay = '0ms'; });
    filtered.slice(start, start + ITEMS_PER_PAGE).forEach((item, i) => {
        item.classList.remove('hidden');
        item.style.animationDelay = (i * 60) + 'ms';
        void item.offsetWidth;
        item.classList.add('visible');
    });
    renderPagination(totalPages);
    updateVisibleImages();
}

function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;
    const prev = document.createElement('button');
    prev.className = 'page-btn page-prev' + (currentPage === 1 ? ' disabled' : '');
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => { if (currentPage > 1) renderPage(currentPage - 1); });
    paginationEl.appendChild(prev);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => renderPage(i));
        paginationEl.appendChild(btn);
    }
    const next = document.createElement('button');
    next.className = 'page-btn page-next' + (currentPage === totalPages ? ' disabled' : '');
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => { if (currentPage < totalPages) renderPage(currentPage + 1); });
    paginationEl.appendChild(next);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter');
        currentPage = 1;
        renderPage(1);
    });
});

// ==================== LIGHTBOX ====================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImageIndex = 0, visibleImages = [];

function updateVisibleImages() {
    visibleImages = portfolioItems.filter(item => !item.classList.contains('hidden')).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        title: item.querySelector('h3')?.textContent || '',
        description: item.querySelector('p')?.textContent || ''
    }));
}
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        const src = item.querySelector('img').src;
        currentImageIndex = visibleImages.findIndex(img => img.src === src);
        showLightboxImage(currentImageIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function showLightboxImage(index) {
    if (!visibleImages.length) return;
    currentImageIndex = (index + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentImageIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.innerHTML = '<strong>' + img.title + '</strong><br>' + img.description;
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showLightboxImage(currentImageIndex - 1); });
if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); showLightboxImage(currentImageIndex + 1); });

// ==================== KEYBOARD NAV ====================
document.addEventListener('keydown', e => {
    if (lightbox?.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
    } else {
        if (e.key === 'ArrowLeft') { previousSlide(); stopSlideshow(); startSlideshow(); }
        if (e.key === 'ArrowRight') { nextSlide(); stopSlideshow(); startSlideshow(); }
    }
});

// ==================== SCROLL ANIMATIONS ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});
document.querySelectorAll('.service-card, .about-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== STATS COUNTER ====================
const stats = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateStats() {
    if (hasAnimated) return;
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        const update = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(update);
            } else stat.textContent = target + '+';
        };
        update();
    });
    hasAnimated = true;
}
const aboutSection = document.querySelector('.about');
if (aboutSection) new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateStats(); });
}, { threshold: 0.3 }).observe(aboutSection);

document.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', e => e.preventDefault()));
document.querySelectorAll('a[href^="mailto"]').forEach(link => {
    link.addEventListener('contextmenu', e => {
        e.preventDefault();
        navigator.clipboard.writeText(link.href.replace('mailto:', '').split('?')[0]).then(() => showNotification('Email copié ! 📋', 'success'));
    });
});



// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    if (slides.length > 0) showSlide(0);
    startSlideshow();
    renderPage(1);
    initCountrySelector();
    renderAvis();
    bindNavLinks();
    showPage('accueil');
});
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("Tu veux voir quoi !");
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        alert("Tu essaies encore serieux !");
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        alert("Accès aux outils de développement désactivé !");
    }
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        alert("Sauvegarde de page désactivée !");
    }
});
