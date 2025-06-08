import { z } from 'zod';

// Component Schemas

// ChainId
export const ChainIdSchema = z.string();

// ChainSupportedFeatures
export const ChainSupportedFeaturesReadTransactionSchema = z.object({
  native: z.boolean(),
  tokens: z.boolean(),
  staking: z.boolean(),
});

export const ChainSupportedFeaturesReadAccountBalancesSchema = z.object({
  native: z.boolean(),
  tokens: z.boolean(),
  staking: z.boolean(),
});

export const ChainSupportedFeaturesReadAccountTransactionsSchema = z.object({
  native: z.boolean(),
  tokens: z.boolean(),
  staking: z.boolean(),
});

export const ChainSupportedFeaturesReadAccountSchema = z.object({
  balances: ChainSupportedFeaturesReadAccountBalancesSchema,
  transactions: ChainSupportedFeaturesReadAccountTransactionsSchema,
});

export const ChainSupportedFeaturesReadSchema = z.object({
  token: z.boolean(),
  validators: z.boolean(),
  transaction: ChainSupportedFeaturesReadTransactionSchema,
  account: ChainSupportedFeaturesReadAccountSchema,
});

export const ChainSupportedFeaturesWriteTransactionTypeSchema = z.object({
  deployAccount: z.boolean(),
  transfer: z.boolean(),
  transferToken: z.boolean(),
  stake: z.boolean(),
  unstake: z.boolean(),
  claimRewards: z.boolean(),
  withdraw: z.boolean(),
  registerStake: z.boolean(),
}).strict();

export const ChainSupportedFeaturesWriteTransactionFieldSchema = z.object({
  memo: z.boolean(),
});

export const ChainSupportedFeaturesWriteTransactionSchema = z.object({
  type: ChainSupportedFeaturesWriteTransactionTypeSchema,
  field: ChainSupportedFeaturesWriteTransactionFieldSchema,
});

export const ChainSupportedFeaturesWriteSchema = z.object({
  transaction: ChainSupportedFeaturesWriteTransactionSchema,
});

export const ChainSupportedFeaturesUtilsSchema = z.object({
  addresses: z.boolean(),
});

export const ChainSupportedFeaturesSchema = z.object({
  read: ChainSupportedFeaturesReadSchema,
  write: ChainSupportedFeaturesWriteSchema,
  utils: ChainSupportedFeaturesUtilsSchema,
});

// SignerSpec
export const SignerSpecCurveSchema = z.enum(["secp256k1", "ed25519", "stark"]);

export const SignerSpecHashFunctionSchema = z.enum(["sha256", "keccak256", "sha512_256", "pedersen", "none"]);

export const SignerSpecSignatureFormatSchema = z.enum(["rsv", "rs"]);

export const SignerSpecSchema = z.object({
  curve: SignerSpecCurveSchema,
  hashFunction: SignerSpecHashFunctionSchema,
  signatureFormat: SignerSpecSignatureFormatSchema,
  coinType: z.string(),
});

// ChainFamily
export const ChainFamilySchema = z.enum([
  "aptos", "algorand", "cosmos", "evm", "bitcoin",
  "tron", "ton", "starknet"
]);

// ChainDetail
export const ChainDetailSchema = z.object({
  family: ChainFamilySchema,
  id: ChainIdSchema,
  nativeId: z.string(),
  name: z.string(),
  ticker: z.string(),
  decimals: z.number(),
  isTestnetFor: z.string().optional(),
  supportedFeatures: ChainSupportedFeaturesSchema,
  signerSpec: SignerSpecSchema,
});


// Paths

// GET /api/chains
export const GetSupportedChainsResponseSchema = z.object({
  chains: z.record(z.string(), ChainDetailSchema),
});
export type GetSupportedChainsResponse = z.infer<typeof GetSupportedChainsResponseSchema>;
export const GetChainDetailsResponseSchema = z.object({
  chain: ChainDetailSchema,
});
export type GetChainDetailsResponse = z.infer<typeof GetChainDetailsResponseSchema>;

