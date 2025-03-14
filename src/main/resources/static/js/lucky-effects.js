// 럭키 효과 처리를 위한 함수 추가
function showLuckyEffect() {
    // 1. 화면에 럭키 효과 오버레이 생성
    const luckyOverlay = document.createElement('div');
    luckyOverlay.className = 'lucky-overlay';
    luckyOverlay.innerHTML = `
        <div class="lucky-content">
            <div class="lucky-icon">🎉</div>
            <div class="lucky-title">LUCKY!</div>
            <div class="lucky-message">행운의 여신이 함께하길</div>
        </div>
    `;
    document.body.appendChild(luckyOverlay);

    // 2. 오버레이 애니메이션 설정
    setTimeout(() => {
        luckyOverlay.classList.add('show');

        // 3. 반짝이는 효과 생성 (30개의 별)
        for (let i = 0; i < 30; i++) {
            createStar(luckyOverlay);
        }

        // 4. 폭죽 효과 추가
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createFirework(luckyOverlay);
            }, i * 300);
        }

        // 5. 일정 시간 후 오버레이 제거
        setTimeout(() => {
            luckyOverlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(luckyOverlay);
            }, 600);
        }, 3500);
    }, 100);

    // 6. 방어구 항목에 반짝이는 효과 추가
    const armorElements = document.querySelectorAll('.armor-piece');
    armorElements.forEach(element => {
        element.classList.add('lucky-highlight');
        setTimeout(() => {
            element.classList.remove('lucky-highlight');
        }, 4000);
    });
}

// 반짝이는 별 효과 생성 함수
function createStar(container) {
    const star = document.createElement('div');
    star.className = 'lucky-star';

    // 랜덤 위치 설정
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 2 + 1;
    const delay = Math.random() * 1.5;

    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    container.appendChild(star);

    // 별 애니메이션 완료 후 제거
    setTimeout(() => {
        container.removeChild(star);
    }, (duration + delay) * 1000);
}

// 폭죽 효과 생성 함수
function createFirework(container) {
    const firework = document.createElement('div');
    firework.className = 'lucky-firework';

    // 랜덤 위치 설정
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 80 + 10;

    firework.style.left = `${left}%`;
    firework.style.top = `${top}%`;

    container.appendChild(firework);

    // 폭죽 파티클 생성
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'lucky-particle';

        // 랜덤 각도와 거리
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 40;
        const duration = Math.random() * 1 + 0.5;
        const delay = Math.random() * 0.2;
        const size = Math.random() * 4 + 2;

        // 랜덤 색상
        const colors = ['#ffff00', '#ff4500', '#00ff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.backgroundColor = color;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = '0';
        particle.style.transition = `all ${duration}s ease-out ${delay}s`;

        firework.appendChild(particle);

        // 파티클 애니메이션 시작
        setTimeout(() => {
            particle.style.opacity = '1';
        }, 10);

        // 파티클 제거
        setTimeout(() => {
            firework.removeChild(particle);
        }, (duration + delay) * 1000);
    }

    // 폭죽 제거
    setTimeout(() => {
        container.removeChild(firework);
    }, 2000);
}

// CSS 스타일 추가
function addLuckyStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .lucky-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
        }
        .lucky-overlay.show {
            opacity: 1;
        }
        .lucky-content {
            text-align: center;
            color: white;
            z-index: 2;
        }
        .lucky-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: spin 2s infinite;
        }
        .lucky-title {
            font-size: 72px;
            font-weight: bold;
            color: gold;
            text-shadow: 0 0 10px gold, 0 0 20px gold;
            margin-bottom: 20px;
            animation: pulse 1s infinite;
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
        }
        .lucky-message {
            font-size: 24px;
            color: white;
        }
        .lucky-star {
            position: absolute;
            background-color: gold;
            border-radius: 50%;
            opacity: 0;
            animation: twinkle 2s forwards;
        }
        .lucky-highlight {
            animation: highlight 1s infinite;
        }
        .lucky-firework {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 1;
        }
        .lucky-particle {
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: gold;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @keyframes twinkle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
        }
        @keyframes highlight {
            0% { box-shadow: 0 0 5px gold; }
            50% { box-shadow: 0 0 20px gold, 0 0 30px gold; }
            100% { box-shadow: 0 0 5px gold; }
        }
    `;
    document.head.appendChild(styleEl);
}

// 페이지 로드 시 럭키 스타일 추가
window.addEventListener('DOMContentLoaded', function() {
    addLuckyStyles();
});