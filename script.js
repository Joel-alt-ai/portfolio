document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
        });
    }

    // Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            
            // Fade out when scrolling down
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('scrolled', 'nav-hidden');
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    // Apply fade-in class and observe sections/cards
    const elementsToAnimate = document.querySelectorAll('.glass-panel, .section-title, .hero-text, .skill-bar-bg, .contact-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="bx bx-menu"></i>';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Submission (Telegram + Email Notification)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const emailValue = document.getElementById('email').value;
            const whatsappNumber = document.getElementById('whatsapp').value;
            const subject = document.getElementById('subject').value;
            const messageValue = document.getElementById('message').value;
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // UI Feedback: Show sending state
            btn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // 1. Send Email Notification (Background) using FormSubmit.co
            fetch("https://formsubmit.co/ajax/joelshajan2004@gmail.com", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: emailValue,
                    whatsapp: whatsappNumber, // Added WhatsApp number to email
                    subject: subject,
                    message: messageValue,
                    _subject: `New Portfolio Inquiry: ${name}`,
                    _captcha: "false" // Disables captcha for smoother background sending
                })
            })
            .then(response => {
                if (!response.ok) throw new Error("Email submission failed");
                return response.json();
            })
            .then(data => console.log("Email sent successfully", data))
            .catch(err => console.error("Email failed", err));

            // 2. Send Telegram Notification (Background)
            const botToken = "8719364674:AAHBWpACBaLxoE-moFWty2MTY0ho8zk5Q00";
            const chatId = "8698716658";
            
            // Using HTML mode is safer for user-generated text
            const telegramMsg = `<b>🚀 New Contact Inquiry</b>\n\n` +
                                `<b>Name:</b> ${name}\n` +
                                `<b>Email:</b> ${emailValue}\n` +
                                `<b>WhatsApp:</b> ${whatsappNumber}\n` + // Added WhatsApp to Telegram
                                `<b>Subject:</b> ${subject}\n\n` +
                                `<b>Message:</b>\n${messageValue}`;
            
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMsg,
                    parse_mode: "HTML"
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        console.error("Telegram API Error:", data);
                        throw new Error(data.description);
                    });
                }
                return response.json();
            })
            .then(data => console.log("Telegram sent successfully", data))
            .catch(err => console.error("Telegram failed", err));

            // 3. Final Success UI: Show success state without redirecting
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="bx bx-check"></i>';
                btn.style.background = '#4CAF50'; // Elegant Green
                btn.style.opacity = '1';
                
                // Clear the form
                contactForm.reset();

                // Restore button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }

    // Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    let fPosX = 0, fPosY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const updateCursor = () => {
        // Smooth cursor movement
        posX += (mouseX - posX) * 0.2;
        posY += (mouseY - posY) * 0.2;
        fPosX += (mouseX - fPosX) * 0.1;
        fPosY += (mouseY - fPosY) * 0.1;

        if (cursor) cursor.style.transform = `translate(${mouseX - 7.5}px, ${mouseY - 7.5}px)`;
        if (follower) follower.style.transform = `translate(${fPosX - 20}px, ${fPosY - 20}px)`;

        requestAnimationFrame(updateCursor);
    };
    updateCursor();

    // Hover effects for cursor
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .portfolio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (follower) {
                follower.style.transform = `translate(${fPosX - 30}px, ${fPosY - 30}px) scale(1.5)`;
                follower.style.borderColor = 'var(--accent-2)';
                follower.style.background = 'rgba(0, 229, 255, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (follower) {
                follower.style.transform = `translate(${fPosX - 20}px, ${fPosY - 20}px) scale(1)`;
                follower.style.borderColor = 'var(--accent-1)';
                follower.style.background = 'transparent';
            }
        });
    });

    // Parallax logic for Hero Blobs
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.2;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
});
