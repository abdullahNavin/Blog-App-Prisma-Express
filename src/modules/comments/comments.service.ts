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

export const commentServices = {
    createComment,
    getCommentsById
}