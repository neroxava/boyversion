const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.3;

// Try to play automatically
window.addEventListener('load', () => {
    bgMusic.play().catch(() => {
        document.body.addEventListener('click', () => bgMusic.play(), { once: true });
    });
});

const messages = [
    { text: "There some secrets I wanna tell", image: "https://files.catbox.moe/1wavsk.jpeg" },
    { text: "really want to know..?", image: "https://files.catbox.moe/ey2zom.jpeg" }
];

function createHeart() {
    const hearts = ['❤', '🌸', '💗', '💝', '💖'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 10 + 15 + 'px';
    heart.style.opacity = Math.random() * 0.4 + 0.6;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(() => createHeart(), 400);

const title = document.querySelector('.title');
const noBtn = document.querySelector('.no-btn');
const yesBtn = document.querySelector('.yes-btn');
let noCount = 0;

function runAway(e) {
    const noButton = e.target;
    const container = document.querySelector('.container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;
    const isMobile = window.innerWidth <= 768;

    if (noButton.parentElement !== document.body) {
        document.body.appendChild(noButton);
    }

    const containerRect = container.getBoundingClientRect();
    const safeDistance = isMobile ? 80 : 120;

    const currentX = parseInt(noButton.style.left) || containerRect.right + safeDistance;
    const currentY = parseInt(noButton.style.top) || containerRect.top;

    let newX, newY;
    if (isNearContainer(currentX, currentY, containerRect, safeDistance)) {
        const farPosition = getFarPosition(containerRect, windowWidth, windowHeight, buttonWidth, buttonHeight, safeDistance);
        newX = farPosition.x;
        newY = farPosition.y;
    } else {
        newX = currentX + (Math.random() - 0.5) * (isMobile ? 150 : 300);
        newY = currentY + (Math.random() - 0.5) * (isMobile ? 150 : 300);
    }

    const padding = isMobile ? 20 : 40;
    newX = Math.max(padding, Math.min(windowWidth - buttonWidth - padding, newX));
    newY = Math.max(padding, Math.min(windowHeight - buttonHeight - padding, newY));

    noButton.style.position = 'fixed';
    noButton.style.transition = `all ${isMobile ? '0.8s' : '0.6s'} cubic-bezier(0.34, 1.56, 0.64, 1)`;
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.zIndex = '9999';
}

function isNearContainer(x, y, rect, d) {
    return x >= rect.left - d && x <= rect.right + d && y >= rect.top - d && y <= rect.bottom + d;
}
function getFarPosition(rect, w, h, bw, bh, d) {
    const pos = [
        { x: Math.max(20, rect.left - bw - d), y: Math.random() * (h - bh - 40) + 20 },
        { x: Math.min(w - bw - 20, rect.right + d), y: Math.random() * (h - bh - 40) + 20 },
        { x: Math.random() * (w - bw - 40) + 20, y: Math.max(20, rect.top - bh - d) },
        { x: Math.random() * (w - bw - 40) + 20, y: Math.min(h - bh - 20, rect.bottom + d) }
    ];
    return pos[Math.floor(Math.random() * pos.length)];
}

// === MAIN INTERACTIONS ===

yesBtn.addEventListener('click', () => {
    if (noCount === 0) {
        noCount++;
        title.innerHTML = messages[0].text;
        document.querySelector('img').src = messages[0].image;
        yesBtn.innerHTML = "YES";
        noBtn.style.display = 'none';
    } else {
        title.textContent = "I LOVE YOUUU!";

        const oldImg = document.querySelector('.container img');
        if (oldImg) oldImg.remove();

        const newImg = document.createElement('img');
        newImg.src = "https://files.catbox.moe/f3ljno.jpeg";
        newImg.alt = "happy";
        newImg.style.maxWidth = "250px";
        newImg.style.marginTop = "15px";
        newImg.style.borderRadius = "10px";
        newImg.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        newImg.style.animation = "fadeIn 1s ease";
        title.insertAdjacentElement('afterend', newImg);

        noBtn.remove();
        yesBtn.remove();

        for (let i = 0; i < 50; i++) setTimeout(() => createHeart(), Math.random() * 1000);
    }
});

noBtn.addEventListener('click', () => {
    if (noCount < 3) {
        noCount++;
        title.innerHTML = messages[noCount - 1].text;
        document.querySelector('img').src = messages[noCount - 1].image;

        // ✅ Fix: Tukar posisi tombol pas "really want to know..?"
        if (messages[noCount - 1].text === "really want to know..?") {
            const yesBtn = document.querySelector('.yes-btn');
            const noBtn = document.querySelector('.no-btn');

            // Ambil posisi aktual
            const yesRect = yesBtn.getBoundingClientRect();
            const noRect = noBtn.getBoundingClientRect();

            yesBtn.style.position = 'fixed';
            noBtn.style.position = 'fixed';
            yesBtn.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            noBtn.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // Tukar posisi
            yesBtn.style.left = `${noRect.left}px`;
            yesBtn.style.top = `${noRect.top}px`;
            noBtn.style.left = `${yesRect.left}px`;
            noBtn.style.top = `${yesRect.top}px`;

            yesBtn.style.zIndex = '9999';
            noBtn.style.zIndex = '9999';
        }

    } else {
        title.innerHTML = "it's not that easy🥀";
        if (!noBtn.classList.contains('running')) {
            noBtn.classList.add('running');
        }
        runAway({
            target: noBtn,
            type: 'click',
            clientX: event.clientX || event.touches?.[0]?.clientX,
            clientY: event.clientY || event.touches?.[0]?.clientY
        });
    }
});

const handleButtonDodge = (e) => {
    if (noCount >= 3) {
        e.preventDefault();
        e.stopPropagation();
        runAway(e);
    }
};
noBtn.addEventListener('mouseover', handleButtonDodge);
noBtn.addEventListener('touchstart', handleButtonDodge, { passive: false });
noBtn.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });









