class ContractHandler {
    constructor() {}

    async submitScore(score) {
        if (!wallet.isConnected()) throw new Error("Wallet not connected");
        if (score > 100) throw new Error("Score too high!");

        const contract = wallet.getContract();
        const userAddress = wallet.getUserAddress();

        const btn = document.getElementById('submitScore');
        btn.classList.add('loading');
        btn.textContent = 'Submitting...';

        try {
            await contract.methods.submitScore(score).send({ from: userAddress });
            await this.loadLeaderboard();
            await this.loadPlayerStats();
            alert("Score submitted! Tokens minted.");
        } catch (error) {
            alert("Failed: " + (error.message || "Transaction failed"));
        } finally {
            btn.classList.remove('loading');
            btn.textContent = 'Submit Score';
        }
    }

    async loadLeaderboard() {
        if (!wallet.isConnected()) return;
        const contract = wallet.getContract();
        if (!contract) return;

        try {
            const result = await contract.methods.getLeaderboard().call();
            const addresses = Array.isArray(result[0]) ? result[0] : [];
            const scores = Array.isArray(result[1]) ? result[1] : [];
            this.updateLeaderboardUI(addresses, scores);
        } catch (e) {
            console.error(e);
            this.updateLeaderboardUI([], []);
        }
    }

    updateLeaderboardUI(addresses, scores) {
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';
        if (addresses.length === 0) {
            list.innerHTML = '<div class="leaderboard-item"><span>No players yet</span></div>';
            return;
        }
        addresses.forEach((addr, i) => {
            const short = addr.slice(0,6) + '...' + addr.slice(-4);
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `<span>#${i+1} ${short}</span><span>${scores[i]} PUMPKIN</span>`;
            list.appendChild(item);
        });
    }

    async loadPlayerStats() {
        if (!wallet.isConnected()) return;
        const contract = wallet.getContract();
        if (!contract) return;

        const user = wallet.getUserAddress();
        try {
            const result = await contract.methods.getPlayerStats(user).call();
            const [total] = result || [0, 0, 0];
            document.getElementById('tokens').textContent = `PUMPKIN Tokens: ${total}`;
        } catch (e) {
            console.error(e);
            document.getElementById('tokens').textContent = `PUMPKIN Tokens: 0`;
        }
    }
}

let contractHandler = new ContractHandler();