// GET /api/{chainId}/token/{tokenId}
export const TokenTypeSchema = z.enum([
  "TRC10", "TRC20", "ASA", "ERC20",
  "IBC", "JETTON", "APTOS_COIN"
]);

export const TokenInfoSchema = z.object({
  type: TokenTypeSchema,
  id: z.string(),
  name: z.string(),
  ticker: z.string(),
  decimals: z.string(),
  contractAddress: z.string().optional(),
});

export const GetTokenDetailsResponseSchema = z.object({
  token: TokenInfoSchema,
});
export type GetTokenDetailsResponse = z.infer<typeof GetTokenDetailsResponseSchema>;

// GET /api/{chainId}/validators
export const ValidatorSchema = z.object({
  address: z.string(),
  name: z.string(),
  commission: z.number().optional(),
  stakedAmount: z.string().optional(),
});

export const PaginationSchema = z.object({
  nextPage: z.string().nullable(),
});

export const GetChainValidatorsPathParamsSchema = z.object({
  chainId: ChainIdSchema,
});
export type GetChainValidatorsPathParams = z.infer<typeof GetChainValidatorsPathParamsSchema>;

export const GetChainValidatorsQueryParamsSchema = z.object({
  nextPage: z.string().optional(),
});
export type GetChainValidatorsQueryParams = z.infer<typeof GetChainValidatorsQueryParamsSchema>;

export const GetChainValidatorsResponseSchema = z.object({
  chainId: ChainIdSchema,
  validators: z.array(ValidatorSchema),
  pagination: PaginationSchema,
});
export type GetChainValidatorsResponse = z.infer<typeof GetChainValidatorsResponseSchema>;


// GET /api/{chainId}/transaction/{transactionId}
export const TransactionModeSchema = z.enum([
  "deployAccount", "transfer", "transferToken", "stake",
  "unstake", "claimRewards", "withdraw", "registerStake", "unknown"
]);

export const TransactionStateSchema = z.enum([
  "pending", "unconfirmed", "confirmed", "failed", "unknown"
]);

export const AmountTickerSchema = z.object({
  amount: z.string(),
  ticker: z.string().optional(),
});

export const SendersRecipientsInfoSchema = z.object({
  address: z.string(),
  amount: z.string(),
  ticker: z.string().optional(),
});

export const TransactionValidatorParticipantSchema = z.object({
  address: z.string(),
  amount: z.string().optional(),
  ticker: z.string().optional(),
});

export const TransactionValidatorsSchema = z.object({
  source: TransactionValidatorParticipantSchema.optional(),
  target: TransactionValidatorParticipantSchema.optional(),
});

export const ParsedTransactionSchema = z.object({
  id: z.string(),
  mode: TransactionModeSchema,
  state: TransactionStateSchema,
  tokenId: z.string().optional(),
  blockHeight: z.string().optional(),
  timestamp: z.string().optional(),
  fees: AmountTickerSchema,
  gas: z.string().optional(),
  nonce: z.string().optional(),
  memo: z.string().optional(),
  senders: z.array(SendersRecipientsInfoSchema).optional(),
  recipients: z.array(SendersRecipientsInfoSchema).optional(),
  validators: TransactionValidatorsSchema.optional(),
});

export const TransactionDetailSchema = z.object({
  raw: z.record(z.string(), z.any()).optional(),
  parsed: ParsedTransactionSchema.optional(),
});

export const TransactionStatusErrorWarningSchema = z.object({
  message: z.string(),
});

export const TransactionStatusSchema = z.object({
  errors: z.array(TransactionStatusErrorWarningSchema),
  warnings: z.array(TransactionStatusErrorWarningSchema),
});

export const GetTransactionDetailsPathParamsSchema = z.object({
  chainId: ChainIdSchema,
  transactionId: z.string(),
});
export type GetTransactionDetailsPathParams = z.infer<typeof GetTransactionDetailsPathParamsSchema>;

