import { Request, Response } from "express";
import userService from "../services/userService";
import { UpdateUser } from "../services/User";
import { generateToken } from "../utils/auth";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      res.status(404).send("No users found");
    }
    res.json(users);
  } catch (error) {
    console.log("error", error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, firstname, lastname, email, gender, dob } = req.body;
    const user = await UpdateUser({
      id,
      firstname,
      lastname,
      email,
      gender,
      birthday: dob,
      updatedAt: new Date(),
    });

    if (!user) {
      res.status(404).send("User not found");
    }
    const token = await generateToken(user);
    const removePassword = { ...user, password: undefined as undefined };
    res.json({
      status: 200,
      message: "User updated successfully",
      user: removePassword,
      token,
    });
  } catch (error) {
    console.log("error", error);
  }
};
