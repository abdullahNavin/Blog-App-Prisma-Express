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

export const commentServices = {
    createComment
}