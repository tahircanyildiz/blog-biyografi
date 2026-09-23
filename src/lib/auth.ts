const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET env variable is not set");
  }
  return secret;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(expiry: string): Promise<string> {
  const key = await importHmacKey(getSecret());
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(expiry)
  );
  return bufferToHex(signature);
}

/** Creates a signed session token in `expiry.signature` format. */
export async function createSessionToken(): Promise<string> {
  const expiry = (Date.now() + SESSION_TTL_SECONDS * 1000).toString();
  const signature = await sign(expiry);
  return `${expiry}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;

  if (Date.now() > Number(expiry)) return false;

  const expectedSignature = await sign(expiry);
  if (expectedSignature.length !== signature.length) return false;

  // constant-time comparison
  let diff = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    diff |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS };
