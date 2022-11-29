import speakeasy, { Encoding } from "speakeasy";
import qrcode from "qrcode";
import { encryptAesCbc } from "./crypto";

export const createSecret = async (username: string) => {
  const secret = speakeasy.generateSecret({ name: `chat-ui-${username}` });
  const uri = await qrcode.toDataURL(secret.otpauth_url as string);

  return {
    secret: secret.ascii,
    uri,
  };
};

export const verifyToken = (token: string, secret: string) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "ascii",
    token,
  });
};
