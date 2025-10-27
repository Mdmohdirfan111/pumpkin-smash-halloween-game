// game.js - Only game logic
class PumpkinGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
        this.timer = null;
        this.pumpkins = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('submitScore').addEventListener('click', () => this.submitScore());
    }

    startGame() {
        if (!this.isWalletConnected()) {
            alert("Please connect your wallet first!");
            return;
        }

        this.resetGame();
        this.gameActive = true;
        document.getElementById('startGame').disabled = true;
        document.getElementById('submitScore').disabled = true;
        
        this.startTimer();
        this.generatePumpkins();
    }

    resetGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.pumpkins = [];
        
        // Clear game area
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = '';
        gameArea.style.cursor = 'crosshair';
        
        // Update UI
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('timer').textContent = 'Time: 60s';
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = `Time: ${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    generatePumpkins() {
        if (!this.gameActive) return;

        const gameArea = document.getElementById('gameArea');
        
        // Create pumpkin element
        const pumpkin = document.createElement('div');
        pumpkin.className = 'pumpkin';
        pumpkin.innerHTML = '🎃'; // Temporary emoji - later replace with images
        
        // Random position
        const maxX = gameArea.offsetWidth - 50;
        const maxY = gameArea.offsetHeight - 50;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        pumpkin.style.left = randomX + 'px';
        pumpkin.style.top = randomY + 'px';
        pumpkin.style.position = 'absolute';
        pumpkin.style.fontSize = '40px';
        pumpkin.style.cursor = 'pointer';
        pumpkin.style.userSelect = 'none';
        
        // Click event
        pumpkin.addEventListener('click', () => this.smashPumpkin(pumpkin));
        
        gameArea.appendChild(pumpkin);
        this.pumpkins.push(pumpkin);
        
        // Remove pumpkin after 2 seconds
        setTimeout(() => {
            if (pumpkin.parentNode && this.gameActive) {
                pumpkin.remove();
                const index = this.pumpkins.indexOf(pumpkin);
                if (index > -1) {
                    this.pumpkins.splice(index, 1);
                }
            }
        }, 2000);
        
        // Generate next pumpkin
        if (this.gameActive) {
            const nextPumpkinTime = 500 + Math.random() * 1000;
            setTimeout(() => this.generatePumpkins(), nextPumpkinTime);
        }
    }

    smashPumpkin(pumpkin) {
        if (!this.gameActive) return;

        this.score++;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        
        // Smash effect
        pumpkin.style.transform = 'scale(0.5)';
        pumpkin.style.opacity = '0.5';
        pumpkin.innerHTML = '💥'; // Explosion effect
        
        // Remove after animation
        setTimeout(() => {
            if (pumpkin.parentNode) {
                pumpkin.remove();
                const index = this.pumpkins.indexOf(pumpkin);
                if (index > -1) {
                    this.pumpkins.splice(index, 1);
                }
            }
        }, 300);
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        // Clear all pumpkins
        this.pumpkins.forEach(pumpkin => {
            if (pumpkin.parentNode) {
                pumpkin.remove();
            }
        });
        this.pumpkins = [];
        
        // Enable buttons
        document.getElementById('startGame').disabled = false;
        document.getElementById('submitScore').disabled = false;
        
        // Show game over message
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = `<div style="text-align: center; padding-top: 50px;">
            <h2 style="color: #ff6b35;">Game Over!</h2>
            <p>Your Score: ${this.score}</p>
            <p>Click "Submit Score" to earn ${this.score} PUMPKIN tokens!</p>
        </div>`;
        
        alert(`Game Over! Your score: ${this.score}`);
    }

    async submitScore() {
        if (this.score === 0) {
            alert("Please play the game first!");
            return;
        }

        // For now, just show success message
        alert(`Score submitted! You earned ${this.score} PUMPKIN tokens!`);
        
        // Reset for next game
        this.resetGame();
        document.getElementById('gameArea').innerHTML = '<p style="color: lightgreen; text-align: center; padding-top: 50px;">Ready for next game! Click Start Game</p>';
    }

    isWalletConnected() {
        return document.getElementById('connectWallet').style.display === 'none';
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new PumpkinGame();
});
