import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

const FormSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
export async function register(req: Request, res: Response) {
  try {
    const { firstname, lastname, email, password } = FormSchema.parse(req.body);

    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    const checkifexits = await prisma.user.findFirst({
      where: { email: email },
    });
    if (checkifexits) {
      res.status(400).send("User already exists");
      return;
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedpassword,
        role: "customer",
      },
    });

    const removedPassword = { ...user, password: undefined as undefined };
    res.json({
      message: "user created successfully",
      user: removedPassword,
      status: 200,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send(error);
  }
}
