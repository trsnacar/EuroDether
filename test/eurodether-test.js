const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EURODETHER", function () {
  let EURODETHER;
  let eurodether;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    EURODETHER = await ethers.getContractFactory("EURODETHER");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    eurodether = await EURODETHER.deploy(ethers.utils.parseEther("10000"), owner.address);

    await eurodether.connect(owner).mint(addr1.address, ethers.utils.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await eurodether.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = ethers.utils.parseEther("10000");
      const ownerBalance = await eurodether.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await eurodether.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("50"));
      const addr2Balance = await eurodether.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.utils.parseEther("50"));
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialBalance = await eurodether.balanceOf(addr1.address);
      await expect(
        eurodether.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("2000"))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await eurodether.balanceOf(addr1.address)).to.equal(initialBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await eurodether.balanceOf(owner.address);
      const initialAddr1Balance = await eurodether.balanceOf(addr1.address);
      const initialAddr2Balance = await eurodether.balanceOf(addr2.address);
    
      // Transfer 100 tokens from owner to addr1
      await eurodether.connect(owner).transfer(addr1.address, ethers.utils.parseEther("100"));
    
      // Transfer 50 tokens from addr1 to addr2
      await eurodether.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("50"));
    
      // Check balances
      const finalOwnerBalance = await eurodether.balanceOf(owner.address);
      const finalAddr1Balance = await eurodether.balanceOf(addr1.address);
      const finalAddr2Balance = await eurodether.balanceOf(addr2.address);
    
      console.log("Initial Owner Balance:", initialOwnerBalance.toString());
      console.log("Initial Addr1 Balance:", initialAddr1Balance.toString());
      console.log("Initial Addr2 Balance:", initialAddr2Balance.toString());
      console.log("Final Owner Balance:", finalOwnerBalance.toString());
      console.log("Final Addr1 Balance:", finalAddr1Balance.toString());
      console.log("Final Addr2 Balance:", finalAddr2Balance.toString());
    
      const expectedFinalOwnerBalance = initialOwnerBalance.sub(ethers.utils.parseEther("100"));
      const expectedFinalAddr1Balance = initialAddr1Balance.sub(ethers.utils.parseEther("100")).sub(ethers.utils.parseEther("50"));
      const expectedFinalAddr2Balance = initialAddr2Balance.add(ethers.utils.parseEther("50"));
    
      expect(finalOwnerBalance.toString()).to.equal(expectedFinalOwnerBalance.toString(), "Unexpected final owner balance");
      expect(finalAddr1Balance.toString()).to.equal(expectedFinalAddr1Balance.toString(), "Unexpected final addr1 balance");
      expect(finalAddr2Balance.toString()).to.equal(expectedFinalAddr2Balance.toString(), "Unexpected final addr2 balance");
    });    
  });
});
