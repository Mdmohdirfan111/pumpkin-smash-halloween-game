// config.js - Network configuration
const SOMNIA_CONFIG = {
    chainId: '0x13A7', // 5031 in hexadecimal
    chainName: 'Somnia Mainnet',
    nativeCurrency: {
        name: 'SOMI',
        symbol: 'SOMI',
        decimals: 18
    },
    rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
    blockExplorerUrls: ['https://explorer.somnia.network/']
};

const CONTRACT_ADDRESS = "0xEEf758f0a078425F272Af7A196385EE14c3F570b";

// YAHAN ABI PASTE KARNA - [] ke beech mein
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pumpkinToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			}
		],
		"name": "LeaderboardUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokensMinted",
				"type": "uint256"
			}
		],
		"name": "ScoreSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pumpkinToken",
				"type": "address"
			}
		],
		"name": "setPumpkinToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "submitScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLeaderboard",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getPlayerStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "gamesPlayed",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerScores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastGameScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "gamesPlayed",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pumpkinToken",
		"outputs": [
			{
				"internalType": "contract IPumpkinToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];