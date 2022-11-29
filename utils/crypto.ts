import { IV_LENGTH, SAL_LENGTH } from "./constants";

const bufferToBase64 = (buffer: any) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const base64ABuffer = (buffer: any) =>
  Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0));

export const derivationBasedOnSecret = async (
  secret: string,
  sal: Uint8Array,
  iterations: number,
  longitud: number,
  hash: string,
  algorithm = "AES-CBC"
) => {
  const encoder = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(String(sal)),
      iterations: iterations,
      hash,
    },
    keyMaterial,
    { name: algorithm, length: longitud },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptAesCbc = async (
  text: string,
  secret = process.env.PRIVATE_KEY_SECRET as string
) => {
  const encoder = new TextEncoder();
  const sal = window.crypto.getRandomValues(new Uint8Array(SAL_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const bufferText = encoder.encode(text);

  const key = await derivationBasedOnSecret(
    secret,
    sal,
    100000,
    256,
    "SHA-256"
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    bufferText
  );

  return bufferToBase64([...sal, ...iv, ...new Uint8Array(encrypted)]);
};

export const decryptAesCbc = async (
  text: string,
  secret = process.env.PRIVATE_KEY_SECRET as string
) => {
  const decoder = new TextDecoder();
  const bufferText = base64ABuffer(text);
  const sal = bufferText.slice(0, SAL_LENGTH);
  const iv = bufferText.slice(SAL_LENGTH, SAL_LENGTH + IV_LENGTH);

  const key = await derivationBasedOnSecret(
    secret,
    sal,
    100000,
    256,
    "SHA-256"
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    bufferText.slice(SAL_LENGTH + IV_LENGTH)
  );

  return decoder.decode(decrypted);
};

export const generateKeys = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );

  const publicKeyJwk = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey
  );

  const privateKeyJwk = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey
  );

  const encryptedPrivateKey = await encryptAesCbc(
    JSON.stringify(privateKeyJwk)
  );

  return { publicKeyJwk, encryptedPrivateKey };
};

export const getDeriveKey = async (
  publicKeyJwk: JsonWebKey,
  privateKeyJwk: JsonWebKey
) => {
  const publicKey = await window.crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );

  const privateKey = await window.crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );

  return await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: publicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptAesGcm = async (text: string, key: CryptoKey) => {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const bufferText = encoder.encode(text);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    bufferText
  );

  return bufferToBase64([...iv, ...new Uint8Array(encrypted)]);
};

export const decryptAesGcm = async (text: string, key: CryptoKey) => {
  const decoder = new TextDecoder();
  const bufferText = base64ABuffer(text);
  const iv = bufferText.slice(0, IV_LENGTH);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    bufferText.slice(IV_LENGTH)
  );

  return decoder.decode(decrypted);
};
