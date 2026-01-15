import { Request, Response } from "express";
import { postsServices } from "./posts.service";
import paginationSortingHelper from "../../helper/pagination&Sorting";

const createPost = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(500).json({
        message: "invalid authorId",
      });
    }
    const result = await postsServices.createPost(req.body, authorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "failed to create post",
      error: error,
    });
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postsServices.getPost({
      search,
      tags,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);

  }

  catch (error) {
    res.status(404).json({
      message: "failed to read post",
      error: error,
    });
  }
};

// get post by id
const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id
  console.log(id);
  if (!id) {
    throw new Error('post id is required')
  }

  try {

    const result = await postsServices.getPostById(id)
    res.status(200).json(result)

  }
  catch (error) {
    res.status(404).json({
      message: 'failed to get data',
      error: error
    })
  }
}

export const postContoller = {
  createPost,
  getPost,
  getPostById
};
