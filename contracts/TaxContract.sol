// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TaxContract{

    address public owner;
    address public myTokenAddress;

    constructor(address _owner, address _myTokenAddress){
        owner = _owner;
        myTokenAddress = _myTokenAddress;
    }

    function viewTaxAmount() public view returns(uint256){
        return IERC20(myTokenAddress).balanceOf(address(this));

    }

    function withdrawTaxes(uint256 ammount) public{
        require(msg.sender == owner, 'Should be the owner to make withdraws');

        require(viewTaxAmount() >= ammount, 'Insufficient funds');
        
        IERC20(myTokenAddress).transfer(owner, ammount);
    }
}