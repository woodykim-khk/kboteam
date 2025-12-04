const teams = [
    { name: '두산 베어스', shortName: '두산', color: '#1e3a5f', mascot: '🐻', slogan: '최강 두산! 허슬두와 함께할 운명입니다.!' },
    { name: 'LG 트윈스', shortName: 'LG', color: '#c41e3a', mascot: '🔴', slogan: '승리의 환호! LG 트윈스!' },
    { name: '삼성 라이온즈', shortName: '삼성', color: '#0066b3', mascot: '🦁', slogan: '포효하라! 삼성 라이온즈!' },
    { name: '롯데 자이언츠', shortName: '롯데', color: '#002d72', mascot: '🌊', slogan: '부산 갈매기! 롯데 자이언츠!' },
    { name: 'KIA 타이거즈', shortName: 'KIA', color: '#ea002a', mascot: '🐯', slogan: '해태의 후예! KIA 타이거즈!' },
    { name: '한화 이글스', shortName: '한화', color: '#ff6600', mascot: '🦅', slogan: '창공을 날아라! 한화 이글스!' },
    { name: 'SSG 랜더스', shortName: 'SSG', color: '#ce0e2d', mascot: '🚀', slogan: '인천의 자부심! SSG 랜더스!' },
    { name: 'NC 다이노스', shortName: 'NC', color: '#1e3c72', mascot: '🦕', slogan: '창원의 공룡! NC 다이노스!' },
    { name: '키움 히어로즈', shortName: '키움', color: '#570514', mascot: '🦸', slogan: '서울의 영웅! 키움 히어로즈!' },
    { name: 'KT 위즈', shortName: 'KT', color: '#222222', mascot: '🧙', slogan: '수원의 마법사! KT 위즈!' }
];

let isSpinning = false;
let currentRotation = 0;

// SVG 파이 슬라이스 경로 생성
function createSlicePath(centerX, centerY, radius, startAngle, endAngle) {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

// 텍스트 위치 계산
function getTextPosition(centerX, centerY, radius, startAngle, endAngle) {
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle - 90) * Math.PI / 180;
    const textRadius = radius * 0.65;
    
    return {
        x: centerX + textRadius * Math.cos(midRad),
        y: centerY + textRadius * Math.sin(midRad),
        angle: midAngle
    };
}

// 룰렛 휠 초기화
function initWheel() {
    const svg = document.getElementById('wheelSvg');
    const centerX = 100;
    const centerY = 100;
    const radius = 100;
    const sliceAngle = 360 / teams.length;

    // 그라데이션 정의
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    teams.forEach((team, index) => {
        // 각 팀별 그라데이션
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `gradient${index}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', team.color);
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', adjustColor(team.color, -40));
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
    });
    
    svg.appendChild(defs);

    // 슬라이스 생성
    teams.forEach((team, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;
        
        // 슬라이스 경로
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createSlicePath(centerX, centerY, radius, startAngle, endAngle));
        path.setAttribute('fill', `url(#gradient${index})`);
        path.setAttribute('stroke', '#1a1a2e');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('class', 'wheel-slice');
        svg.appendChild(path);
        
        // 텍스트 위치
        const textPos = getTextPosition(centerX, centerY, radius, startAngle, endAngle);
        
        // 텍스트
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textPos.x);
        text.setAttribute('y', textPos.y);
        text.setAttribute('class', 'slice-text');
        text.setAttribute('transform', `rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`);
        text.textContent = team.shortName;
        svg.appendChild(text);
    });

    // 외곽 장식 점들
    createWheelDots();
}

// 외곽 장식 점 생성
function createWheelDots() {
    const dotsContainer = document.getElementById('wheelDots');
    const numDots = 20;
    const containerSize = 350;
    const radius = containerSize / 2 + 5;

    for (let i = 0; i < numDots; i++) {
        const angle = (i * 360 / numDots) * Math.PI / 180;
        const dot = document.createElement('div');
        dot.className = 'wheel-dot';
        dot.style.left = (containerSize / 2 + radius * Math.cos(angle) - 4) + 'px';
        dot.style.top = (containerSize / 2 + radius * Math.sin(angle) - 4) + 'px';
        dotsContainer.appendChild(dot);
    }
}

// 팀 목록 초기화
function initTeamList() {
    const teamList = document.getElementById('teamList');
    teams.forEach(team => {
        const badge = document.createElement('div');
        badge.className = 'team-badge';
        badge.style.background = `linear-gradient(135deg, ${team.color}, ${adjustColor(team.color, -30)})`;
        badge.textContent = `${team.mascot} ${team.name}`;
        teamList.appendChild(badge);
    });
}

// 색상 조정 함수
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// 룰렛 돌리기
function spin() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('wheel');
    const resultContainer = document.getElementById('resultContainer');
    
    spinBtn.disabled = true;
    spinBtn.textContent = '...';
    resultContainer.classList.remove('show');

    // 무조건 두산 베어스 선택 (index 0)
    const randomIndex = 0;
    const sliceAngle = 360 / teams.length;
    
    // 선택된 슬라이스의 중앙이 위쪽(포인터)을 향하도록 계산
    const targetAngle = 360 - (randomIndex * sliceAngle + sliceAngle / 2);
    const spins = 5 + Math.random() * 3; // 5~8바퀴
    const totalRotation = currentRotation + (spins * 360) + targetAngle - (currentRotation % 360);
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    currentRotation = totalRotation;

    // 결과 표시
    setTimeout(() => {
        showResult(teams[randomIndex]);
        createConfetti();
        spinBtn.disabled = false;
        spinBtn.textContent = 'SPIN!';
        isSpinning = false;
    }, 4000);
}

// 결과 표시
function showResult(team) {
    const resultContainer = document.getElementById('resultContainer');
    const resultMascot = document.getElementById('resultMascot');
    const resultTeam = document.getElementById('resultTeam');
    const resultSlogan = document.getElementById('resultSlogan');

    resultMascot.textContent = team.mascot;
    resultTeam.textContent = team.name;
    resultTeam.style.color = team.color;
    resultTeam.style.textShadow = `0 0 20px ${team.color}`;
    resultSlogan.textContent = `"${team.slogan}"`;

    resultContainer.classList.add('show');
}

// 컨페티 효과
function createConfetti() {
    const colors = ['#ffd700', '#ff6b35', '#ff0844', '#00ff88', '#00d4ff', '#b24bf3'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initWheel();
    initTeamList();
});

