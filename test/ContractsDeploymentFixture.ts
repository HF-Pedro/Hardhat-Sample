import hre from "hardhat";

async function deployContractsFixture() {
    const initialSupply = 50;

    const [firstAccount, otherAccount] = await hre.ethers.getSigners();

    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(initialSupply);

    const TaxContract = await hre.ethers.getContractFactory("TaxContract");
    const taxContract = await TaxContract.deploy(firstAccount, await myToken.getAddress());

    const TransactionContract = await hre.ethers.getContractFactory("TransactionContract");
    const transactionContract = await TransactionContract.deploy(await myToken.getAddress(), await taxContract.getAddress());

    return { taxContract, transactionContract, myToken, firstAccount, otherAccount, initialSupply, };
}

export default deployContractsFixture;