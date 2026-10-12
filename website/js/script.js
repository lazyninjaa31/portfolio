/**
 * LAZYNINJA STUDIO & ARCHIVE — INTERACTIVE SCRIPT
 * Handles Loading Screen, 5 Content Tabs (Videos, Podcasts, Guests, Music, Streaming),
 * Slot Modal & Web Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // 1. STATE & AUDIO SYNTHESIZER (Web Audio API)
    // ============================================================
    let audioContext = null;
    let isSoundMuted = false;

    const getAudioContext = () => {
        if (!audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) audioContext = new AudioCtx();
        }
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    };

    // Play subtle atmospheric chord impact on entering
    const playStudioEntrance = () => {
        if (isSoundMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // Sub bass resonance
            const oscSub = ctx.createOscillator();
            const gainSub = ctx.createGain();
            oscSub.type = 'sine';
            oscSub.frequency.setValueAtTime(90, now);
            oscSub.frequency.exponentialRampToValueAtTime(40, now + 0.8);

            gainSub.gain.setValueAtTime(0.001, now);
            gainSub.gain.exponentialRampToValueAtTime(0.24, now + 0.08);
            gainSub.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

            oscSub.connect(gainSub);
            gainSub.connect(ctx.destination);
            oscSub.start(now);
            oscSub.stop(now + 1.2);

            // Shimmer harmonic sparkle
            const oscHigh = ctx.createOscillator();
            const gainHigh = ctx.createGain();
            oscHigh.type = 'triangle';
            oscHigh.frequency.setValueAtTime(520, now);
            oscHigh.frequency.exponentialRampToValueAtTime(1040, now + 0.35);

            gainHigh.gain.setValueAtTime(0.001, now);
            gainHigh.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
            gainHigh.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

            oscHigh.connect(gainHigh);
            gainHigh.connect(ctx.destination);
            oscHigh.start(now);
            oscHigh.stop(now + 0.7);
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    };

    // Subtle tactile click sound
    const playUiClick = () => {
        if (isSoundMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {
            // Audio context not active
        }
    };

    // Sound Mute Toggle
    const toggleSound = () => {
        isSoundMuted = !isSoundMuted;
        const loaderSoundIcon = document.getElementById('sound-icon-loader');
        const navSoundIcon = document.getElementById('sound-icon-nav');
        
        const iconClass = isSoundMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        if (loaderSoundIcon) loaderSoundIcon.className = iconClass;
        if (navSoundIcon) navSoundIcon.className = iconClass;

        showToast(isSoundMuted ? 'Audio Muted' : 'Audio FX Enabled');
    };

    const loaderSoundToggle = document.getElementById('loader-sound-toggle');
    const navSoundToggle = document.getElementById('nav-sound-toggle');
    if (loaderSoundToggle) loaderSoundToggle.addEventListener('click', toggleSound);
    if (navSoundToggle) navSoundToggle.addEventListener('click', toggleSound);

    // ============================================================
    // 2. KINETIC SCROLL PROGRESS & CURSOR HIGHLIGHT ENGINE
    // ============================================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const cursorDot = document.getElementById('cursor-dot');

    // Kinetic Top Scroll Progress Bar
    const updateScrollProgress = () => {
        if (!scrollProgressBar) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        const clamped = Math.min(100, Math.max(0, progress));
        scrollProgressBar.style.width = `${clamped}%`;
        scrollProgressBar.setAttribute('aria-valuenow', Math.round(clamped));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    // Interactive Cursor Spotlight & Precision Dot
    let mouseX = -100;
    let mouseY = -100;
    let spotlightX = -100;
    let spotlightY = -100;
    let isCursorVisible = false;
    let rafId = null;

    // Check if device supports fine hover pointer
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer && cursorSpotlight && cursorDot) {
        const renderCursor = () => {
            // Smooth lerp interpolation for ambient spotlight
            spotlightX += (mouseX - spotlightX) * 0.12;
            spotlightY += (mouseY - spotlightY) * 0.12;

            cursorSpotlight.style.transform = `translate3d(${spotlightX}px, ${spotlightY}px, 0)`;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            rafId = requestAnimationFrame(renderCursor);
        };

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isCursorVisible) {
                isCursorVisible = true;
                spotlightX = mouseX;
                spotlightY = mouseY;
                cursorSpotlight.style.opacity = '1';
                cursorDot.style.opacity = '1';
                if (!rafId) rafId = requestAnimationFrame(renderCursor);
            }
        });

        document.addEventListener('mouseleave', () => {
            if (cursorSpotlight) cursorSpotlight.style.opacity = '0';
            if (cursorDot) cursorDot.style.opacity = '0';
            isCursorVisible = false;
        });

        document.addEventListener('mouseenter', () => {
            if (cursorSpotlight) cursorSpotlight.style.opacity = '1';
            if (cursorDot) cursorDot.style.opacity = '1';
            isCursorVisible = true;
        });

        // Tactile Cursor Expansion on Interactive Hover
        const interactiveSelector = 'a, button, .media-slot-card, .content-tab-btn, .channel-card, .contact-card, .shelf-jump-pill, .rail-arrow-btn, .btn, .social-pill, .nav-social-icon, .video-card, .guest-card, .vlog-card, .podcast-card, .music-card, [role="button"]';

        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                cursorDot.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                cursorDot.classList.remove('cursor-hover');
            }
        });
    }

    // ============================================================
    // 3. NAVIGATION (ABOUT ME, CONTENT, CONTACT ME) & MEDIA SHELVES
    // ============================================================
    const tabPanels = document.querySelectorAll('.tab-panel');
    const contentTabBtns = document.querySelectorAll('.content-tab-btn');
    const navButtonsWithTarget = document.querySelectorAll('[data-nav-target]');
    const shelfJumpPills = document.querySelectorAll('.shelf-jump-pill[data-tab-jump], .shelf-chip[data-tab-jump], .matrix-tile[data-tab-jump]');

    // Smooth scroll to top-level sections (about, content, contact)
    const scrollToSection = (sectionId) => {
        playUiClick();
        if (sectionId === 'about') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            updateActiveNavUI('about');
            return;
        }

        const targetEl = document.getElementById(sectionId);
        if (!targetEl) return;

        // Header offset (navbar is fixed ~64px)
        const headerOffset = sectionId === 'content' ? 62 : 68;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });

        updateActiveNavUI(sectionId);
    };

    // Update active state on top navbar, mobile drawer, and footer navigation
    const updateActiveNavUI = (activeNavTarget) => {
        navButtonsWithTarget.forEach(btn => {
            const matches = btn.getAttribute('data-nav-target') === activeNavTarget;
            btn.classList.toggle('active', matches);
            btn.setAttribute('aria-selected', matches ? 'true' : 'false');
        });
    };

    // Smooth scroll to specific media shelf with sticky dock offset
    const scrollToShelf = (targetId) => {
        playUiClick();
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        // Compensation for sticky navbar (~64px) and sticky dock (~60px)
        const headerOffset = 132;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });

        updateActiveShelfUI(targetId);
        updateActiveNavUI('content');
    };

    // Update active indicators across sticky dock pills & hero shelf jump pills
    const updateActiveShelfUI = (activeId) => {
        // Sticky category dock pills
        contentTabBtns.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === activeId;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            if (isMatch) {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            }
        });

        // Hero quick-jump pills & chips
        shelfJumpPills.forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-tab-jump') === activeId);
        });
    };

    // Attach click listeners to all Top Navbar, Drawer & Footer buttons (About Me, Content, Contact Me)
    navButtonsWithTarget.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-nav-target');
            if (target) {
                scrollToSection(target);
                // If in mobile drawer, close drawer
                const mobileDrawer = document.getElementById('mobile-drawer');
                if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                    mobileDrawer.classList.remove('open');
                    const icon = document.querySelector('#mobile-toggle i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }
            }
        });
    });

    // Attach click listeners to Brand Logo and Footer Logo to return to About Me / Top
    document.querySelectorAll('.brand-logo, .footer-logo').forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('about');
        });
    });

    // Attach smooth scroll to all in-page section jump links (e.g. href="#about", href="#content", href="#contact")
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href')?.replace('#', '');
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                if (targetId === 'about' || targetId === 'content' || targetId === 'contact') {
                    scrollToSection(targetId);
                } else {
                    scrollToShelf(targetId);
                }
            }
        });
    });

    // Attach click listeners to Sticky Category dock buttons (01 Videos, 02 Vlogs, etc.)
    contentTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            scrollToShelf(target);
        });
    });

    // Attach click listeners to Hero Shelf Jump pills
    shelfJumpPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const target = pill.getAttribute('data-tab-jump');
            scrollToShelf(target);
        });
    });

    // Hero "Explore Shelves" primary CTA
    const btnExploreContent = document.getElementById('btn-explore-content');
    if (btnExploreContent) {
        btnExploreContent.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToShelf('tab-videos');
        });
    }

    // Real-Time ScrollSpy for Media Shelves via IntersectionObserver
    if ('IntersectionObserver' in window && tabPanels.length > 0) {
        const shelfObserverOptions = {
            root: null,
            rootMargin: '-15% 0px -60% 0px',
            threshold: 0
        };

        const shelfObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateActiveShelfUI(entry.target.id);
                    updateActiveNavUI('content');
                }
            });
        }, shelfObserverOptions);

        tabPanels.forEach(panel => {
            shelfObserver.observe(panel);
        });
    }

    // Top-Level Landmark ScrollSpy (About Me, Content, Contact Me)
    const landmarkAbout = document.getElementById('about');
    const landmarkContent = document.getElementById('content');
    const landmarkContact = document.getElementById('contact');

    const updateLandmarkScrollSpy = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        // If at or near bottom, or contact is visible
        if (landmarkContact) {
            const contactTop = landmarkContact.getBoundingClientRect().top + scrollY;
            if (scrollY + windowHeight * 0.45 >= contactTop) {
                updateActiveNavUI('contact');
                return;
            }
        }

        // If within content shelves
        if (landmarkContent) {
            const contentTop = landmarkContent.getBoundingClientRect().top + scrollY;
            if (scrollY + 140 >= contentTop) {
                updateActiveNavUI('content');
                return;
            }
        }

        // Otherwise in Hero / About section
        updateActiveNavUI('about');
    };

    window.addEventListener('scroll', updateLandmarkScrollSpy, { passive: true });

    // ============================================================
    // 3B. HORIZONTAL MEDIA RAILS (Prev / Next Arrows & Drag Scroll)
    // ============================================================
    const railArrowBtns = document.querySelectorAll('.rail-arrow-btn');
    railArrowBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            playUiClick();
            const targetRailId = btn.getAttribute('data-rail-target');
            const rail = document.getElementById(targetRailId);
            if (!rail) return;

            const scrollDistance = Math.max(rail.clientWidth * 0.75, 320);
            const isPrev = btn.classList.contains('rail-prev');
            rail.scrollBy({
                left: isPrev ? -scrollDistance : scrollDistance,
                behavior: 'smooth'
            });
        });
    });

    // Touch & Mouse Drag to Scroll on Media Rails
    const mediaRails = document.querySelectorAll('.media-cards-rail');
    mediaRails.forEach(rail => {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let hasMoved = false;

        rail.addEventListener('mousedown', (e) => {
            // Ignore if clicked on links or buttons directly
            if (e.target.closest('a, button')) return;
            isDown = true;
            hasMoved = false;
            rail.classList.add('dragging');
            startX = e.pageX - rail.offsetLeft;
            scrollLeft = rail.scrollLeft;
        });

        rail.addEventListener('mouseleave', () => {
            isDown = false;
            rail.classList.remove('dragging');
        });

        rail.addEventListener('mouseup', () => {
            isDown = false;
            rail.classList.remove('dragging');
        });

        rail.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - rail.offsetLeft;
            const walk = (x - startX) * 1.4;
            if (Math.abs(walk) > 5) hasMoved = true;
            rail.scrollLeft = scrollLeft - walk;
        });

        // Prevent click if user was dragging
        rail.addEventListener('click', (e) => {
            if (hasMoved) {
                e.stopPropagation();
                hasMoved = false;
            }
        }, true);
    });


    // ============================================================
    // 4. NAVBAR SCROLL & MOBILE MENU
    // ============================================================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            playUiClick();
            mobileDrawer.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = mobileDrawer.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });
    }

    // Back to top button
    const btnBackToTop = document.getElementById('btn-back-to-top');
    if (btnBackToTop) {
        btnBackToTop.addEventListener('click', () => {
            playUiClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ============================================================
    // 5. MODALS (Playable Video Modal + Slot Info Modal)
    // ============================================================
    
    // A. Playable Video Modal (for active YouTube podcasts)
    const videoModal = document.getElementById('video-modal');
    const videoModalClose = document.getElementById('video-modal-close');
    const modalVideoIframe = document.getElementById('modal-video-iframe');
    const modalVideoTitle = document.getElementById('modal-video-title');
    const modalVideoDesc = document.getElementById('modal-video-desc');
    const modalVideoCategory = document.getElementById('modal-video-category');
    const modalVideoYtLink = document.getElementById('modal-video-yt-link');

    const openVideoModal = (videoId, title, category, desc) => {
        playStudioEntrance();
        if (modalVideoTitle) modalVideoTitle.textContent = title || 'Featured Episode';
        if (modalVideoCategory) modalVideoCategory.textContent = (category || 'PODCAST').toUpperCase();
        if (modalVideoDesc) modalVideoDesc.textContent = desc || 'Streaming episode from lazyninja.';
        if (modalVideoYtLink) modalVideoYtLink.href = `https://youtu.be/${videoId}`;

        if (modalVideoIframe) {
            modalVideoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }

        if (videoModal) {
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeVideoModal = () => {
        playUiClick();
        if (videoModal) videoModal.classList.remove('open');
        document.body.style.overflow = '';
        if (modalVideoIframe) modalVideoIframe.src = '';
    };

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }

    // B. Slot Info Modal (for placeholder slots awaiting links)
    const slotModal = document.getElementById('slot-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');
    const modalSecBadge = document.getElementById('modal-sec-badge');
    const modalSlotTitle = document.getElementById('modal-slot-title');

    const openSlotModal = (title, category) => {
        playUiClick();
        if (modalSlotTitle) modalSlotTitle.textContent = title || 'Release Slot';
        if (modalSecBadge) modalSecBadge.textContent = (category || 'MEDIA').toUpperCase();
        if (slotModal) {
            slotModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeSlotModal = () => {
        playUiClick();
        if (slotModal) {
            slotModal.classList.remove('open');
        }
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSlotModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeSlotModal);

    if (slotModal) {
        slotModal.addEventListener('click', (e) => {
            if (e.target === slotModal) closeSlotModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('open')) closeVideoModal();
            if (slotModal && slotModal.classList.contains('open')) closeSlotModal();
        }
    });

    // Attach click listeners to all cards & slot buttons
    document.querySelectorAll('.media-slot-card').forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        const xUrl = card.getAttribute('data-x-url');
        const kickUrl = card.getAttribute('data-kick-url');
        const title = card.getAttribute('data-title') || card.querySelector('.slot-title')?.textContent || 'Media Item';
        const category = card.getAttribute('data-category') || card.querySelector('.slot-category')?.textContent || 'Archive';
        const desc = card.getAttribute('data-desc') || card.querySelector('.slot-snippet')?.textContent || '';

        card.addEventListener('click', (e) => {
            // If user clicked direct link inside card, let default link navigation occur
            if (e.target.closest('a')) return;

            if (videoId) {
                openVideoModal(videoId, title, category, desc);
            } else if (xUrl) {
                window.open(xUrl, '_blank', 'noopener,noreferrer');
            } else if (kickUrl) {
                window.open(kickUrl, '_blank', 'noopener,noreferrer');
            } else {
                openSlotModal(title, category);
            }
        });
    });


    // ============================================================
    // 6. TOAST NOTIFICATION & DIRECT CONNECT HELPERS
    // ============================================================
    let toastTimeout = null;
    const toastEl = document.getElementById('toast-notification');

    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    }

    // Email Copy Button in Contact Section
    const btnCopyEmail = document.getElementById('btn-copy-email');
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            playUiClick();
            const email = btnCopyEmail.getAttribute('data-email') || 'ninjalazy6@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Copied: ' + email);
                    const originalHtml = btnCopyEmail.innerHTML;
                    btnCopyEmail.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
                    setTimeout(() => {
                        btnCopyEmail.innerHTML = originalHtml;
                    }, 2200);
                }).catch(() => {
                    showToast('Email: ' + email);
                });
            } else {
                showToast('Email: ' + email);
            }
        });
    }

    // Attach click sound to interactive links and cards
    document.querySelectorAll('.channel-card, .social-pill, .nav-social-icon, .micro-social, .contact-card, .strip-pill, .footer-tab-link, .btn-copy-email').forEach(link => {
        link.addEventListener('click', () => {
            playUiClick();
        });
    });

    // ============================================================
    // 10. FAIL-SAFE IMAGE LOADING ENGINE (Kick & Guest Avatars)
    // ============================================================
    const initFailSafeImages = () => {
        // Guest Avatars resilient loading
        const guestCards = document.querySelectorAll('.guest-card');
        guestCards.forEach((card) => {
            const img = card.querySelector('.guest-avatar-img');
            const handleEl = card.querySelector('.guest-handle');
            const nameEl = card.querySelector('.guest-name');
            if (!img) return;

            const handle = handleEl ? handleEl.textContent.replace('@', '').trim() : '';
            const name = nameEl ? nameEl.textContent.trim() : handle || 'Guest';

            const generateInitialsSvg = (text) => {
                const initials = text.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'G';
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/><text x="50%" y="54%" font-family="Outfit, sans-serif" font-weight="700" font-size="36" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
            };

            img.addEventListener('error', () => {
                if (!img.dataset.triedFallback && handle) {
                    img.dataset.triedFallback = 'unavatar';
                    img.src = `https://unavatar.io/x/${handle}`;
                } else if (img.dataset.triedFallback === 'unavatar') {
                    img.dataset.triedFallback = 'svg';
                    img.src = generateInitialsSvg(name);
                }
            });

            // Banner fallback: check if banner background image loads
            const bannerHeader = card.querySelector('.guest-banner-header');
            if (bannerHeader && bannerHeader.style.backgroundImage) {
                const bgMatch = bannerHeader.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (bgMatch && bgMatch[1]) {
                    const bannerTest = new Image();
                    bannerTest.referrerPolicy = 'no-referrer';
                    bannerTest.onerror = () => {
                        bannerHeader.style.backgroundImage = 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)';
                    };
                    bannerTest.src = bgMatch[1];
                }
            }
        });

        // Kick Stream image resilient loading
        const kickThumb = document.querySelector('.kick-thumb');
        if (kickThumb) {
            kickThumb.addEventListener('error', () => {
                kickThumb.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="%230a0e17"/><rect x="20" y="20" width="600" height="320" rx="12" fill="%23111827" stroke="%2353fc18" stroke-width="2"/><circle cx="320" cy="180" r="44" fill="%2353fc18" fill-opacity="0.15"/><polygon points="312,165 336,180 312,195" fill="%2353fc18"/><text x="320" y="250" font-family="Outfit, sans-serif" font-weight="700" font-size="22" fill="%23ffffff" text-anchor="middle">LIVE STREAM PREVIEW</text><text x="320" y="275" font-family="monospace" font-size="14" fill="%2353fc18" text-anchor="middle">kick.com/lazyvibezzz</text></svg>';
            });
        }
    };
    initFailSafeImages();
});
