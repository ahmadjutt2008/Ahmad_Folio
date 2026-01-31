document.addEventListener('DOMContentLoaded', function () {
    // 1. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                const navCollapse = document.querySelector('.navbar-collapse');
                if (navCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navCollapse).hide();
                }
            }
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm', 'bg-dark');
            navbar.style.background = 'rgba(10, 14, 23, 0.98)';
        } else {
            navbar.classList.remove('shadow-sm', 'bg-dark');
            navbar.style.background = 'rgba(10, 14, 23, 0.95)';
        }
    });

    // 3. Stats Counter Animation
    const statsSection = document.querySelector('#why-me');
    let statsAnimated = false;

    const animateStats = () => {
        const counters = document.querySelectorAll('.display-4');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || parseInt(counter.innerText);
            // Store original text if not already stored
            if (!counter.getAttribute('data-target')) counter.setAttribute('data-target', target);

            counter.innerText = '0';

            const updateCount = () => {
                const count = +counter.innerText.replace(/[^0-9]/g, ''); // Remove non-numeric for calculation
                const speed = 200; // Lower is slower
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc) + (counter.getAttribute('data-suffix') || '%');
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + (counter.getAttribute('data-suffix') || '%');
                }
            };
            updateCount();
        });
    };

    // 4. Intersection Observer for Animations (Fade-in & Stats)
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Trigger stats only once
                if (entry.target.id === 'why-me' && !statsAnimated) {
                    statsAnimated = true;
                    // Need to manually add data-suffix to HTML or just handle via JS assumption
                    // Let's assume the text in HTML is the target
                    animateStats();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // 5. Contact Form Validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.classList.remove('btn-info');
                btn.classList.add('btn-success');
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.add('btn-info');
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});

function sendToWhatsapp(e) {
    // 1. Prevent the page from reloading when submitting the form
    e.preventDefault();

    // 2. Get the values from the input fields using the IDs we added
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    // 3. Your Phone Number (No + sign)
    let phoneNumber = "923166822451";

    // 4. Format the message
    // \n creates a new line. We use encodeURIComponent to handle spaces and special chars safely.
    let text = `*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
    let encodedText = encodeURIComponent(text);

    // 5. Create the URL
    let url = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // 6. Open WhatsApp
    window.open(url, '_blank').focus();
}
