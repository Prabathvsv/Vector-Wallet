# 🌌 Vector Wallet: The Ultimate Web3 Arcade & Wallet

Vector Wallet is a feature-rich, non-custodial Ethereum Sepolia wallet designed with a glassmorphic interface. It combines secure transaction management with an interactive **Airdrop Arcade** to provide the most engaging Web3 experience.

![Frontend Preview](https://github.com/Prabathvsv/Vector-Wallet/raw/main/src/assets/hero.png)

## 🚀 Core Features

### 🎮 Web3 Arcade Hub
Win authentic Sepolia ETH by playing interactive minigames:
- **Spin the Wheel**: High-fidelity CSS-driven physics with random prize pools.
- **Seed Match**: A memory-testing challenge using BIP-39 mnemonic phrases.
- **Simon Says**: A fast-paced sequence game featuring top blockchain networks.
- **Human Verifier**: The classic rapid-click challenge to prove you're not a bot.

### 💎 Cinematic 3D Vault
Every win triggers a **3D Vault Reveal**. Experience a cinematic 3D rotation and unlock animation before claiming your rewards from the faucet.

### 🛡️ Non-Custodial Security
- **Local AES-256 Encryption**: Your private keys are encrypted with your PIN and stored safely in your browser's local storage.
- **Biometric-ready UI**: Designed for modern security standards.

### 🤖 Agentic Transaction Guidance
- **Smart Analysis**: Get real-time alerts before sending transactions (e.g., zero-address warnings, gas fee spikes, or insufficient funds).
- **Error Decoding**: Readable explanations for complex Ethereum Virtual Machine (EVM) errors.

### 📂 Decentralized Identity (KYC)
- **IPFS Integration**: Securely upload and store KYC metadata using the latest **Pinata SDK**.
- **Admin Dashboard**: A secure view for authorized addresses to manage and review identity documents.

### 📊 Real-time Activity
- **Etherscan V2 Integration**: A complete, styled ledger of your transaction history powered by the latest Etherscan unified API.

---

## 🛠️ Built With

- **Frontend**: React 19 + Vite (TypeScript)
- **Blockchain**: Ethers.js v6
- **Storage**: Pinata IPFS SDK
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **Icons**: Lucide React

---

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prabathvsv/Vector-Wallet.git
   cd Vector-Wallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_PINATA_JWT=your_pinata_jwt
   VITE_ADMIN_ADDRESS=your_admin_wallet_address
   VITE_INFURA_KEY=your_infura_project_id
   VITE_FAUCET_PRIVATE_KEY=your_faucet_pk
   VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Run locally**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is optimized for **Vercel**. Simply connect your GitHub repository and ensure the Environment Variables listed above are configured in the Vercel dashboard.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Built with ❤️ for the Ethereum Community by Prabath and Anurag *
