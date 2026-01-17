import { Router } from "express";
import { postContoller } from "./posts.controller";
import { userAuth } from "../../middleware/Auth/userAuth";
import { UserRole } from "../../types/express/roleType";

const router: Router = Router()

router.get('/', postContoller.getPost)
router.get('/myPost',
    userAuth(UserRole.ADMIN, UserRole.USER), postContoller.getAuthorPost)
router.get('/:id', postContoller.getPostById)

router.post('/',
    userAuth(UserRole.ADMIN, UserRole.USER), postContoller.createPost)

router.patch('/:postId',
    userAuth(UserRole.ADMIN, UserRole.USER), postContoller.updatePost)

export const postRoutes = router

