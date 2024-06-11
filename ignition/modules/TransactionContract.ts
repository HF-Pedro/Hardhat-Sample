import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TransactionContractModule = buildModule("TransactionContractModule", (m) => {

    const transactionContract = m.contract("TransactionContract");

    return { transactionContract };
});

export default TransactionContractModule;