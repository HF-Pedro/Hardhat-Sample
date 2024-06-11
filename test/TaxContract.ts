import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import deployContractsFixture from "./ContractsDeploymentFixture";

describe('TaxContract', function () {

    describe('Deployment', function () {

        it('Should be deployed correctly', async function () {

            const { taxContract, myToken, firstAccount } = await loadFixture(deployContractsFixture);
            expect(await taxContract.myTokenAddress()).to.equal(await myToken.getAddress()) &&
                expect(await taxContract.owner()).to.equal(firstAccount);


        });



    });

    describe('View Tax Balance', function () {

        it('Should return 0 if view balance is called before an initial tax deposit', async function () {

            const { taxContract } = await loadFixture(deployContractsFixture);

            const balance = await taxContract.viewTaxAmount();

            expect(balance).to.equal(0);

        });

        it('Should return the right balance when called', async function () {
            const { transactionContract, myToken, taxContract, firstAccount } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });
            await transactionContract.withdraw(amountToWithdraw);

            expect(await taxContract.viewTaxAmount()).to.equal(hre.ethers.parseEther('0.1'));

        });

    });

    describe('Withdraw Taxes', function () {

        it('Should not be able to withdraw with insufficient funds', async function () {
            const { transactionContract, myToken, taxContract } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });
            await transactionContract.withdraw(amountToWithdraw);

            const taxAmountToWithdraw = hre.ethers.parseEther('1');

            await expect(taxContract.withdrawTaxes(taxAmountToWithdraw)).to.be.revertedWith('Insufficient funds');


        });

        it('Should be able to withdraw correctly', async function () {
            const { transactionContract, myToken, taxContract, firstAccount } = await loadFixture(deployContractsFixture);

            const amountTranferred = hre.ethers.parseEther('2');

            const amountToWithdraw = hre.ethers.parseEther('1');

            await myToken.approve(await transactionContract.getAddress(), amountTranferred);

            await transactionContract.deposit({ value: amountTranferred });
            await transactionContract.withdraw(amountToWithdraw);

            const taxAmountToWithdraw = hre.ethers.parseEther('0.05');

            const initialBalanceInTaxContract = await taxContract.viewTaxAmount();

            const ownerBalanceBeforeWithdrawlTaxes = await myToken.balanceOf(firstAccount);

            await taxContract.withdrawTaxes(taxAmountToWithdraw);

            expect(await myToken.balanceOf(firstAccount)).to.equal(ownerBalanceBeforeWithdrawlTaxes + taxAmountToWithdraw) &&
                expect(await taxContract.viewTaxAmount()).to.equal(initialBalanceInTaxContract - taxAmountToWithdraw);


        });

    });
});