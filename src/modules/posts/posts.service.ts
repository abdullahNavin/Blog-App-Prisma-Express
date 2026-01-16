import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
    data: Omit<Post, "id" | "updatedAt" | "createdAt" | "authorId">,
    authorId: string
) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: authorId,
        },
    });
    return result;
};

const getPost = async (payload: {
    search: string;
    tags: string[];
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const { search, tags, limit, skip, sortBy, sortOrder, page } = payload;

    const andCondition: PostWhereInput[] = [];
    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    tags: {
                        has: search,
                    },
                },
            ],
        });
    }

    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags,
            },
        });
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition,
        },
        orderBy: {
            [sortBy]: sortOrder.toLocaleLowerCase() === "asc" ? "asc" : "desc",
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: andCondition,
        }
    })
    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totallPage: Math.ceil(total / limit)
        }
    };
};

// get post by id
const getPostById = async (id: string) => {

    const result = await prisma.$transaction(async (tx) => {

        await tx.post.update({
            where: {
                id: id
            },
            data: {
                veiws: {
                    increment: 1
                }
            }
        })

        const result = await tx.post.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        parentId: null
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        replies: {
                            include: {
                                replies: {
                                    orderBy: { createdAt: 'asc' }
                                },

                            },
                            orderBy: { createdAt: 'asc' }
                        }
                    }

                },
                _count: {
                    select: { comments: true }
                }
            }
        })
        return result;
    })
    return result;
}

export const postsServices = {
    createPost,
    getPost,
    getPostById
};
