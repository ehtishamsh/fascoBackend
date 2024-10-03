import { Request, Response } from "express";
import { All, Create, Delete, One } from "../services/Category";
import { z } from "zod";
import { getCategoryNameById } from "../services/Product";
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category Name is required")
    .max(40, "Category Name is too long"),
});
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await All();
    if (!categories) {
      res.status(404).send("No categories found");
    }
    res.json({
      categories,
      status: 200,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = formSchema.parse(req.body);
    const category = await One(name);
    if (category) {
      res.status(400).send("Category already exists");
    }
    const newCategory = await Create(name);
    if (!newCategory) {
      res.status(500).send("Failed to create category");
    }
    res.json({
      newCategory,
      status: 200,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getCate = await getCategoryNameById(id);
    if (!getCate) {
      return res.status(404).send("Category not found");
    }
    const deleteCategory = await Delete(id);
    if (!deleteCategory) {
      return res.status(404).send("Category not found");
    }
    return res.json({
      status: 200,
      message: "Category deleted successfully",
      data: deleteCategory,
    });
  } catch {
    console.log("error");
    return res.status(500).send("Failed to delete Category");
  }
};
