import { Router } from "express";
import { commentController } from "./comments.controller";
import { userAuth } from "../../middleware/Auth/userAuth";
import { UserRole } from "../../types/express/roleType";

const router = Router()

router.get('/:commentId', commentController.getCommentsById)

router.post('/',
    userAuth(UserRole.ADMIN, UserRole.USER),
    commentController.createComment
)

export const commentRoutes: Router = router