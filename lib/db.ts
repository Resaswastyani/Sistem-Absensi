// lib/db.ts
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Log untuk debug (hanya di development)
if (process.env.NODE_ENV !== "production") {
  console.log(
    "Database URL configured:",
    connectionString.replace(/:.*@/, ":****@"),
  );
}

export const sql = neon(connectionString);
