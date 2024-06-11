import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TaxContractModule = buildModule("taxContractModule", (m) => {

    const taxContract = m.contract("TaxContract");

    return { taxContract };
});

export default TaxContractModule;