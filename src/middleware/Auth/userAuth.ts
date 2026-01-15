import { NextFunction, Request, Response } from "express"
import { auth } from "../../lib/auth"
import { UserRole } from "../../types/express/roleType"



export const userAuth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const session = await auth.api.getSession({
                headers: req.headers as any
            })

            if (!session || !session.user) {
                return res.status(401).json({ message: 'Unauthorized' })
            }
            if (roles.length && !roles.includes(session.user.role as UserRole)) {
                return res.status(401).json({ message: 'Unauthorized' })
            }
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                roles: session.user.role as UserRole,
                emailVerified: session.user.emailVerified
            }

            // console.log(session);
            next()
        } catch (error) {
            next(error)
        }

    }
}
