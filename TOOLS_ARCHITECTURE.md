# Adamik MCP Server - Tools Architecture Guide

## Overview

The Adamik MCP Server provides LLMs with access to 80+ blockchain networks through a carefully designed tool architecture. This document explains how the tools are organized and how LLMs should interact with them effectively.

## CRITICAL: Decimal Handling Requirements

**MOST IMPORTANT**: All balance amounts from blockchain APIs are returned in SMALLEST UNITS (wei, satoshis, µATOM, etc.), NOT human-readable values. LLMs MUST convert these before presenting to users.

### Mandatory API Calls for Decimal Conversion:

1. **For NATIVE currency balances**: ALWAYS call `listFeatures(chainId)` FIRST to get exact decimals
2. **For TOKEN balances**: ALWAYS call `getTokenDetails(chainId, tokenId)` for each token's exact decimals
3. **NEVER assume decimal values** - different chains use different decimals

### Common Error Example:

- **Raw ATOM balance**: `4191769000` µATOM
- **ATOM decimals** (from listFeatures): `6`
- **Correct conversion**: `4191769000 ÷ 10^6 = 4.191769 ATOM`
- **WRONG presentation**: `4,191.769 ATOM` (decimal in wrong place)
- **CORRECT presentation**: `4.191769 ATOM`

**Always present to users in human-readable format (ETH, ATOM, BTC), never in smallest units unless debugging.**

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

- **`encodeTransaction`** - Prepares transactions for signing (validates, computes fees/gas). Supports all transaction types: transfer, transferToken, stake, unstake, claimRewards, withdraw, registerStake, convertAsset, and deployAccount
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

// User: "How do I format a convertAsset transaction?"
getApiSpecification({
  section: "components/schemas/ConvertAssetTxData",
});
// Returns: exact schema with from/to objects, slippage, etc.
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
2. **CRITICAL: Get decimals FIRST**: `listFeatures(chainId)` for native currency decimals
3. **Get current state**: `getAccountState()` for raw balances (in smallest units)
4. **For tokens**: Call `getTokenDetails(chainId, tokenId)` for each token's decimals
5. **Convert all amounts**: `human_readable = raw_amount ÷ 10^decimals`
6. **Get history**: `getAccountHistory()` for past transactions
7. **Present to user**: Show converted amounts in human-readable format (ETH, ATOM, etc.)

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

### **Asset Conversion Workflow (Swap/Bridge)**

1. **Check conversion support**: `listFeatures()` for supported features
2. **Get token details**: `getTokenDetails()` for both source and target tokens
3. **Prepare conversion**: `encodeTransaction()` with convertAsset mode
4. **Specify parameters**:
   - `from`: source token and address
   - `to`: target token, address, and optionally different chainId for cross-chain
   - `amount`: conversion amount in smallest units
   - `includeFees`: whether to include bridge/swap fees
   - `slippage`: acceptable slippage tolerance (0-1)
5. **Execute transaction**: Sign and `broadcastTransaction()`

## Best Practices for LLMs

### **1. Always Start with `readMeFirst`**

- Provides essential context about tool categories
- Explains operational vs specification tool distinction
- Includes important address requirements

### **2. CRITICAL: Always Handle Decimal Conversion Properly**

- **MANDATORY**: Call `listFeatures(chainId)` for native currency decimals
- **MANDATORY**: Call `getTokenDetails(chainId, tokenId)` for token decimals
- **NEVER assume decimal values** - chains use different decimals (ATOM=6, ETH=18, BTC=8)
- **ALWAYS convert**: `human_readable = raw_amount ÷ 10^decimals`
- **NEVER show raw amounts** to users (wei, satoshis, µATOM) unless debugging

### **3. Use Operational Tools for Actions**

- When user wants current data: use `getAccountState`, `getAccountHistory`
- When user wants to execute: use `encodeTransaction`, `broadcastTransaction`
- When user needs network info: use `listFeatures`, `getChainValidators`

### **4. Use `getApiSpecification` for Guidance**

- User gets validation errors
- User asks about format requirements
- You need exact schemas for troubleshooting
- Chain-specific parameter requirements

