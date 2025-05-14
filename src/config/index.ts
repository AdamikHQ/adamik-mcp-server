import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import z from "zod";

/**
 * Configuration schema for validating environment variables
 */
const envSchema = z.object({
  ADAMIK_API_BASE_URL: z.string().url(),
  ADAMIK_API_KEY: z.string().min(1),
  // StarkNet functionality is commented out, so this is optional
  STARKNET_PRIVATE_KEY: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

/**
 * Loads and validates configuration from environment variables
 */
export function loadConfig(): Config {
  const envPath = resolve(__dirname, "../../.env");
  console.error("Looking for .env file at:", envPath);
  console.error(".env file exists:", existsSync(envPath));

  const result = config({ path: envPath });

  if (result.error) {
    console.error("Error loading .env file:", result.error);
    process.exit(1);
  }

  try {
    // Parse and validate environment variables
    const validatedConfig = envSchema.parse({
      ADAMIK_API_BASE_URL: process.env.ADAMIK_API_BASE_URL,
      ADAMIK_API_KEY: process.env.ADAMIK_API_KEY,
      STARKNET_PRIVATE_KEY: process.env.STARKNET_PRIVATE_KEY,
    });

    return validatedConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Configuration validation failed:");
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join(".")}: ${err.message}`);
      });
    } else {
      console.error("Unknown error during configuration validation:", error);
    }
    process.exit(1);
  }
}
