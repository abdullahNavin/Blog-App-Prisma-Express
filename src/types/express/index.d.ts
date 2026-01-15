
import 'express';


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                name: string | null
                email: string
                roles: UserRole
                emailVerified: boolean | null
            }
        }
    }
}
