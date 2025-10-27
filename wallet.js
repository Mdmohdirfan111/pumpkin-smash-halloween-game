// wallet.js - Wallet connection and network switch
class WalletConnection {
    constructor() {
        this.web3 = null;
        this.userAddress = null;
        this.contract = null;
        this.init();
    }

    async init() {
        await this.setupEventListeners();
    }

    async setupEventListeners() {
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        // Handle account/network changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => location.reload());
            window.ethereum.on('chainChanged', () => location.reload());
        }
    }

    async connectWallet() {
        if (window.ethereum) {
            try {
                // Switch to Somnia Network
                await this.switchToSomniaNetwork();
                
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.web3 = new Web3(window.ethereum);
                
                // Get accounts
                const accounts = await this.web3.eth.getAccounts();
                this.userAddress = accounts[0];
                
                // Update UI
                this.updateWalletUI();
                
                // Initialize contract
                await this.initContract();
                
                // Load leaderboard and player stats
                await this.loadInitialData();
                
                console.log("Wallet connected successfully!");
                
            } catch (error) {
                console.error("Wallet connection failed:", error);
                alert("Wallet connection failed: " + (error.message || "Unknown error"));
            }
        } else {
            alert("Please install MetaMask!");
        }
    }

    async switchToSomniaNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: SOMNIA_CONFIG.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [SOMNIA_CONFIG],
                    });
                } catch (addError) {
                    throw new Error("Failed to add Somnia network to MetaMask: " + addError.message);
                }
            } else {
                throw new Error("Failed to switch to Somnia network: " + switchError.message);
            }
        }
    }

    updateWalletUI() {
        document.getElementById('walletAddress').textContent = 
            this.userAddress.substring(0, 6) + '...' + this.userAddress.substring(38);
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('startGame').disabled = false;
    }

    async initContract() {
        if (this.web3 && CONTRACT_ABI.length > 0) {
            this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        }
    }

    async loadInitialData() {
        await contractHandler.loadLeaderboard();
        await contractHandler.loadPlayerStats();
    }

    // Getter methods
    getWeb3() {
        return this.web3;
    }

    getUserAddress() {
        return this.userAddress;
    }

    getContract() {
        return this.contract;
    }

    isConnected() {
        return this.userAddress !== null;
    }
}

// Global wallet instance
let wallet = new WalletConnection();
