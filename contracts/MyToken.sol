
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is Ownable, ERC20, ERC20Permit {

    error InvalidAddress(string message);
    
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") ERC20Permit("MyToken") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** 18));
    }

    function mint(address recipient, uint256 value) external onlyOwner{
        _checkAddress(recipient);
        _mint(recipient, value);
    }

    function _checkAddress(address recipient) public pure{
        require(recipient == address(0), "No zero address allowed" );
        // substituir por if e custom error
        // substituir por require com custom error
        // elencar da mais barata a mais cara, trazer o custo de transação de cada uma
    }
    
}