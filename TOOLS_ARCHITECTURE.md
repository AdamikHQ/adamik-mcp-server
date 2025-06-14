# Adamik MCP Server - Tools Architecture Guide

## Overview

The Adamik MCP Server provides LLMs with access to 80+ blockchain networks through a carefully designed tool architecture. This document explains how the tools are organized and how LLMs should interact with them effectively.

## Tool Categories

### 1. **Orientation Tool**

- **`readMeFirst`** - Essential starting point that explains the server capabilities and tool usage patterns

### 2. **Operational Tools** (Execute Blockchain Actions)

#### **Chain Discovery & Capabilities**

- **`getSupportedChains`** - Lists all supported chain IDs
- **`listFeatures`** - Gets detailed chain capabilities (read/write features, native currency info)

#### **Account Operations**

- **`getAccountState`** - Retrieves account balances (native, tokens, staking positions)
- **`getAccountHistory`** - Gets transaction history for an account
- **`deriveAddress`** - Generates blockchain address from public key

#### **Network Information**

- **`getTokenDetails`** - Fetches token information (ERC-20, TRC-20, SPL, etc.)
- **`getChainValidators`** - Lists validators for staking operations
- **`getTransactionDetails`** - Gets detailed transaction information

#### **Transaction Lifecycle**

- **`encodeTransaction`** - Prepares transactions for signing (validates, computes fees/gas)
- **`broadcastTransaction`** - Submits signed transactions to blockchain

### 3. **Specification Tool** (API Reference & Guidance)

- **`getApiSpecification`** - Complete OpenAPI spec for understanding exact formats, schemas, and validation rules

## LLM Usage Patterns

### **Start Here: Always Call `readMeFirst`**

```typescript
// First interaction with the server
readMeFirst();
// Returns comprehensive guide including tool categories and usage patterns
```

### **Pattern 1: User Wants Current Data**

```typescript
// User: "What's my ETH balance?"
getAccountState({
  chainId: "ethereum",
  accountId: "0x1234...",
});
```

### **Pattern 2: User Wants to Execute Action**

```typescript
// User: "Send 1 ETH to address X"
// Step 1: Prepare transaction
encodeTransaction({
  chainId: "ethereum",
  body: {
    mode: "transfer",
    senderAddress: "0x...",
    recipientAddress: "0x...",
    amount: "1000000000000000000",
  },
});
// Step 2: User signs with external signer
// Step 3: Submit transaction
broadcastTransaction({ chainId: "ethereum", body: { ...encodedData, signature: "0x..." } });
```

### **Pattern 3: User Gets Errors or Needs Guidance**

```typescript
// User: "I'm getting 'Invalid amount format' error"
// Check exact format requirements
getApiSpecification({
  section: "components/schemas/TransferTxData",
});
// Returns: amounts must be strings in smallest unit (wei for ETH)
```

### **Pattern 4: User Asks "How To" Questions**

```typescript
// User: "How do I stake on Cosmos?"
// Step 1: Check if staking is supported
listFeatures({ chainId: "cosmoshub" });
// Step 2: Get available validators
getChainValidators({ chainId: "cosmoshub" });
// Step 3: Reference exact format requirements
getApiSpecification({
  section: "components/schemas/StakeTxData",
});
```

## Common Workflows

### **Account Analysis Workflow**

1. **Validate chain support**: `getSupportedChains()` or `listFeatures()`
2. **Get current state**: `getAccountState()` for balances
3. **Get history**: `getAccountHistory()` for past transactions
4. **Get token details**: `getTokenDetails()` for specific tokens

### **Transaction Preparation Workflow**

1. **Check capabilities**: `listFeatures()` for supported transaction types
2. **Validate format**: `getApiSpecification()` for exact schemas
3. **Encode transaction**: `encodeTransaction()` with proper parameters
4. **Sign externally**: (requires adamik-signer-mcp-server)
5. **Broadcast**: `broadcastTransaction()` with signature

### **Staking Workflow**

