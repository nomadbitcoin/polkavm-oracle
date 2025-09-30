# Oracle Deployment

Deployment scripts for the upgradeable Oracle smart contract on Passet Asset Hub.

## Deployed Contracts

**Current Deployment:**

- **Proxy Address**: `0x4e9c7aCc3C2a408087b83E755f02dE94d1f8b78F`
- **Implementation Address**: `0x06d701DFe729E67c3841928d5B022A6dcAEE0068`

> **Note**: Always use the proxy address for interactions. The implementation address is only needed for upgrades.

## Quick Start

### Deploy Oracle

```bash
npx hardhat run scripts/deploy-oracle.ts --network passetAssetHub
```

### Upgrade Oracle

```bash
PROXY_ADDRESS=0xA26313ACf84ff7C6d471BAE69f96A84E3036F9e4 npx hardhat run scripts/upgrade-oracle.ts --network passetAssetHub
```

### Test Oracle

```bash
npx hardhat run scripts/connect-oracle.ts --network passetAssetHub
```

## Environment Setup

Create `.env` file:

```env
PASSET_HUB_PK=your_private_key_here
PASSET_ORACLE_MODULE=0xA26313ACf84ff7C6d471BAE69f96A84E3036F9e4
```

## Scripts

| Script              | Purpose                       | Usage                                                                                    |
| ------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| `deploy-oracle.ts`  | Deploy Oracle with UUPS proxy | `npx hardhat run scripts/deploy-oracle.ts --network passetAssetHub`                      |
| `upgrade-oracle.ts` | Upgrade Oracle implementation | `PROXY_ADDRESS=0x... npx hardhat run scripts/upgrade-oracle.ts --network passetAssetHub` |
| `connect-oracle.ts` | Test Oracle functionality     | `npx hardhat run scripts/connect-oracle.ts --network passetAssetHub`                     |

## Contract Architecture

**UUPS Proxy Pattern:**

- `OracleUpgradeable`: Implementation contract with business logic
- `OracleProxy`: Proxy contract that delegates calls to implementation
- Storage: All data stored in proxy, preserved during upgrades

## Oracle Functions

| Function                     | Description               |
| ---------------------------- | ------------------------- |
| `createFeed(symbol, price)`  | Create new price feed     |
| `getPrice(symbol)`           | Get current price         |
| `updatePrice(symbol, price)` | Update existing price     |
| `deleteFeed(symbol)`         | Remove price feed         |
| `feedExists(symbol)`         | Check if feed exists      |
| `getLastUpdated(symbol)`     | Get last update timestamp |

## Network Configuration

```typescript
passetAssetHub: {
  polkavm: true,
  url: "https://passet-asset-hub-eth-rpc.polkadot.io",
  accounts: [process.env.PASSET_HUB_PK || ""],
}
```
