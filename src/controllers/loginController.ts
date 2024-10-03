import { Request, Response } from "express";
import { z } from "zod";
import { findUniqueUserById } from "../services/User";
import { generateToken } from "../utils/auth";
import bcrypt from "bcrypt";
const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = FormSchema.parse(req.body);
    const findUser = (await findUniqueUserById(email)) as any;
    if (!findUser) {
      res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      findUser.password as string
    );
    if (!isPasswordValid) {
      res.status(400).send("Password is incorrect");
    }
    const token = generateToken(findUser);
    const removePassword = { ...findUser, password: undefined };
    return res
      .status(200)
      .json({ token, user: removePassword, message: "Login successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
