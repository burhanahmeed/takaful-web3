# Takaful HAQQ Network

Takaful HAQQ Network is a decentralized insurance platform built on blockchain technology, combining the principles of Takaful (Islamic cooperative insurance) with the HAQQ Network.

## Features

- Decentralized insurance claims and voting
- Wallet integration for contributions and claim submissions
- Smart contract-based policy management
- Privacy-preserving transactions using HAQQ Network

## Technologies Used

- Next.js 14.2.5
- React 18
- Ethers.js 5.7.2
- Solidity 0.8.0+
- Tailwind CSS 3.4.1
- TypeScript

## Getting Started

1. Clone the repository:

```
git clone git@github.com:burhanahmeed/takaful-web3.git
cd takaful-web3
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```
4. Open your browser and navigate to http://localhost:3000 to view the application.

## Smart Contract Deployment

1. Start a local Hardhat node:
```
npx hardhat node
```
2. Deploy the smart contract to the local node:
```
npx hardhat run deploy.js --network localhost
```
3. Copy the contract address and update the contract address in the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## License

This project is licensed under the MIT License.