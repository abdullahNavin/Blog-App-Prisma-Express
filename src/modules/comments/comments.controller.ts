import { Request, Response } from "express";
import { commentServices } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const payload = req.body
        const user = req.user
        req.body.authorId = user?.id

        const result = await commentServices.createComment(payload)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create comment'
        })
    }
}
const getCommentsById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const result = await commentServices.getCommentsById(commentId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create comment'
        })
    }
}
const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params
        const result = await commentServices.getCommentsByAuthor(authorId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create comment'
        })
    }
}

const deleteCommentbyId = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params

        const user = req.user

        const result = await commentServices.deleteCommentbyId(commentId as string, user?.id as string)

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete comment'
        })
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params

        const user = req.user

        const result = await commentServices.updateComment(commentId as string, req.body, user?.id as string)

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update comment'
        })
    }
}





export const commentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteCommentbyId,
    updateComment
}