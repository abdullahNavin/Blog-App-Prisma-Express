import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../../generated/prisma/client";

const errorHandelar = (err: any, req: Request,
    res: Response, next: NextFunction
) => {

    let errorCode = 500;
    let errorMessage = 'intarnal server error'

    if (err instanceof Prisma.PrismaClientValidationError) {
        errorCode = 400
        errorMessage = 'Incorrect field type provided'
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        errorCode = 400
        if (err.code === 'P2002') {
            errorMessage = 'Unique constraint failed'
        } else if (err.code === 'P2025') {
            errorMessage = 'Record not found'
        } else {
            errorMessage = 'Database error'
        }
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        errorCode = 500
        errorMessage = 'Database connection error'
    }

    res.status(errorCode)
    res.json({
        message: errorMessage,
        error: err
    })
}

export default errorHandelar