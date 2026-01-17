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

const getAuthorPost = async (authorId: string) => {

    const result = await prisma.post.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: {
                    comments: true
                },

            }
        }
    })
    const total = await prisma.post.count({
        where: {
            authorId: authorId
        }
    })
    const aggerate = await prisma.post.aggregate({
        _count: {
            id: true
        }

    })
    return { result, total, aggerate };
}

/*
admin can update own post and user post
user can update only own post and can't update isFeature 
\*/

const updatePost = async (postId: string, authorId: string, data: Partial<Post>, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && postData.authorId !== authorId) {
        throw new Error('You do not have permision to update this post')
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data
    })
    return result;
}

export const postsServices = {
    createPost,
    getPost,
    getPostById,
    getAuthorPost,
    updatePost
};
