import { Router } from "express";
import { commentController } from "./comments.controller";
import { userAuth } from "../../middleware/Auth/userAuth";
import { UserRole } from "../../types/express/roleType";

const router = Router()

router.get('/:commentId', commentController.getCommentsById)
router.get('/author/:authorId', commentController.getCommentsByAuthor)
router.delete('/:commentId',
    userAuth(UserRole.ADMIN, UserRole.USER),
    commentController.deleteCommentbyId
)

router.patch('/:commentId',
    userAuth(UserRole.ADMIN, UserRole.USER),
    commentController.updateComment
)

router.post('/',
    userAuth(UserRole.ADMIN, UserRole.USER),
    commentController.createComment
)

export const commentRoutes: Router = router