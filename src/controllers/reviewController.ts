import { Request, Response } from "express";
import { findUserByEmail, findUserByID } from "../services/User";
import { getOrderByOrderNumber, getOrderByUserID } from "../services/Order";
import { findProductById, findProductBySlug } from "../services/Product";
import {
  create,
  getReviewsByProductID,
  getReviewsByUserID,
  getReviewsByUserIDandProductID,
} from "../services/Review";
import { object } from "zod";

export async function orderReview(req: Request, res: Response) {
  const { uid } = req.params;

  try {
    const checkUser = await findUserByID(uid);
    if (!checkUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const orders = await getOrderByUserID(uid);
    if (!orders) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }
    const getReviews = await getReviewsByUserID(uid);

    if (!getReviews) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }
    const checkIfComplete = orders.filter(
      (order) => order.orderStatus === "COMPLETED"
    );
    if (checkIfComplete.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No orders or reviews found for this user",
      });
    }
    const checkIfReviewed = checkIfComplete.map((order) => {
      // Map through each item in the order
      const updatedItems = order.items?.map((item) => {
        // Check if there is a review for this product
        const isReviewed = getReviews.some(
          (review) => review.productId === item.product.id
        );
        // Return the item with the 'reviewed' property set accordingly
        return {
          ...item,
          reviewed: isReviewed, // true if reviewed, false if not
        };
      });

      // Return the updated order with the modified items
      return {
        ...order,
        items: updatedItems,
      };
    });

    if (checkIfReviewed.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No orders or reviews found for this user",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Reviews fetched successfully",
      orders: checkIfReviewed,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
}

export async function addReview(req: Request, res: Response) {
  try {
    const {
      ratings,
      comment,
      userid,
    }: {
      ratings: { [key: string]: number };
      comment: { [key: string]: string };
      userid: string;
    } = req.body;
    const checkuser = await findUserByID(userid);
    if (!checkuser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const getProductID = Object.keys(ratings);
    const checkproducts = await Promise.all(
      getProductID.map(async (id) => {
        const product = await findProductById(id);
        if (!product) {
          return res.status(404).json({
            status: 404,
            message: "Product not found",
          });
        }
        return product;
      })
    );
    if (checkproducts.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }
    const createReviews = await Promise.all(
      getProductID.map(async (id, index) => {
        if (
          id === Object.keys(ratings)[index] &&
          id === Object.keys(comment)[index]
        ) {
          const review = ratings[id];
          const comments = comment[id];
          const createReview = await create({
            userid,
            productId: id,
            comment: comments,
            rating: review,
          });
          if (!createReview) {
            return res.status(400).json({
              status: 400,
              message: "Bad request",
            });
          }
          return createReview;
        }
      })
    );
    if (createReviews.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Bad request",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Review created successfully",
      reviews: createReviews,
    });
  } catch (error) {
    res.status(400).send("Bad request");
  }
}

export async function getReviewsByOrderID(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const order = await getOrderByOrderNumber(Number(id));
    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    const productIDs = order.items?.map((item) => item.product.id);
    const getReviews = await Promise.all(
      productIDs.map(async (productId) => {
        const userEmail = order.user.email;
        const getUser = await findUserByEmail(userEmail);
        if (!getUser) {
          return res
            .status(404)
            .json({ message: "User not found", status: 404 });
        }

        const product = await findProductById(productId);
        if (!product) {
          return res
            .status(404)
            .json({ message: "Product not found", status: 404 });
        }

        const review = await getReviewsByUserIDandProductID({
          productid: productId,
          userid: getUser.id,
        });
        return review
          ? {
              ...review,
              color: order.items?.find((item) => item.product.id === productId)
                ?.color,
              variant: order.items?.find(
                (item) => item.product.id === productId
              )?.variant,
            }
          : null;
      })
    );

    const reviewsWithData = getReviews.filter((review) => review !== null);

    if (reviewsWithData.length > 0) {
      return res.status(200).json({
        message: "Reviews fetched successfully",
        status: 200,
        reviews: reviewsWithData,
      });
    }

    return res
      .status(200)
      .json({ data: order, status: 200, message: "Order found" });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Error fetching order items", status: 400 });
  }
}

export async function getReviewByProductSlug(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await findProductBySlug(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: 404 });
    }
    const getReviews = await getReviewsByProductID(product.id);
    if (!getReviews) {
      return res
        .status(404)
        .json({ message: "Reviews not found", status: 404 });
    }
    return res.status(200).json({
      message: "Reviews fetched successfully",
      status: 200,
      reviews: getReviews,
    });
  } catch {
    res.status(400).send("Bad request");
  }
}
