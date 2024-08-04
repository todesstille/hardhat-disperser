const hre = require("hardhat");
const { expect } = require("chai");

describe("Disperse", function () {
  before("", async () => {
    [admin, alice, bob] = await hre.ethers.getSigners();
  })

  beforeEach("", async () => {
    const Token = await hre.ethers.getContractFactory("Token");
    const TestDisperser = await hre.ethers.getContractFactory("TestDisperser");
    const Disperser = await hre.ethers.getContractFactory("Disperser");

    token0 = await Token.deploy();
    token1 = await Token.deploy();

    testDisperser = await TestDisperser.deploy();
    disperser = await Disperser.deploy();

    await admin.sendTransaction({
      to: testDisperser.target,
      value: 1000000000
    })

    await admin.sendTransaction({
      to: disperser.target,
      value: 1000000000
    })

    await token0.transfer(testDisperser.target, 1000000000);
    await token1.transfer(testDisperser.target, 1000000000);
    await token0.transfer(disperser.target, 1000000000);
    await token1.transfer(disperser.target, 1000000000);
  })

  describe("Gas check", function () {
    it("Economic disperser should be twice productive", async function () {
      let tx = await testDisperser.disperse([
        [
          hre.ethers.ZeroAddress,
          [alice.address, bob.address],
          [1, 1]
        ],
        [
          token0.target,
          [alice.address, bob.address],
          [1, 1]
        ],
        [
          token1.target,
          [alice.address, bob.address],
          [1, 1]
        ]
      ]);

      let receipt = await tx.wait();
      console.log("Regular disperser used gas", receipt.gasUsed);

      tx = await admin.sendTransaction({
        to: disperser.target,
        data: "0x030000000000000000000000000000000000000000020000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001f62849f9a0b5bf2913b396098f7c7019b51a820a0200000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000015991a2df15a8f6a256d3ec51e99254cd3fb576a9020000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001"
      });

      receipt = await tx.wait();
      console.log("Economic disperser used gas", receipt.gasUsed);
    });

  });
});
