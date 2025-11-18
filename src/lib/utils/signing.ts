import { PV_KEY_ENCR_KEY } from '$env/static/private';
import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

type Base46String = string;

export function getSignature(data: string, encryptedPrivateKey: string): Base46String {
  const signKey = createPrivateKey({
    key: encryptedPrivateKey,
    format: 'pem',
    passphrase: PV_KEY_ENCR_KEY,
  });

  // fix: This is just to make sure I've allocated enough size in the database columns for signatures: For RSA-2048: VARCHAR(512) is enough. For modern ECDSA/Ed25519: VARCHAR(256) would do [current value]
  console.log('Key Details:', signKey.asymmetricKeyDetails);

  const signature = sign('sha256', Buffer.from(data), {
    key: signKey,
  });

  return signature.toString('base64');
}

export function verifySignature(
  data: string,
  encryptedPublicKey: string,
  signature: Base46String
) {
  const verificationKey = createPublicKey({
    key: encryptedPublicKey,
    format: 'pem',
    type: 'spki',
  });

  const isVerified = verify(
    'sha256',
    Buffer.from(data),
    {
      key: verificationKey,
    },
    Buffer.from(signature, 'base64')
  );

  return isVerified;
}