export const GetTransactionDetailsResponseSchema = z.object({
  transaction: TransactionDetailSchema,
  status: TransactionStatusSchema,
});
export type GetTransactionDetailsResponse = z.infer<typeof GetTransactionDetailsResponseSchema>;

// POST /api/{chainId}/address/encode
export const PubkeyToAddressPathParamsSchema = z.object({
  chainId: ChainIdSchema,
});
export type PubkeyToAddressPathParams = z.infer<typeof PubkeyToAddressPathParamsSchema>;

export const PubkeyToAddressRequestBodySchema = z.object({
  pubkey: z.string(),
});
export type PubkeyToAddressRequestBody = z.infer<typeof PubkeyToAddressRequestBodySchema>;

export const EncodedAddressSchema = z.object({
  type: z.string(),
  address: z.string(),
});

export const PubkeyToAddressResponseSchema = z.object({
  chainId: ChainIdSchema,
  pubkey: z.string(),
  addresses: z.array(EncodedAddressSchema),
});
export type PubkeyToAddressResponse = z.infer<typeof PubkeyToAddressResponseSchema>;


// GET /api/{chainId}/account/{accountId}/state
export const GetAccountStatePathParamsSchema = z.object({
  chainId: ChainIdSchema,
  accountId: z.string(),
});
export type GetAccountStatePathParams = z.infer<typeof GetAccountStatePathParamsSchema>;

export const NativeBalanceSchema = z.object({
  available: z.string(),
  unconfirmed: z.string().optional(),
  total: z.string(),
});

export const TokenBalanceItemSchema = z.object({
  token: TokenInfoSchema,
  amount: z.string(),
});

export const StakingPositionStatusSchema = z.enum([
  "free", "pending", "locked", "unlocking", "unlocked", "slashed"
]);

export const StakingPositionSchema = z.object({
  stakeId: z.string().optional(),
  validatorAddresses: z.array(z.string()),
  amount: z.string(),
  status: StakingPositionStatusSchema,
  completionDate: z.string().optional(),
});

export const StakingRewardNativeSchema = z.object({
  validatorAddress: z.string(),
  amount: z.string(),
});

export const StakingRewardTokenSchema = z.object({
  token: TokenInfoSchema,
  validatorAddress: z.string().optional(),
  amount: z.string(),
});

export const StakingRewardsSchema = z.object({
  native: z.array(StakingRewardNativeSchema),
  tokens: z.array(StakingRewardTokenSchema),
});

export const StakingBalanceSchema = z.object({
  total: z.string(),
  locked: z.string(),
  unlocking: z.string(),
  unlocked: z.string(),
  positions: z.array(StakingPositionSchema),
  rewards: StakingRewardsSchema.optional(),
});

export const AccountBalancesSchema = z.object({
  native: NativeBalanceSchema.optional(),
  tokens: z.array(TokenBalanceItemSchema).optional(),
  staking: StakingBalanceSchema.optional(),
});

export const GetAccountStateResponseSchema = z.object({
  chainId: ChainIdSchema,
  accountId: z.string(),
  balances: AccountBalancesSchema,
});
export type GetAccountStateResponse = z.infer<typeof GetAccountStateResponseSchema>;


// GET /api/{chainId}/account/{accountId}/history
export const GetAccountHistoryPathParamsSchema = z.object({
  chainId: ChainIdSchema,
  accountId: z.string(),
});
export type GetAccountHistoryPathParams = z.infer<typeof GetAccountHistoryPathParamsSchema>;

export const GetAccountHistoryQueryParamsSchema = z.object({
  nextPage: z.string().optional(),
  include: z.string().optional(),
});
export type GetAccountHistoryQueryParams = z.infer<typeof GetAccountHistoryQueryParamsSchema>;

export const GetAccountHistoryResponseSchema = z.object({
  chainId: ChainIdSchema,
  accountId: z.string(),
  transactions: z.array(TransactionDetailSchema),
  pagination: PaginationSchema,
});
export type GetAccountHistoryResponse = z.infer<typeof GetAccountHistoryResponseSchema>;


