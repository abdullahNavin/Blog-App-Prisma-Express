import { Request, Response } from "express";
import { postsServices } from "./posts.service";
import paginationSortingHelper from "../../helper/pagination&Sorting";
import { UserRole } from "../../types/express/roleType";

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

const getAuthorPost = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const result = await postsServices.getAuthorPost(user?.id as string)

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "faield to get post"
    })
  }
}


const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const { postId } = req.params

    const isAdmin = user?.roles === UserRole.ADMIN
    console.log(user?.id);

    if (!postId || !user?.id) {
      throw new Error('post id and user id are required')
    }

    const result = await postsServices.updatePost(postId, user?.id, req.body, isAdmin)

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user

    const { postId } = req.params

    if (!postId || !user?.roles) {
      throw new Error('post id and user id are required')
    }

    const isAdmin = user?.roles === UserRole.ADMIN
    const result = await postsServices.deletePost(postId, user?.id, isAdmin)
    res.status(200).json(result)
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postsServices.getStats()
    res.status(200).json(result)
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}




export const postContoller = {
  createPost,
  getPost,
  getPostById,
  getAuthorPost,
  updatePost,
  deletePost,
  getStats
};
