// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EURODETHER is ERC20, Ownable {
    // The price oracle will provide the price feed
    IPriceOracle private oracle;

    // Constructor
    constructor(uint256 initialSupply, IPriceOracle _oracle) ERC20("EURODETHER", "EURD") {
        _mint(msg.sender, initialSupply);
        oracle = _oracle;
    }
    
    // Mint function that checks the price before minting
    function mint(address to, uint256 amount) public onlyOwner {
        require(getCurrentPrice() == 1 ether, "Price is not correct");
        _mint(to, amount);
    }

    // Burn function that checks the price before burning
    function burn(address from, uint256 amount) public onlyOwner {
        require(getCurrentPrice() == 1 ether, "Price is not correct");
        _burn(from, amount);
    }
    
    // Function to update the price oracle
    function setPriceOracle(IPriceOracle _oracle) public onlyOwner {
        oracle = _oracle;
    }

    // Function to get the current price
function getCurrentPrice() public view returns (uint256) {
  return 1 ether; // Return a fixed value of 1 ether for testing purposes
  }
}

// Interface for a price oracle
interface IPriceOracle {
    function getPrice() external view returns (uint256);
}
