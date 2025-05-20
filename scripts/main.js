// main.js - Tập tin JavaScript chính cho website

// Đợi tải tài liệu hoàn tất trước khi chạy script
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý menu trên thiết bị di động
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Đóng menu khi nhấp vào liên kết
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Xử lý header khi cuộn
    function handleHeaderScroll() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Xử lý cuộn mượt cho liên kết
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Chiều cao của header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hiệu ứng xuất hiện khi cuộn
    const revealElements = document.querySelectorAll('.container');
    const revealThreshold = 0.15; // Phần tử hiển thị khi hiện 15%
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = window.innerHeight * revealThreshold;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
        
        // Kiểm tra và hiển thị thẻ nguyên tố
        const elementCards = document.querySelectorAll('.element-card');
        elementCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = window.innerHeight * 0.2;
            
            if (cardTop < window.innerHeight - cardVisible) {
                card.classList.add('visible');
            }
        });
    }
    
    // Thêm lớp CSS cho animation xuất hiện
    const style = document.createElement('style');
    style.innerHTML = `
        .container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .container.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Kích hoạt kiểm tra khi cuộn
    window.addEventListener('scroll', checkReveal);
    
    // Chạy kiểm tra đầu tiên
    checkReveal();
    
    // Xử lý tabs trong phần gameplay
    const gameplayTabs = document.querySelectorAll('.tab');
    const gameplayFeatures = document.querySelectorAll('.gameplay-feature');
    
    if (gameplayTabs.length > 0 && gameplayFeatures.length > 0) {
        gameplayTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Xóa lớp active cho tất cả tabs
                gameplayTabs.forEach(t => t.classList.remove('active'));
                
                // Thêm lớp active cho tab được chọn
                this.classList.add('active');
                
                // Lấy ID của tab
                const targetId = this.getAttribute('data-tab');
                
                // Ẩn tất cả các gameplayFeature
                gameplayFeatures.forEach(feature => {
                    feature.classList.remove('active');
                });
                
                // Hiển thị gameplayFeature tương ứng
                const targetFeature = document.getElementById(targetId);
                if (targetFeature) {
                    targetFeature.classList.add('active');
                }
            });
        });
    }
    
    // Xử lý nút hero
    const ctaButtons = document.querySelectorAll('.hero-buttons .cta-button');
    if (ctaButtons.length >= 2) {
        // Nút "Khám Phá Ngay"
        ctaButtons[0].addEventListener('click', function() {
            const gameSection = document.getElementById('game');
            if (gameSection) {
                const headerOffset = 80;
                const elementPosition = gameSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Nút "Về Team Chúng Tôi"
        ctaButtons[1].addEventListener('click', function() {
            const teamSection = document.getElementById('team');
            if (teamSection) {
                const headerOffset = 80;
                const elementPosition = teamSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Xử lý nút play video
    const playButton = document.querySelector('.play-button');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (playButton && videoPlaceholder) {
        playButton.addEventListener('click', function() {
            // Tạo iframe video (mẫu)
            const iframe = document.createElement('iframe');
            iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"; // Thay bằng URL video thực tế
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            // Xóa nội dung hiện tại và thêm iframe
            videoPlaceholder.innerHTML = '';
            videoPlaceholder.appendChild(iframe);
            
            // Thêm class để styling
            videoPlaceholder.classList.add('playing');
        });
    }
    
    // Xử lý biểu mẫu liên hệ
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu biểu mẫu
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Kiểm tra dữ liệu
            let valid = true;
            let errorMessage = '';
            
            if (!formData.name.trim()) {
                valid = false;
                errorMessage += 'Vui lòng nhập họ tên.\n';
            }
            
            if (!formData.email.trim()) {
                valid = false;
                errorMessage += 'Vui lòng nhập email.\n';
            } else if (!isValidEmail(formData.email)) {
                valid = false;
                errorMessage += 'Vui lòng nhập email hợp lệ.\n';
            }
            
            if (!formData.message.trim()) {
                valid = false;
                errorMessage += 'Vui lòng nhập nội dung tin nhắn.\n';
            }
            
            if (!valid) {
                alert(errorMessage);
                return;
            }
            
            // Mô phỏng gửi dữ liệu
            alert('Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại sớm nhất có thể!');
            contactForm.reset();
        });
    }
    
    // Hàm kiểm tra email hợp lệ
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Xử lý form đăng ký nhận tin
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Vui lòng nhập địa chỉ email.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Vui lòng nhập địa chỉ email hợp lệ.');
                return;
            }
            
            alert('Cảm ơn bạn đã đăng ký nhận tin!');
            emailInput.value = '';
        });
    }
});