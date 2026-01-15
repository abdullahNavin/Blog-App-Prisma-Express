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

export const commentController = {
    createComment
}