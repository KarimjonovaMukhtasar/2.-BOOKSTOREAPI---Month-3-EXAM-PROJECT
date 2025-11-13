import jwt from 'jsonwebtoken';

export function generateToken(payload, secret, expiresIn) {
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (e) {
    throw new Error(e);
  }
}

export function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded
  } catch (e) {
    throw new Error(e)
  }
}
