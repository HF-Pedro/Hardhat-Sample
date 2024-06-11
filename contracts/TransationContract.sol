// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransactionContract{

    uint256 public percentualTax = 10;

    address public myTokenAddress;

    address public taxContractAddress;

    event Withdrawl(uint256 amount, uint256 tax);

    mapping(address => uint) public accountToAmountDepositated;

    constructor(address _myTokenAddress, address _taxContractAddress){
        myTokenAddress = _myTokenAddress;
        taxContractAddress = _taxContractAddress;

    }

    function deposit() public payable {

        bool operationResult = IERC20(myTokenAddress).transferFrom(msg.sender, address(this), msg.value);

        require(operationResult, 'Operation reverted with a transfer error');

        accountToAmountDepositated[msg.sender] += msg.value;


    }

    function viewBalance() public view returns(uint256){
        return accountToAmountDepositated[msg.sender];
    }

    function withdraw(uint256 _amount) public {

        require(accountToAmountDepositated[msg.sender] >= _amount, 'Insufficient funds to complete the operation');

        uint256 ammountWithTaxDiscount = _amount * 90 / 100;

        uint256 tax = _amount * 10 / 100;

        bool withdrawResult = IERC20(myTokenAddress).transfer(msg.sender, ammountWithTaxDiscount);

        bool taxResult = IERC20(myTokenAddress).transfer(taxContractAddress, tax);

        require(withdrawResult && taxResult, 'Operation reverted with a transfer error');

        accountToAmountDepositated[msg.sender] -= _amount;

        emit Withdrawl(ammountWithTaxDiscount, tax);


    }

     fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }


}