// Transaction Encoding / Validation / Broadcast Related Schemas

// Base Transaction Data for Requests
export const BaseTransactionDataRequestSchema = z.object({
  memo: z.string().optional(),
});

// Base Transaction Data completed by API in Encode Response
export const CompletedBaseTransactionDataSchema = z.object({
  fees: z.string(),
  gas: z.string().optional(),
  nonce: z.string().optional(),
  memo: z.string().optional(),
  params: z.record(z.string(), z.any()).optional(),
});

// Mode-specific Transaction Data Schemas
export const DeployAccountTxDataSchema = z.object({
  mode: z.literal("deployAccount"),
  senderPubKey: z.string(),
  contractType: z.literal("argentx").default("argentx").optional(),
});

// Transfer (Properties for union, Refined for standalone export)
const TransferTxDataPropertiesSchema = z.object({
  mode: z.literal("transfer"),
  senderAddress: z.string(),
  senderPubKey: z.string().optional(),
  recipientAddress: z.string(),
  amount: z.string().optional(),
  useMaxAmount: z.boolean().default(false).optional(),
});

// TransferToken (Properties for union, Refined for standalone export)
const TransferTokenTxDataPropertiesSchema = z.object({
  mode: z.literal("transferToken"),
  tokenId: z.string(),
  senderAddress: z.string(),
  senderPubKey: z.string().optional(),
  recipientAddress: z.string(),
  amount: z.string().optional(),
  useMaxAmount: z.boolean().default(false).optional(),
});

// Stake (Properties for union, Refined for standalone export)
const StakeTxDataPropertiesSchema = z.object({
  mode: z.literal("stake"),
  senderAddress: z.string(),
  senderPubKey: z.string().optional(),
  sourceValidatorAddress: z.string().optional(),
  targetValidatorAddress: z.string(),
  amount: z.string().optional(),
  useMaxAmount: z.boolean().default(false).optional(),
});

// Unstake (Properties for union, Refined for standalone export)
const UnstakeTxDataPropertiesSchema = z.object({
  mode: z.literal("unstake"),
  senderAddress: z.string(),
  senderPubKey: z.string().optional(),
  validatorAddress: z.string(),
  stakeId: z.string().optional(),
  amount: z.string().optional(),
  useMaxAmount: z.boolean().default(false).optional(),
});

export const ClaimRewardsTxDataSchema = z.object({
  mode: z.literal("claimRewards"),
  senderAddress: z.string(),
  senderPubKey: z.string().optional(),
  validatorAddress: z.string(),
  stakeId: z.string().optional(),
  compound: z.boolean().default(false).optional(),
});

export const WithdrawTxDataSchema = z.object({
  mode: z.literal("withdraw"),
  senderAddress: z.string(),
  senderPubKey: z.string(),
  amount: z.string().optional(),
  validatorAddress: z.string().optional(),
  stakeId: z.string().optional(),
  recipientAddress: z.string(),
});

export const RegisterStakeTxDataSchema = z.object({
  mode: z.literal("registerStake"),
  senderAddress: z.string(),
  senderPubKey: z.string(),
  senderForeignPubKey: z.string(),
  proofOfPossession: z.string(),
  amount: z.string(),
  validatorPubKey: z.string(),
  unsignedUnbondingTransaction: z.string(),
  signedStakingTransaction: z.string(),
  signedSlashingTransaction: z.string(),
  signedUnbondingSlashingTransaction: z.string(),
});

// Discriminated Union for request data (uses unrefined properties schemas for relevant modes)
const DiscriminatedTransactionModeRequestDataSchema = z.discriminatedUnion("mode", [
  DeployAccountTxDataSchema,
  TransferTxDataPropertiesSchema,
  TransferTokenTxDataPropertiesSchema,
  StakeTxDataPropertiesSchema,
  UnstakeTxDataPropertiesSchema,
  ClaimRewardsTxDataSchema,
  WithdrawTxDataSchema,
  RegisterStakeTxDataSchema
]);

