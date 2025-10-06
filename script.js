const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.3;  // Set volume to 30%

// Try to play automatically
window.addEventListener('load', () => {
    bgMusic.play().catch(() => {
        // If autoplay fails, play on first user interaction
        document.body.addEventListener('click', () => {
            bgMusic.play();
        }, { once: true });
    });
});

const messages = [
    {
        text: "There some secrets I wanna tell",
        image: "https://files.catbox.moe/1wavsk.jpeg"
    },
    {
        text: "really want to know..?",
        image: "https://files.catbox.moe/ey2zom.jpeg"
    }
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

// Update interval for smoother animation
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

    // Ensure button is in document body, not in container
    if (noButton.parentElement !== document.body) {
        document.body.appendChild(noButton);
    }

    // Get container boundaries
    const containerRect = container.getBoundingClientRect();
    const safeDistance = isMobile ? 80 : 120; // Minimum distance from container

    // Get current position or use initial position
    const currentX = parseInt(noButton.style.left) || containerRect.right + safeDistance;
    const currentY = parseInt(noButton.style.top) || containerRect.top;

    // Calculate new position
    let newX, newY;

    // If button is near container, move it far away
    if (isNearContainer(currentX, currentY, containerRect, safeDistance)) {
        const farPosition = getFarPosition(containerRect, windowWidth, windowHeight, buttonWidth, buttonHeight, safeDistance);
        newX = farPosition.x;
        newY = farPosition.y;
    } else {
        // Normal evasion movement
        newX = currentX + (Math.random() - 0.5) * (isMobile ? 150 : 300);
        newY = currentY + (Math.random() - 0.5) * (isMobile ? 150 : 300);
    }

    // Keep in viewport bounds
    const padding = isMobile ? 20 : 40;
    newX = Math.max(padding, Math.min(windowWidth - buttonWidth - padding, newX));
    newY = Math.max(padding, Math.min(windowHeight - buttonHeight - padding, newY));

    // Apply position with smooth animation
    noButton.style.position = 'fixed';
    noButton.style.transition = `all ${isMobile ? '0.8s' : '0.6s'} cubic-bezier(0.34, 1.56, 0.64, 1)`;
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.zIndex = '9999';
}

// Add these helper functions
function isNearContainer(x, y, containerRect, safeDistance) {
    return x >= containerRect.left - safeDistance &&
           x <= containerRect.right + safeDistance &&
           y >= containerRect.top - safeDistance &&
           y <= containerRect.bottom + safeDistance;
}

function getFarPosition(containerRect, windowWidth, windowHeight, buttonWidth, buttonHeight, safeDistance) {
    // Choose a random side away from container
    const positions = [
        { // Left side
            x: Math.max(20, containerRect.left - buttonWidth - safeDistance),
            y: Math.random() * (windowHeight - buttonHeight - 40) + 20
        },
        { // Right side
            x: Math.min(windowWidth - buttonWidth - 20, containerRect.right + safeDistance),
            y: Math.random() * (windowHeight - buttonHeight - 40) + 20
        },
        { // Top side
            x: Math.random() * (windowWidth - buttonWidth - 40) + 20,
            y: Math.max(20, containerRect.top - buttonHeight - safeDistance)
        },
        { // Bottom side
            x: Math.random() * (windowWidth - buttonWidth - 40) + 20,
            y: Math.min(windowHeight - buttonHeight - 20, containerRect.bottom + safeDistance)
        }
    ];

    // Return random position from available positions
    return positions[Math.floor(Math.random() * positions.length)];
}



yesBtn.addEventListener('click', () => {
    if (noCount === 0) {
        // Klik pertama: mulai cerita
        noCount++;
        title.innerHTML = messages[0].text;
        document.querySelector('img').src = messages[0].image;
        yesBtn.innerHTML = "YES";
        noBtn.style.display = 'none'; // sembunyiin no button
    } else {
        // Klik kedua (terima)
        title.textContent = "I LOVE YOUUU!";

        // Hapus gambar lama biar gak numpuk
        const oldImg = document.querySelector('.container img');
        if (oldImg) oldImg.remove();

        // Tambah gambar baru DI BAWAH teks
        const newImg = document.createElement('img');
        newImg.src = "https://files.catbox.moe/f3ljno.jpeg";
        newImg.alt = "happy";
        newImg.style.maxWidth = "250px";
        newImg.style.marginTop = "15px";
        newImg.style.borderRadius = "10px";
        newImg.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        newImg.style.animation = "fadeIn 1s ease";

        // Masukin gambar ke container
        title.insertAdjacentElement('afterend', newImg);

        // Hapus tombol
        noBtn.remove();
        yesBtn.remove();

        // Efek hati
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createHeart(), Math.random() * 1000);
        }
    }
});
noBtn.addEventListener('click', () => {
    if (noCount < 3) {
        noCount++;
        title.innerHTML = messages[noCount - 1].text;
        document.querySelector('img').src = messages[noCount - 1].image;

        if (messages[noCount - 1].text === "really want to know..?") {
            const buttons = document.querySelector('.buttons');
            const yesBtn = document.querySelector('.yes-btn');
            const noBtn = document.querySelector('.no-btn');

            buttons.insertBefore(yesBtn, noBtn);
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

// Make button run away on hover/touch
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












