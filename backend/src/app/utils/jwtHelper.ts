import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"],
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtPayload;
};
