// cards.js - Tập tin JavaScript xử lý các tương tác cho thẻ bài

document.addEventListener('DOMContentLoaded', function() {
    // Lấy tất cả các thẻ nguyên tố
    const elementCards = document.querySelectorAll('.element-card');
    
    // Thêm hiệu ứng hover và click cho mỗi thẻ
    elementCards.forEach(card => {
        // Tạo hiệu ứng khi di chuột qua
        card.addEventListener('mouseenter', function() {
            // Thêm lớp hover cho card
            this.classList.add('card-hover');
            
            // Tạo hiệu ứng tỏa sáng cho biểu tượng nguyên tố
            const elementSymbol = this.querySelector('.element-symbol');
            if (elementSymbol) {
                elementSymbol.style.transform = 'scale(1.1)';
                elementSymbol.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                elementSymbol.style.boxShadow = '0 0 25px currentColor';
            }
        });
        
        // Xóa hiệu ứng khi di chuột ra khỏi
        card.addEventListener('mouseleave', function() {
            // Xóa lớp hover
            this.classList.remove('card-hover');
            
            // Đặt lại biểu tượng
            const elementSymbol = this.querySelector('.element-symbol');
            if (elementSymbol) {
                elementSymbol.style.transform = 'scale(1)';
                elementSymbol.style.boxShadow = '0 0 15px currentColor';
            }
        });
        
        // Xử lý sự kiện click
        card.addEventListener('click', function() {
            // Toggle lớp flip để lật thẻ
            this.classList.toggle('flipped');
        });
    });
    
    // Tạo hiệu ứng lấp lánh ngẫu nhiên cho các thẻ nguyên tố
    function createSparkleEffect() {
        // Chọn ngẫu nhiên một thẻ bài để tạo hiệu ứng
        const randomIndex = Math.floor(Math.random() * elementCards.length);
        const randomCard = elementCards[randomIndex];
        
        // Tạo hiệu ứng lấp lánh
        randomCard.classList.add('sparkle');
        
        // Xóa hiệu ứng sau 1 giây
        setTimeout(() => {
            randomCard.classList.remove('sparkle');
            
            // Gọi lại hàm này để tạo hiệu ứng liên tục với thời gian ngẫu nhiên
            setTimeout(createSparkleEffect, Math.random() * 3000 + 2000); // 2-5 giây
        }, 1000);
    }
    
    // Thêm style cho hiệu ứng lấp lánh
    const sparkleStyle = document.createElement('style');
    sparkleStyle.innerHTML = `
        @keyframes sparkle {
            0% { box-shadow: 0 0 5px var(--color-highlight); }
            50% { box-shadow: 0 0 25px var(--color-highlight); }
            100% { box-shadow: 0 0 5px var(--color-highlight); }
        }
        
        .sparkle {
            animation: sparkle 1s ease-in-out;
        }
        
        .element-card.flipped .card-front {
            transform: rotateY(-180deg);
        }
        
        .element-card.flipped .card-back {
            transform: rotateY(0deg);
        }
        
        /* Style cho video placeholder */
        .video-placeholder.playing img, .video-placeholder.playing .play-button {
            display: none;
        }
        
        .video-placeholder iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }
    `;
    document.head.appendChild(sparkleStyle);
    
    // Bắt đầu hiệu ứng lấp lánh sau khi trang đã tải
    setTimeout(createSparkleEffect, 3000);
    
    // Thêm hiệu ứng năng lượng nguyên tố
    function createElementEffects() {
        // Thêm hiệu ứng ánh sáng đặc biệt cho từng nguyên tố
        const metalCard = document.getElementById('metal');
        const woodCard = document.getElementById('wood');
        const waterCard = document.getElementById('water');
        const earthCard = document.getElementById('earth');
        const fireCard = document.getElementById('fire');
        
        // Tạo hạt năng lượng cho mỗi nguyên tố
        function createParticles(element, color, count) {
            if (!element) return;
            
            const symbol = element.querySelector('.element-symbol');
            if (!symbol) return;
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'element-particle';
                
                const size = Math.random() * 6 + 2; // 2-8px
                const posX = Math.random() * 100 - 50; // -50 to 50
                const posY = Math.random() * 100 - 50; // -50 to 50
                const duration = Math.random() * 2 + 2; // 2-4s
                const delay = Math.random() * 2; // 0-2s
                
                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    background-color: ${color};
                    position: absolute;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(${posX}px, ${posY}px);
                    opacity: 0;
                    pointer-events: none;
                    animation: float ${duration}s ease-in-out ${delay}s infinite;
                `;
                
                symbol.appendChild(particle);
            }
        }
        
        // Thêm style cho hiệu ứng hạt
        const particleStyle = document.createElement('style');
        particleStyle.innerHTML = `
            @keyframes float {
                0% { opacity: 0; transform: translate(0, 0); }
                25% { opacity: 0.8; }
                100% { opacity: 0; transform: translate(var(--moveX), var(--moveY)); }
            }
            
            .element-symbol {
                position: relative;
                overflow: visible;
            }
            
            .element-card:hover .element-particle {
                --moveX: calc(var(--x) * 80px);
                --moveY: calc(var(--y) * 80px);
            }
        `;
        document.head.appendChild(particleStyle);
        
        // Tạo hạt cho từng nguyên tố với màu riêng
        createParticles(metalCard, 'rgba(192, 192, 192, 0.7)', 5);
        createParticles(woodCard, 'rgba(125, 158, 102, 0.7)', 5);
        createParticles(waterCard, 'rgba(70, 130, 180, 0.7)', 5);
        createParticles(earthCard, 'rgba(139, 69, 19, 0.7)', 5);
        createParticles(fireCard, 'rgba(255, 69, 0, 0.7)', 5);
        
        // Cập nhật vị trí ngẫu nhiên cho các hạt
        const particles = document.querySelectorAll('.element-particle');
        particles.forEach(particle => {
            particle.style.setProperty('--x', Math.random() * 2 - 1);
            particle.style.setProperty('--y', Math.random() * 2 - 1);
        });
    }
    
    // Tạo hiệu ứng năng lượng nguyên tố
    createElementEffects();
});