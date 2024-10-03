import jwt from "jsonwebtoken";
import secretkey from "./jwtConfiq";

const generateToken = (user: any) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretkey, { expiresIn: "1h" });
};
const generateRefreshToken = (user: any) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretkey, { expiresIn: "7h" });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, secretkey);
};

export { generateToken, generateRefreshToken, verifyToken };
