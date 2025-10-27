// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PumpkinToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    address public gameContract;

    constructor() ERC20("Pumpkin Token", "PUMPKIN") Ownable(msg.sender) {
        _mint(msg.sender, 500000 * 10**18); // Initial supply for rewards
    }

    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }

    function mintTokens(address player, uint256 amount) external {
        require(msg.sender == gameContract, "Only game contract can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(player, amount);
    }
}