1. **Check staking support**: `listFeatures()`
2. **Get validators**: `getChainValidators()`
3. **Check current positions**: `getAccountState()` for existing stakes
4. **Prepare stake transaction**: `encodeTransaction()` with stake mode
5. **Execute transaction**: Sign and `broadcastTransaction()`

## Best Practices for LLMs

### **1. Always Start with `readMeFirst`**

- Provides essential context about tool categories
- Explains operational vs specification tool distinction
- Includes important address requirements

### **2. Use Operational Tools for Actions**

- When user wants current data: use `getAccountState`, `getAccountHistory`
- When user wants to execute: use `encodeTransaction`, `broadcastTransaction`
- When user needs network info: use `listFeatures`, `getChainValidators`

### **3. Use `getApiSpecification` for Guidance**

- User gets validation errors
- User asks about format requirements
- You need exact schemas for troubleshooting
- Chain-specific parameter requirements

### **4. Handle Address Requirements**

- Many operations require blockchain addresses
- If user doesn't provide address, ask for it
- Suggest connecting adamik-signer-mcp-server for wallet integration

### **5. Error Handling Pattern**

```typescript
// When user gets errors:
// 1. Use getApiSpecification to check exact requirements
// 2. Validate their input against the schema
// 3. Provide specific format corrections
// 4. Show examples from the specification
```

## Chain Family Specifics

### **EVM Chains** (Ethereum, Polygon, BSC, etc.)

- Amounts in wei (string format): `"1000000000000000000"` for 1 ETH
- Addresses: 0x format
- Token IDs: Contract addresses
- Gas and nonce computed automatically

### **Cosmos Chains** (Cosmos Hub, Osmosis, etc.)

- Amounts in smallest unit (string): `"1000000"` for 1 ATOM (6 decimals)
- Addresses: bech32 format (`cosmos1...`, `osmo1...`)
- Validator addresses: `cosmosvaloper1...`
- Memo field supported

### **Bitcoin Family**

- Amounts in satoshis: `"100000000"` for 1 BTC
- Addresses: Various formats (P2PKH, P2SH, Bech32)
- UTXO-based transaction model

### **Other Chains**

- **Solana**: Lamports for SOL, base58 addresses
- **Starknet**: Felt252 values, hex addresses
- **TON**: Nano-tons, specific address format

## Example Scenarios

### **Scenario 1: Balance Check**

```
User: "What's my ATOM balance?"
LLM Actions:
1. getAccountState({ chainId: "cosmoshub", accountId: "cosmos1..." })
2. Parse native balance and any staking positions
3. Present in user-friendly format
```

### **Scenario 2: Error Troubleshooting**

```
User: "My transfer transaction failed with 'invalid amount'"
LLM Actions:
1. getApiSpecification({ section: "components/schemas/TransferTxData" })
2. Explain amount must be string in smallest unit
3. Show correct format: "1000000" not "1.0" for 1 ATOM
```

### **Scenario 3: Cross-Chain Guidance**

```
User: "How do I transfer USDC from Ethereum to Polygon?"
LLM Actions:
1. listFeatures({ chainId: "ethereum" }) - check bridge support
2. getApiSpecification() - understand transfer limitations
3. Explain this requires external bridge service
4. Show single-chain transfer format as alternative
```

## Maintenance Guidelines

### **When Modifying Tools**

1. **Update this document** with any new tools or changed behaviors
2. **Update `readMeFirst` tool** if categories change
3. **Test LLM workflows** to ensure clarity
4. **Update examples** to reflect new capabilities

### **Tool Addition Checklist**

- [ ] Categorize as Operational or Specification tool
- [ ] Add to appropriate section in this document
- [ ] Update `readMeFirst` tool description
- [ ] Add usage examples and workflows
- [ ] Document any chain-specific behaviors

### **Version Tracking**

- This document should be updated with each release
- Major architectural changes require comprehensive review
- Examples should reflect current API capabilities

---

**Note**: This architecture ensures LLMs can provide both authoritative guidance (via specification tool) and practical execution (via operational tools) for comprehensive blockchain operations across 80+ networks.
