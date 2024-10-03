import { Request, Response } from "express";
import {
  CREATE,
  DELETE,
  GETALL,
  GETBYID,
  GETBYUSERID,
  UPDATE,
} from "../services/Address";
import prisma from "../utils/db";

interface Address {
  firstname: string;
  lastname: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  default: boolean;
  shipping: boolean;
  billing: boolean;
  userId: string;
}
export async function ALLADDRESS(req: Request, res: Response) {
  try {
    const getAddress = await GETALL();
    if (!getAddress) {
      return res.status(404).json({
        status: 404,
        message: "No address found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address fetched successfully",
      address: getAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}

export async function CREATEADDRESS(req: Request, res: Response) {
  const {
    firstname,
    lastname,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    defaultAddress,
    shipping,
    billing,
    userId,
  } = req.body;

  if (!addressLine1) {
    return res.status(400).json({
      status: 400,
      message: "Address is required",
    });
  }
  try {
    const createAddress = await CREATE({
      firstname,
      lastname,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      default: defaultAddress,
      shipping,
      billing,
      userId,
    });
    if (!createAddress) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address created successfully",
      address: createAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}
export async function UPDATEADDRESS(req: Request, res: Response) {
  const {
    id,
    firstname,
    lastname,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    defaultAddress,
    shipping,
    billing,
    userId,
  } = req.body;

  if (!addressLine1) {
    return res.status(400).json({
      status: 400,
      message: "Address is required",
    });
  }
  try {
    const checkifexist = await GETBYID(id);
    if (!checkifexist) {
      return res.status(404).json({
        status: 404,
        message: "Address not found",
      });
    }
    const updatedAddress = await UPDATE(id, {
      firstname,
      lastname,
      addressLine1,
      addressLine2,
      city,
      state,
      billing,
      country,
      default: defaultAddress,
      postalCode: postalCode,
      shipping,
      userId,
    });
    if (!updatedAddress) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}

export async function DELETEADDRESS(req: Request, res: Response) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Id is required",
    });
  }
  try {
    const deleteAddress = await DELETE(id);
    if (!deleteAddress) {
      return res.status(404).json({
        status: 404,
        message: "Address not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address deleted successfully",
      address: deleteAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}

export async function GETSINGLEADDRESS(req: Request, res: Response) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Id is required",
    });
  }
  try {
    const getAddress = await GETBYID(id);
    if (!getAddress) {
      return res.status(404).json({
        status: 404,
        message: "Address not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address fetched successfully",
      address: getAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}
export async function GETUSERADDRESS(req: Request, res: Response) {
  try {
    const { id } = req.body;

    const getAddress = await prisma?.address?.findMany({
      where: {
        userId: id,
      },
    });
    if (!getAddress) {
      return res.status(404).json({
        status: 404,
        message: "Address not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Address fetched successfully",
      address: getAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}
