
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import deployContractsFixture from "./ContractsDeploymentFixture";

describe('TransactionContract', function () {

    describe('Deployment', function () {
        it('should be deployed correctly', async function () {
            const { transactionContract, myToken } = await loadFixture(deployContractsFixture);
            expect(await transactionContract.myTokenAddress()).to.equal(await myToken.getAddress());
        });
    });

    describe('Deposit', function () {
        it('should deposit correctly', async function () {
            const { transactionContract, myToken, firstAccount } = await loadFixture(deployContractsFixture);

            const initialOwnerBalance = await myToken.balanceOf(firstAccount);
            const amountTranferred = '2';

            await myToken.approve(await transactionContract.getAddress(), hre.ethers.parseEther(amountTranferred));
            await transactionContract.deposit({ value: hre.ethers.parseEther(amountTranferred) });

            expect(await transactionContract.viewBalance()).to.equal(hre.ethers.parseEther(amountTranferred)) &&
                expect(await myToken.balanceOf(firstAccount)).to.equal(initialOwnerBalance - hre.ethers.parseEther(amountTranferred));


        });

        it('should update user balance in two operations', async function () {

            const { transactionContract, myToken } = await loadFixture(deployContractsFixture);

            const totalAmountTranferred = '2';

            await myToken.approve(await transactionContract.getAddress(), hre.ethers.parseEther(totalAmountTranferred));
            await transactionContract.deposit({ value: hre.ethers.parseEther('1.25') });
            await transactionContract.deposit({ value: hre.ethers.parseEther('0.75') });

            expect(await transactionContract.viewBalance()).to.equal(hre.ethers.parseEther(totalAmountTranferred));
        });
    });

    describe('View Balance', function () {

        it('should return 0 if view balance is called before an initial deposit', async function () {

            const { transactionContract } = await loadFixture(deployContractsFixture);

            const balance = await transactionContract.viewBalance();

            expect(balance).to.equal(0);

        });
    });

    describe('Withdraw', function () {
        it('should not withdraw with insufficiente funds', async function () {

            const { transactionContract } = await loadFixture(deployContractsFixture);

            const balance = transactionContract.withdraw(hre.ethers.parseEther('1'));

            await expect(balance).to.be.revertedWith('Insufficient funds to complete the operation');

        });

        it('should withdraw correctly with event', async function () {

            const { transactionContract, myToken } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            const realWithdrawAmount = hre.ethers.parseEther('0.9');

            const taxToWithdraw = hre.ethers.parseEther('0.1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });

            await expect(transactionContract.withdraw(amountToWithdraw)).to.emit
                (transactionContract, 'Withdrawl').withArgs(realWithdrawAmount, taxToWithdraw);

        });

        it('Should update user balance after withdraw', async function () {
            const { transactionContract, myToken } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            const amountAfterWithdraw = hre.ethers.parseEther('1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });
            await transactionContract.withdraw(amountToWithdraw);

            expect(await transactionContract.viewBalance()).to.equal(amountAfterWithdraw);

        });

        it('Should send tax to TaxContract', async function () {

            const { transactionContract, myToken, taxContract } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            const tax = hre.ethers.parseEther('0.1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });

            await transactionContract.withdraw(amountToWithdraw);

            const taxContractBalance = await myToken.balanceOf(taxContract.getAddress());

            expect(taxContractBalance).to.equal(tax);

        });

    });

});
