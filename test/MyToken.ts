
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import deployContractsFixture from "./ContractsDeploymentFixture";

describe("My Token", function () {

    describe('Deployment', function () {
        it('should be deployed correctly', async function () {
            const { myToken, firstAccount, initialSupply } = await loadFixture(deployContractsFixture);
            expect(Number(await myToken.balanceOf(firstAccount)) / 10 ** 18 == initialSupply);
        });
    });

    describe('Transfer', function () {
        it('should transfer to other account and debit from owner', async function () {
            const { myToken, firstAccount, otherAccount } = await loadFixture(deployContractsFixture);


            const amountTranferred = 15;

            await myToken.transfer(otherAccount, amountTranferred);

            const ownerBalance = Number(await myToken.balanceOf(firstAccount)) / 10 ** 18;

            expect(Number(await myToken.balanceOf(otherAccount)) / 10 ** 18 == amountTranferred &&
                Number(await myToken.balanceOf(firstAccount)) / 10 ** 18 == ownerBalance - amountTranferred);
        });
    });

    describe('Estimating gas for check address', function () {

    });

});