// Combined Transaction Data for Encode Request
export const EncodeTransactionRequestDataSchema = z.intersection(
  BaseTransactionDataRequestSchema,
  DiscriminatedTransactionModeRequestDataSchema
).superRefine((data, ctx) => {
  if (
    data.mode === "transfer" ||
    data.mode === "transferToken" ||
    data.mode === "stake" ||
    data.mode === "unstake"
  ) {
    const specificData = data as { amount?: string; useMaxAmount?: boolean; mode: string };
    if (!((specificData.amount !== undefined && specificData.amount !== null && specificData.amount !== '') || specificData.useMaxAmount === true)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `For mode '${specificData.mode}', either 'amount' must be a non-empty string or 'useMaxAmount' must be true.`,
        path: ["amount"],
      });
    }
  }
});


// POST /api/{chainId}/transaction/encode
export const EncodeTransactionPathParamsSchema = z.object({
  chainId: ChainIdSchema,
});
export type EncodeTransactionPathParams = z.infer<typeof EncodeTransactionPathParamsSchema>;

export const EncodeTransactionRequestBodySchema = z.object({
  transaction: z.object({
    data: EncodeTransactionRequestDataSchema,
  }),
});
export type EncodeTransactionRequestBody = z.infer<typeof EncodeTransactionRequestBodySchema>;

// For response of transaction/encode
export const EncodeTransactionResponseDataSchema = z.intersection(
  CompletedBaseTransactionDataSchema,
  DiscriminatedTransactionModeRequestDataSchema // Re-uses the same discriminated union structure as request
  // as the response 'data' includes the original mode fields
  // along with completed base fields.
);

export const EncodedItemHashFormatSchema = z.enum(["sha256", "keccak256", "sha512_256", "pedersen"]);

export const EncodedItemHashSchema = z.object({
  format: EncodedItemHashFormatSchema,
  value: z.string(),
});

export const EncodedItemRawFormatSchema = z.enum([
  "RLP", "WALLET_CONNECT", "SIGNDOC_DIRECT", "SIGNDOC_DIRECT_JSON",
  "SIGNDOC_AMINO", "SIGNDOC_AMINO_JSON", "BOC", "RAW_TRANSACTION",
  "MSGPACK", "PSBT", "BCS"
]);

export const EncodedItemRawSchema = z.object({
  format: EncodedItemRawFormatSchema,
  value: z.string(),
});

export const EncodedItemSchema = z.object({
  hash: EncodedItemHashSchema.optional(),
  raw: EncodedItemRawSchema.optional(),
});

export const EncodeTransactionResponseTransactionSchema = z.object({
  data: EncodeTransactionResponseDataSchema,
  encoded: z.array(EncodedItemSchema),
});

export const EncodeTransactionResponseSchema = z.object({
  chainId: ChainIdSchema,
  transaction: EncodeTransactionResponseTransactionSchema,
  status: TransactionStatusSchema,
});
export type EncodeTransactionResponse = z.infer<typeof EncodeTransactionResponseSchema>;


// POST /api/{chainId}/transaction/broadcast
export const BroadcastTransactionPathParamsSchema = z.object({
  chainId: ChainIdSchema,
});
export type BroadcastTransactionPathParams = z.infer<typeof BroadcastTransactionPathParamsSchema>;

export const BroadcastTransactionRequestBodyTransactionSchema = z.object({

  data: EncodeTransactionResponseDataSchema, // Data from encode response
  encoded: z.array(EncodedItemSchema),    // Encoded from encode response
  signature: z.string(),
});

export const BroadcastTransactionRequestBodySchema = z.object({
  transaction: BroadcastTransactionRequestBodyTransactionSchema,
});
export type BroadcastTransactionRequestBody = z.infer<typeof BroadcastTransactionRequestBodySchema>;

export const BroadcastTransactionResponseSchema = z.object({
  chainId: ChainIdSchema,
  hash: z.string().optional(),
});
export type BroadcastTransactionResponse = z.infer<typeof BroadcastTransactionResponseSchema>;