### **5. Handle Address Requirements**

- Many operations require blockchain addresses
- If user doesn't provide address, ask for it
- Suggest connecting adamik-signer-mcp-server for wallet integration

### **6. Error Handling Pattern**

```typescript
// When user gets errors:
// 1. Use getApiSpecification to check exact requirements
// 2. Validate their input against the schema
// 3. Provide specific format corrections
// 4. Show examples from the specification
```

## User Presentation Guidelines

### **CRITICAL: Always Use Human-Readable Formats for End Users**

- **ALWAYS present balances in standard units: ETH, BTC, USDC, ATOM, etc.**
- **NEVER show smallest units (wei, satoshis, µATOM) to end users unless specifically needed**
- **MUST call API endpoints to get exact decimals - NEVER assume decimal values**

### **Mandatory Decimal Conversion Process**

**EVERY TIME you display balances:**

1. **Call API for decimals**:
   - `listFeatures(chainId)` for native currency decimals
   - `getTokenDetails(chainId, tokenId)` for token decimals
2. **Get raw balance**: `getAccountState()` returns amounts in smallest units
3. **Convert**: `human_readable = raw_amount ÷ 10^decimals`
4. **Present**: Show converted amount with currency symbol

### **When to Show Smallest Units**

Only display raw blockchain values in these cases:

- **Troubleshooting/debugging**: API integration issues
- **Dust amounts**: Very low balances where human-readable shows 0.000000...
- **Technical discussions**: Transaction fees, gas calculations
- **Explicit requests**: User specifically asks for raw values
- **Development/debugging**: API response analysis

### **Presentation Examples**

```
GOOD: "Your ATOM balance is 4.191769 ATOM"
BAD: "Your ATOM balance is 4191769000 µATOM"
BAD: "Your ATOM balance is 4,191.769 ATOM" (incorrect decimal placement)

GOOD: "Your Optimism balance is 0.0054 ETH"
BAD: "Your Optimism balance is 5354656887913579 wei"

GOOD: "You have 2.2451 USDC tokens"
BAD: "You have 2245100 raw USDC units"

GOOD (dust case): "You have a small amount: 123 wei (less than 0.000001 ETH)"
```

### **Common Decimal Conversion Errors to Avoid**

- **ATOM**: 6 decimals, so `4191769000 ÷ 10^6 = 4.191769` (NOT 4,191.769)
- **ETH**: 18 decimals, so `5354656887913579 ÷ 10^18 = 0.005354...` (NOT 5.35)
- **BTC**: 8 decimals, so `100000000 ÷ 10^8 = 1.0` (NOT 100)
- **USDC**: 6 decimals, so `2245100 ÷ 10^6 = 2.2451` (NOT 2,245.1)

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
1. MANDATORY: listFeatures({ chainId: "cosmoshub" }) - get ATOM decimals (returns 6)
2. getAccountState({ chainId: "cosmoshub", accountId: "cosmos1..." }) - get raw balance (e.g., "4191769000")
3. CRITICAL: Convert using exact decimals: 4191769000 ÷ 10^6 = 4.191769
4. Present to user: "Your ATOM balance is 4.191769 ATOM"

NEVER present: "4191769000 µATOM" or "4,191.769 ATOM" (wrong decimal placement)
ALWAYS convert raw amounts before showing to users!
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

### **Scenario 4: Asset Conversion/Swap**

```
User: "I want to convert 100 USDC to ETH on Ethereum"
LLM Actions:
1. listFeatures({ chainId: "ethereum" }) - check convertAsset support
2. getTokenDetails({ chainId: "ethereum", tokenId: "usdc" }) - get USDC decimals (6)
3. getTokenDetails({ chainId: "ethereum", tokenId: "native" }) - get ETH decimals (18)
4. Convert amount: 100 USDC = 100 × 10^6 = "100000000" in smallest units
5. encodeTransaction({
     chainId: "ethereum",
     body: {
       mode: "convertAsset",
       from: { tokenId: "usdc", address: "0x..." },
       to: { tokenId: "native", address: "0x..." },
       amount: "100000000",
       includeFees: true,
       slippage: 0.01
     }
   })
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
