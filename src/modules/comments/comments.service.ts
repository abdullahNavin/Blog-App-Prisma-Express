import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type commentPayload = {
    postId: string;
    content: string;
    parentId?: string;
    authorId: string
}

const createComment = async (payload: commentPayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    const result = await prisma.comment.create({
        data: payload
    })
    return result;
}

const getCommentsById = async (commentId: string) => {
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    veiws: true
                }
            }
        }
    })
    return result;
}

const getCommentsByAuthor = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        orderBy: { createdAt: 'asc' },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result;
}

const deleteCommentbyId = async (commentId: string, authorId: string) => {
    const findComment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            authorId: authorId
        },
        select: {
            id: true
        }
    })
    if (!findComment) {
        throw new Error('Given input not valid')
    }
    return await prisma.comment.delete({
        where: {
            id: findComment.id
        }
    })
}

const updateComment = async (commentId: string, data: { content?: string, status?: commentStatus }, authorId: string) => {
    const findComment = await prisma.comment.findUnique({
        where: {
            id: commentId,
            authorId: authorId
        }
    })
    if (!findComment) {
        throw new Error('Given input is invalid')
    }
    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
}

export const commentServices = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteCommentbyId,
    updateComment
}