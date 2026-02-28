// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navUl = document.querySelector('nav ul');

mobileBtn.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Staggered delay for service cards
            if (entry.target.classList.contains('service-card')) {
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-card, .contact-box').forEach(el => {
    observer.observe(el);
});

// Glitch text effect logic for hero title on hover
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                glitchText.style.transform = 'translate(0, 0)';
            }, 50);
        }
    }, 100);
}

// Testimonial Slider logic
const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (sliderWrapper && slides.length > 0) {
    let currentSlide = 0;

    function updateSlider() {
        // Calculate the translation percentage based on the current slide
        sliderWrapper.style.transform = `translateX(-${currentSlide * (100 / slides.length)}%)`;

        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    // Initialize first slide
    updateSlider();

    // Auto slide optional (every 5 seconds)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 5000);
}

// Slip Generation Logic
const slipForm = document.getElementById('slipForm');
const receiptModal = document.getElementById('receiptModal');
const closeModal = document.querySelector('.close-modal');
const btnPrint = document.getElementById('btnPrint');
const btnWhatsapp = document.getElementById('btnWhatsapp');

if (slipForm) {
    slipForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const date = document.getElementById('orderDate').value;
        const returnDate = document.getElementById('returnDate').value;

        // Generate Random Order No
        const orderNo = Math.floor(100000 + Math.random() * 900000);

        // Gather Items
        const itemInputs = document.querySelectorAll('.item-input input');
        let totalItems = 0;
        let grandTotal = 0;
        let itemsHtml = '';
        let whatsappText = `*Sparkle Clean - Order Slip*\nOrder No: INV-${orderNo}\nName: ${name}\nPhone: ${phone}\nOrder Date: ${date}\nReturn Date: ${returnDate}\n\n*Items:*\n`;

        itemInputs.forEach(input => {
            const qty = parseInt(input.value);
            if (qty > 0) {
                const itemName = input.getAttribute('data-item');
                const price = parseInt(input.getAttribute('data-price')) || 0;
                const total = qty * price;

                itemsHtml += `
                    <tr>
                        <td style="padding: 5px 0; border-bottom: 1px dashed #eee;">${itemName}</td>
                        <td style="text-align: right; padding: 5px 0; border-bottom: 1px dashed #eee;">${qty}</td>
                        <td style="text-align: right; padding: 5px 0; border-bottom: 1px dashed #eee;">Rs. ${price}</td>
                        <td style="text-align: right; padding: 5px 0; border-bottom: 1px dashed #eee;">Rs. ${total}</td>
                    </tr>
                `;
                totalItems += qty;
                grandTotal += total;
                whatsappText += `- ${itemName}: ${qty} x ${price} = Rs. ${total}\n`;
            }
        });

        if (totalItems === 0) {
            alert("Please select at least one item.");
            return;
        }

        whatsappText += `\n*Total Items:* ${totalItems}`;
        whatsappText += `\n*Grand Total: Rs. ${grandTotal}*\n\nThank you for choosing Sparkle Clean!`;

        // Populate Receipt
        document.getElementById('rName').textContent = name;
        document.getElementById('rPhone').textContent = phone;
        document.getElementById('rDate').textContent = date;
        document.getElementById('rReturnDate').textContent = returnDate;
        document.getElementById('rOrderNo').textContent = `${orderNo}`;
        document.getElementById('rItemsList').innerHTML = itemsHtml;
        document.getElementById('rTotalQty').textContent = totalItems;
        document.getElementById('rGrandTotal').textContent = `Rs. ${grandTotal}`;

        // Show Modal
        receiptModal.classList.add('active');

        // Setup WhatsApp Btn
        let waPhone = phone.replace(/[^0-9]/g, '');
        if (waPhone.startsWith('03')) {
            waPhone = '92' + waPhone.substring(1);
        }

        btnWhatsapp.onclick = function () {
            const encodedText = encodeURIComponent(whatsappText);
            window.open(`https://wa.me/${waPhone}?text=${encodedText}`, '_blank');
        };
    });

    closeModal.addEventListener('click', () => {
        receiptModal.classList.remove('active');
    });

    receiptModal.addEventListener('click', (e) => {
        if (e.target === receiptModal) {
            receiptModal.classList.remove('active');
        }
    });

    btnPrint.addEventListener('click', () => {
        window.print();
    });
}
