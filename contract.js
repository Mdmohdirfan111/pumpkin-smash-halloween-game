// contract.js - Contract interactions
class ContractHandler {
    constructor() {}

    async submitScore(score) {
        if (!wallet.isConnected()) {
            throw new Error("Wallet not connected");
        }
        if (score > 100) { // Basic anti-cheat: cap score per game
            throw new Error("Score too high! Possible cheat detected.");
        }

        const contract = wallet.getContract();
        const userAddress = wallet.getUserAddress();

        // Show loading
        document.getElementById('submitScore').classList.add('loading');
        document.getElementById('submitScore').textContent = 'Submitting...';

        try {
            const tx = await contract.methods.submitScore(score).send({
                from: userAddress
            });
            // Refresh data after tx
            await this.loadLeaderboard();
            await this.loadPlayerStats();
            return tx;
        } catch (error) {
            throw error;
        } finally {
            // Reset button
            document.getElementById('submitScore').classList.remove('loading');
            document.getElementById('submitScore').textContent = 'Submit Score';
        }
    }

    async loadLeaderboard() {
        if (!wallet.isConnected()) return [];

        const contract = wallet.getContract();
        try {
            const [addresses, scores] = await contract.methods.getLeaderboard().call();
            this.updateLeaderboardUI(addresses, scores);
            return { addresses, scores };
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
            this.updateLeaderboardUI([], []);
        }
    }

    updateLeaderboardUI(addresses, scores) {
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';
        if (addresses.length === 0) {
            list.innerHTML = '<div class="leaderboard-item"><span>No data available</span></div>';
            return;
        }
        addresses.forEach((addr, i) => {
            const shortAddr = addr.substring(0, 6) + '...' + addr.substring(38);
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `<span>#${i+1} ${shortAddr}</span><span>${scores[i]} PUMPKIN</span>`;
            list.appendChild(item);
        });
    }

    async loadPlayerStats() {
        if (!wallet.isConnected()) return null;

        const contract = wallet.getContract();
        const userAddress = wallet.getUserAddress();
        try {
            const [totalTokens, lastScore, gamesPlayed] = await contract.methods.getPlayerStats(userAddress).call();
            this.updatePlayerStatsUI(totalTokens, lastScore, gamesPlayed);
            return { totalTokens, lastScore, gamesPlayed };
        } catch (error) {
            console.error("Failed to load player stats:", error);
            this.updatePlayerStatsUI(0, 0, 0);
        }
    }

    updatePlayerStatsUI(totalTokens, lastScore, gamesPlayed) {
        document.getElementById('tokens').textContent = `PUMPKIN Tokens: ${totalTokens}`;
        // Can add more UI if needed
    }
}

// Global contract handler
let contractHandler = new ContractHandler();
