async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // const ClaimValidityVerifier = await ethers.getContractFactory("Groth16Verifier");
  // const claimValidityVerifier = await ClaimValidityVerifier.deploy();
  // await claimValidityVerifier.deployed();
  // console.log("ClaimValidityVerifier deployed to:", claimValidityVerifier.address);

  const Takaful = await ethers.getContractFactory("Takaful");
  const takaful = await Takaful.deploy();
  await takaful.deployed();
  console.log("Takaful deployed to:", takaful.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
