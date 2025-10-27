// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPumpkinToken {
    function mintTokens(address player, uint256 amount) external;
}

contract GameReward is Ownable {
    IPumpkinToken public pumpkinToken;
    
    struct PlayerScore {
        uint256 totalTokens;
        uint256 lastGameScore;
        uint256 gamesPlayed;
    }
    
    mapping(address => PlayerScore) public playerScores;
    address[] public players;
    
    event ScoreSubmitted(address indexed player, uint256 score, uint256 tokensMinted);
    event LeaderboardUpdated(address indexed player, uint256 totalTokens);

    constructor(address _pumpkinToken) Ownable(msg.sender) {
        pumpkinToken = IPumpkinToken(_pumpkinToken);
    }

    function submitScore(uint256 score) external {
        require(score > 0, "Score must be positive");
        
        // Mint tokens: 1 point = 1 PUMPKIN token
        pumpkinToken.mintTokens(msg.sender, score);
        
        // Update player data
        if (playerScores[msg.sender].totalTokens == 0) {
            players.push(msg.sender);
        }
        
        playerScores[msg.sender].totalTokens += score;
        playerScores[msg.sender].lastGameScore = score;
        playerScores[msg.sender].gamesPlayed += 1;
        
        emit ScoreSubmitted(msg.sender, score, score);
        emit LeaderboardUpdated(msg.sender, playerScores[msg.sender].totalTokens);
    }

    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 length = players.length < 10 ? players.length : 10;
        address[] memory topPlayers = new address[](length);
        uint256[] memory topScores = new uint256[](length);
        
        // Simple leaderboard - for production use sorting
        for (uint256 i = 0; i < length; i++) {
            topPlayers[i] = players[i];
            topScores[i] = playerScores[players[i]].totalTokens;
        }
        
        return (topPlayers, topScores);
    }

    function getPlayerStats(address player) external view returns (uint256 totalTokens, uint256 lastScore, uint256 gamesPlayed) {
        PlayerScore memory stats = playerScores[player];
        return (stats.totalTokens, stats.lastGameScore, stats.gamesPlayed);
    }

    function setPumpkinToken(address _pumpkinToken) external onlyOwner {
        pumpkinToken = IPumpkinToken(_pumpkinToken);
    }
}