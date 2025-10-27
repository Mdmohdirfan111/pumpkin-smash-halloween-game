// game.js - Game logic
class PumpkinGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
        this.timer = null;
        this.pumpkins = [];
        this.pumpkinPool = []; // For performance: reuse pumpkins
        this.combo = 1;
        this.lastSmashTime = 0;
        this.comboTimeout = null;
        this.gameArea = document.getElementById('gameArea');
        this.smashSound = document.getElementById('smashSound');
        this.comboSound = document.getElementById('comboSound');
        this.gameOverSound = document.getElementById('gameOverSound');
        this.modal = document.getElementById('gameOverModal');
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Pre-create pumpkin pool
        for (let i = 0; i < 20; i++) { // Pool size
            const pumpkin = this.createPumpkinElement();
            this.pumpkinPool.push(pumpkin);
        }
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('submitScore').addEventListener('click', () => this.submitScore());
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        // Touch support
        this.gameArea.addEventListener('touchstart', (e) => this.handleTouch(e));
    }

    startGame() {
        if (!wallet.isConnected()) {
            alert("Please connect your wallet first!");
            return;
        }

        this.resetGame();
        this.gameActive = true;
        document.getElementById('startGame').disabled = true;
        document.getElementById('submitScore').disabled = true;
        
        this.startTimer();
        this.generatePumpkins();
        this.updateLoop();
    }

    resetGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.combo = 1;
        this.pumpkins = [];
        this.gameArea.innerHTML = '';
        this.updateScoreUI();
        this.updateTimerUI();
        this.updateComboUI();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    generatePumpkins() {
        if (!this.gameActive) return;

        const interval = Math.max(500, 2000 - this.score * 10); // Faster as score increases
        setTimeout(() => this.generatePumpkins(), interval);

        const pumpkin = this.getPooledPumpkin();
        if (!pumpkin) return;

        const x = Math.random() * (this.gameArea.offsetWidth - 80);
        pumpkin.style.left = `${x}px`;
        pumpkin.style.top = `-80px`;
        pumpkin.style.display = 'block';
        pumpkin.classList.add('falling');
        pumpkin.style.animationDuration = `${Math.random() * 2 + 3}s`; // Variable fall speed 3-5s

        pumpkin.onclick = () => this.smashPumpkin(pumpkin);
        this.gameArea.appendChild(pumpkin);
        this.pumpkins.push(pumpkin);
    }

    createPumpkinElement() {
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';
        return pumpkin;
    }

    getPooledPumpkin() {
        return this.pumpkinPool.find(p => !p.parentElement) || this.createPumpkinElement();
    }

    smashPumpkin(pumpkin) {
        if (!this.gameActive) return;

        const now = Date.now();
        if (now - this.lastSmashTime < 500) { // Combo if within 0.5s
            this.combo++;
            this.comboSound.play();
        } else {
            this.combo = 1;
        }
        this.lastSmashTime = now;
        clearTimeout(this.comboTimeout);
        this.comboTimeout = setTimeout(() => this.combo = 1, 500);

        const points = 1 * this.combo;
        this.score += points;
        this.updateScoreUI();
        this.updateComboUI();

        pumpkin.classList.add('smash');
        pumpkin.onclick = null;
        this.smashSound.play();

        // Particles
        this.createParticles(pumpkin.style.left, pumpkin.style.top);

        setTimeout(() => {
            pumpkin.style.display = 'none';
            pumpkin.classList.remove('smash', 'falling');
            this.removePumpkin(pumpkin);
        }, 300);
    }

    createParticles(x, y) {
        const particles = document.createElement('div');
        particles.className = 'particles';
        particles.style.left = x;
        particles.style.top = y;
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--dx', `${Math.random() * 100 - 50}px`);
            particle.style.setProperty('--dy', `${Math.random() * 100 - 50}px`);
            particles.appendChild(particle);
        }
        this.gameArea.appendChild(particles);
        setTimeout(() => particles.remove(), 500);
    }

    handleTouch(e) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('pumpkin')) {
            this.smashPumpkin(target);
        }
    }

    updateLoop() {
        if (!this.gameActive) return;

        this.pumpkins.forEach(pumpkin => {
            if (parseInt(pumpkin.style.top) > this.gameArea.offsetHeight) {
                this.missPumpkin(pumpkin);
            }
        });
        requestAnimationFrame(() => this.updateLoop());
    }

    missPumpkin(pumpkin) {
        this.score = Math.max(0, this.score - 1); // Penalty
        this.updateScoreUI();
        pumpkin.style.display = 'none';
        pumpkin.classList.remove('falling');
        this.removePumpkin(pumpkin);
    }

    removePumpkin(pumpkin) {
        this.pumpkins = this.pumpkins.filter(p => p !== pumpkin);
    }

    endGame() {
        clearInterval(this.timer);
        this.gameActive = false;
        this.pumpkins.forEach(p => {
            p.onclick = null;
            p.remove();
        });
        this.pumpkins = [];
        document.getElementById('submitScore').disabled = false;
        this.gameOverSound.play();
        this.showModal();
    }

    showModal() {
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('tokensEarned').textContent = `Tokens Earned: ${this.score}`;
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async submitScore() {
        try {
            await contractHandler.submitScore(this.score);
            alert("Score submitted successfully! Tokens minted.");
            document.getElementById('startGame').disabled = false;
        } catch (error) {
            alert("Failed to submit score: " + (error.message || "Transaction failed"));
        }
    }

    updateScoreUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    updateTimerUI() {
        document.getElementById('timer').textContent = `Time: ${this.timeLeft}s`;
    }

    updateComboUI() {
        document.getElementById('combo').textContent = `Combo: x${this.combo}`;
    }
}

// Initialize game
window.addEventListener('load', () => {
    new PumpkinGame();
});
