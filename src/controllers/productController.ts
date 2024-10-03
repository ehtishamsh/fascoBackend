import { Request, Response } from "express";
import {
  getAllProducts,
  getAllVariants,
  getAllColors,
  getCategoryNameById,
  getBrandNameById,
  findProductByTitle,
  createProduct,
  findVariantByNameAndProductId,
  createVariant,
  findColorByNameAndProductId,
  createColor,
  findProductBySlug,
  findProductById,
  updateProduct,
  getColorbyProductId,
  getVariantbyProductId,
  deleteColor,
  deleteVariant,
  getProductsByCategory,
  getProductFilterData,
  getSearchedProducts,
  Delete,
} from "../services/Product";
import { One } from "../services/Category";
import { getOrderByProductId } from "../services/Order";
import { getReviewsByProductID } from "../services/Review";

interface Color {
  id: number;
  name: string;
}
interface Variant {
  id: number;
  name: string;
  price: string;
}
export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    const [productsVariants, productsColors] = await Promise.all([
      getAllVariants(),
      getAllColors(),
    ]);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const getCateName = await getCategoryNameById(product.categoryId);
        const getBrandName = await getBrandNameById(product.brandId);

        const variants = productsVariants
          .filter((variant) => variant.productId === product.id)
          .map((variant) => ({ name: variant.variant, price: variant.price }));
        const numberOfOrders = await getOrderByProductId(product.id);
        const rating = await getReviewsByProductID(product.id);
        const allRatings = rating
          .map((review) => review.rating || 0)
          .reduce((acc, curr) => acc + curr, 0);
        const colors = productsColors
          .filter((color) => color.productId === product.id)
          .map((color) => ({ name: color.color }));

        return {
          ...product,
          category: getCateName?.name || null,
          brand: getBrandName?.name || null,
          variants,
          orders: numberOfOrders.length,
          rating: rating.length > 0 ? allRatings / rating.length : 0,
          totalReviews: rating.length,
          colors,
        };
      })
    );

    res.status(200).json({
      products: productsWithDetails,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Create Product
export const createProductController = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      cover,
      price,
      discounted,
      stock,
      brandId,
      categoryId,
      variants,
      colors,
      screenSize,
      cpu,
      slug,
      cores,
      mainCamera,
      ram,
      frontCamera,
      battery,
      screenType,
      sensor,
      zoom,
      features,
      connectivity,
      lens,
      megapixels,
      aperture,
      videoResolution,
      batteryLife,
      gpu,
      compatibleGames,
      maxResolution,
      microphone,
      noiseCancellation,
      wireless,
      numberOfControllers,
      storage,
      type,
    } = req.body;
    const checkifexist = await findProductByTitle(title);
    if (checkifexist) {
      return res.status(400).send("Product already exists");
    }

    const newProduct = await createProduct({
      battery,
      brandId,
      categoryId,
      cpu,
      cores,
      cover,
      description,
      frontCamera,
      discounted,
      mainCamera,
      ram,
      screenSize,
      slug,
      title,
      price,
      stock,
      screenType,
      sensor,
      zoom,
      features,
      connectivity,
      lens,
      megapixels,
      aperture,
      videoResolution,
      batteryLife,
      gpu,
      compatibleGames,
      maxResolution,
      microphone,
      noiseCancellation,
      wireless,
      numberOfControllers,
      storage,
      type,
    });

    if (!newProduct) {
      return res.status(500).send("Failed to create product");
    }

    let variantIds: string[] = [];
    if (variants.length > 0) {
      const newVariants = await Promise.all(
        variants.map(async (variant: any) => {
          const existingVariant = await findVariantByNameAndProductId(
            variant.variant,
            newProduct.id
          );

          if (existingVariant) {
            variantIds.push(existingVariant.id);
            return existingVariant;
          }

          const newVariant = await createVariant({
            price: String(variant.price),
            productId: newProduct.id,
            variant: variant.variant,
          });

          if (newVariant) {
            variantIds.push(newVariant.id);
          }

          return newVariant;
        })
      );

      if (!newVariants) {
        return res.status(500).send("Failed to create variants");
      }
    }

    let colorIds: string[] = [];
    if (colors.length > 0) {
      const newColors = await Promise.all(
        colors.map(async (color: any) => {
          const existingColor = await findColorByNameAndProductId(
            color.name,
            newProduct.id
          );

          if (existingColor) {
            colorIds.push(existingColor.id);
            return existingColor;
          }

          const newColor = await createColor({
            productId: newProduct.id,
            color: color.name,
          });

          if (newColor) {
            colorIds.push(newColor.id);
          }

          return newColor;
        })
      );

      if (!newColors) {
        return res.status(500).send("Failed to create colors");
      }
    }

    return res.json({
      newProduct,
      variantIds,
      colorIds,
      status: 200,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

// Get Product by Slug
export const getProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getProduct = await findProductBySlug(id);

    if (!getProduct) {
      return res.status(404).send("Product not found");
    }

    const [productsVariants, productsColors] = await Promise.all([
      getAllVariants(),
      getAllColors(),
    ]);

    const getCateName = await getCategoryNameById(getProduct.categoryId);
    const getBrandName = await getBrandNameById(getProduct.brandId);

    const variants = productsVariants
      .filter((variant) => variant.productId === getProduct.id)
      .map((variant) => ({
        id: variant.id,
        name: variant.variant,
        price: variant.price,
      }));

    const colors = productsColors
      .filter((color) => color.productId === getProduct.id)
      .map((color) => ({ id: color.id, name: color.color }));

    const product = {
      ...getProduct,
      category: getCateName?.name,
      brand: getBrandName?.name,
      variants,
      colors,
    };

    return res.json({
      product,
      status: 200,
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const getProductByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getProduct = await findProductById(id);
    if (!getProduct) {
      return res.status(404).send("Product not found");
    }
    return res.json({
      data: getProduct,
      status: 200,
      message: "Product fetched successfully",
    });
  } catch {
    return res.status(500).send("Failed to fetch product");
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const {
      id,
      title,
      price,
      stock,
      description,
      categoryId,
      brandId,
      variants,
      cover,
      discounted,
      screenSize,
      cpu,
      cores,
      mainCamera,
      frontCamera,
      battery,
      ram,
      slug,
      colors,
      screenType,
      sensor,
      zoom,
      features,
      connectivity,
      lens,
      megapixels,
      aperture,
      videoResolution,
      batteryLife,
      gpu,
      compatibleGames,
      maxResolution,
      microphone,
      noiseCancellation,
      wireless,
      numberOfControllers,
      storage,
      type,
    } = req.body;
    const checkifexist = await findProductById(id);
    if (!checkifexist) {
      return res.status(404).send("Product not found");
    }
    const findCategory = await getCategoryNameById(categoryId);
    if (!findCategory) {
      return res.status(404).send("Category not found");
    }
    const findBrand = await getBrandNameById(brandId);
    if (!findBrand) {
      return res.status(404).send("Brand not found");
    }
    const updateProductdetails = await updateProduct({
      id,
      title,
      price,
      discounted,
      stock,
      description,
      categoryId,
      brandId,
      cover,
      screenSize,
      cpu,
      cores,
      mainCamera,
      frontCamera,
      battery,
      ram,
      slug,
      screenType,
      sensor,
      zoom,
      features,
      connectivity,
      lens,
      megapixels,
      aperture,
      videoResolution,
      batteryLife,
      gpu,
      compatibleGames,
      maxResolution,
      microphone,
      noiseCancellation,
      wireless,
      numberOfControllers,
      storage,
      type,
    });

    if (!updateProductdetails) {
      return res.status(500).send("Failed to update product");
    }

    // Update variants
    if (variants.length > 0) {
      const existingVariants = await getVariantbyProductId(id);

      const variantNames = variants.map((variant: any) => variant.id);

      // Delete variants that are no longer present
      existingVariants.forEach(async (existingVariant: any) => {
        if (!variantNames.includes(existingVariant.id)) {
          await deleteVariant(existingVariant.id);
        }
      });

      // Add or update variants
      const newVariants = await Promise.all(
        variants.map(async (variant: any) => {
          const existingVariant = existingVariants.find(
            (ev: any) => ev.variant === variant.variant
          );
          if (existingVariant) {
            return existingVariant;
          }
          const newVariant = await createVariant({
            productId: id,
            variant: variant.variant,
            price: variant.price,
          });
          return newVariant;
        })
      );

      if (!newVariants) {
        return res.status(500).send("Failed to create variants");
      }
    }

    // Update colors
    if (colors.length > 0) {
      const existingColors = await getColorbyProductId(id);

      const colorNames = colors.map((color: any) => color.id);

      // Delete colors that are no longer present
      existingColors.forEach(async (existingColor: any) => {
        if (!colorNames.includes(existingColor.id)) {
          await deleteColor(existingColor.id);
        }
      });

      // // Add or update colors
      const newColors = await Promise.all(
        colors.map(async (color: any) => {
          const existingColor = existingColors.find(
            (ec: any) => ec.color === color.color
          );
          if (existingColor) {
            return existingColor;
          }
          const newColor = await createColor({
            productId: id,
            color: color.color,
          });
          return newColor;
        })
      );

      if (!newColors) {
        return res.status(500).send("Failed to create colors");
      }
    }
    return res.json({
      status: 200,
      message: "Product updated successfully",
      data: {
        product: updateProductdetails,
      },
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getProductsByCate = async (req: Request, res: Response) => {
  try {
    const { id: catename } = req.params;
    const getcateID = await One(catename);
    if (!getcateID) {
      return res.status(404).send("Category not found");
    }
    const products = await getProductsByCategory(getcateID.id);
    if (!products) {
      return res.status(500).send("Failed to fetch products");
    }
    const addRating = await Promise.all(
      products.map(async (product) => {
        const rating = await getReviewsByProductID(product.id);
        const allRatings = rating
          .map((review) => review.rating || 0)
          .reduce((acc, curr) => acc + curr, 0);
        return {
          ...product,
          rating: allRatings / rating.length,
          totalReviews: rating.length,
        };
      })
    );
    return res.json({
      status: 200,
      message: "Products fetched successfully",
      data: addRating,
    });
  } catch {
    console.log("error");
    return res.status(500).send("Failed to fetch products");
  }
};

export const getFilterData = async (req: Request, res: Response) => {
  const { id: catename } = req.params;
  try {
    const sliceFirst = catename.split("").splice(0, 1);
    const formatedCatename =
      sliceFirst[0].toUpperCase() + catename.split("").splice(1).join("");

    const getCateID = await One(formatedCatename);
    if (!getCateID) {
      return res.status(404).send("Category not found");
    }
    const getdata = await getProductFilterData({ cateID: getCateID.id });
    if (!getdata) {
      return res.status(500).send("Failed to fetch products");
    }
    const allData = {
      lens: [
        ...new Set(
          getdata.map((item) => item.lens).filter((item) => item !== null)
        ),
      ],
      aperture: [
        ...new Set(
          getdata.map((item) => item.aperture).filter((item) => item !== null)
        ),
      ],
      cpu: [
        ...new Set(
          getdata.map((item) => item.cpu).filter((item) => item !== null)
        ),
      ],
      ram: [
        ...new Set(
          getdata.map((item) => item.ram).filter((item) => item !== null)
        ),
      ],
      screenType: [
        ...new Set(
          getdata.map((item) => item.screenType).filter((item) => item !== null)
        ),
      ],
      screenSize: [
        ...new Set(
          getdata.map((item) => item.screenSize).filter((item) => item !== null)
        ),
      ],
      storage: [
        ...new Set(
          getdata.map((item) => item.storage).filter((item) => item !== null)
        ),
      ],
      gpu: [
        ...new Set(
          getdata.map((item) => item.gpu).filter((item) => item !== null)
        ),
      ],
      mainCamera: [
        ...new Set(
          getdata.map((item) => item.mainCamera).filter((item) => item !== null)
        ),
      ],
      frontCamera: [
        ...new Set(
          getdata
            .map((item) => item.frontCamera)
            .filter((item) => item !== null)
        ),
      ],
      maxResolution: [
        ...new Set(
          getdata
            .map((item) => item.maxResolution)
            .filter((item) => item !== null)
        ),
      ],
      megapixels: [
        ...new Set(
          getdata.map((item) => item.megapixels).filter((item) => item !== null)
        ),
      ],
      zoom: [
        ...new Set(
          getdata.map((item) => item.zoom).filter((item) => item !== null)
        ),
      ],
      videoResolution: [
        ...new Set(
          getdata
            .map((item) => item.videoResolution)
            .filter((item) => item !== null)
        ),
      ],
      brand: [...new Set(getdata.map((item) => item.brand.name))],
    };

    return res.json({
      status: 200,
      message: "Products fetched successfully",
      data: allData,
    });
  } catch {
    console.log("error");
    return res.status(500).send("Failed to fetch products");
  }
};

export const getProductsBySearch = async (req: Request, res: Response) => {
  const { query } = req.params;
  try {
    const products = await getSearchedProducts(query);
    if (!products) {
      return res.status(500).send("Failed to fetch products");
    }
    return res.json({
      status: 200,
      message: "Products fetched successfully",
      data: products,
    });
  } catch {
    console.log("error");
    return res.status(500).send("Failed to fetch products");
  }
};



export const deleteProduct= async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getProduct = await findProductById(id);
    if (!getProduct) {
      return res.status(404).send("Product not found");
    }
    const deleteProduct = await Delete(id);
    if (!deleteProduct) {
      return res.status(404).send("Product not found");
    }
    return res.json({
      status: 200,
      message: "Product deleted successfully",
      data: deleteProduct,
    });
  } catch {
    console.log("error");
    return res.status(500).send("Failed to delete product");
  }
}