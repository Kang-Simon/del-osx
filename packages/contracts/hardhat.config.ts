import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import { utils, Wallet } from "ethers";
import "hardhat-deploy";
import "hardhat-gas-reporter";
// tslint:disable-next-line:no-submodule-imports
import { HardhatUserConfig, task } from "hardhat/config";
// tslint:disable-next-line:no-submodule-imports
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import "solidity-coverage";
import "solidity-docgen";

dotenv.config({ path: "env/.env" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

function getAccounts() {
    const accounts: string[] = [];
    const reg_bytes64: RegExp = /^(0x)[0-9a-f]{64}$/i;
    if (
        process.env.DEPLOYER !== undefined &&
        process.env.DEPLOYER.trim() !== "" &&
        reg_bytes64.test(process.env.DEPLOYER)
    ) {
        accounts.push(process.env.DEPLOYER);
    }

    if (process.env.OWNER !== undefined && process.env.OWNER.trim() !== "" && reg_bytes64.test(process.env.OWNER)) {
        accounts.push(process.env.OWNER);
    }

    if (
        process.env.VALIDATOR1 !== undefined &&
        process.env.VALIDATOR1.trim() !== "" &&
        reg_bytes64.test(process.env.VALIDATOR1)
    ) {
        accounts.push(process.env.VALIDATOR1);
    }

    if (
        process.env.VALIDATOR2 !== undefined &&
        process.env.VALIDATOR2.trim() !== "" &&
        reg_bytes64.test(process.env.VALIDATOR2)
    ) {
        accounts.push(process.env.VALIDATOR2);
    }

    if (
        process.env.VALIDATOR3 !== undefined &&
        process.env.VALIDATOR3.trim() !== "" &&
        reg_bytes64.test(process.env.VALIDATOR3)
    ) {
        accounts.push(process.env.VALIDATOR3);
    }

    return accounts;
}

function getTestAccounts() {
    const accounts: HardhatNetworkAccountUserConfig[] = [];
    const defaultBalance = utils.parseEther("2000000").toString();

    const n = 12;
    for (let i = 0; i < n; ++i) {
        accounts.push({
            privateKey: Wallet.createRandom().privateKey,
            balance: defaultBalance,
        });
    }
    const acc = getAccounts();
    for (let idx = 0; idx < acc.length; idx++) accounts[idx].privateKey = acc[idx];
    accounts[0].balance = utils.parseEther("100000000").toString();

    return accounts;
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config = {
    solidity: {
        compilers: [
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["storageLayout"],
                        },
                    },
                },
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: getTestAccounts(),
            gas: 8000000,
            gasPrice: 8000000000,
            blockGasLimit: 8000000,
            deploy: ["./deploy"],
        },
        bosagora_mainnet: {
            url: process.env.MAIN_NET_URL || "",
            chainId: 2151,
            accounts: getAccounts(),
            deploy: ["./deploy/bosagora_mainnet"],
        },
        bosagora_testnet: {
            url: process.env.TEST_NET_URL || "",
            chainId: 2019,
            accounts: getAccounts(),
            deploy: ["./deploy/bosagora_testnet"],
        },
        bosagora_devnet: {
            url: "http://localhost:8545",
            chainId: 24680,
            accounts: getAccounts(),
            deploy: ["./deploy/bosagora_devnet"],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        owner: {
            default: 1,
        },
        validator1: {
            default: 2,
        },
        validator2: {
            default: 3,
        },
        validator3: {
            default: 4,
        },
        validator4: {
            default: 5,
        },
        validator5: {
            default: 6,
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
        deploy: "./deploy",
    },
};

export default config;
