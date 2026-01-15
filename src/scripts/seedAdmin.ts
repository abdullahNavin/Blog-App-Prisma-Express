import { email } from "better-auth/*"
import { prisma } from "../lib/prisma"
import { UserRole } from "../types/express/roleType"

const seedAdmin = async () => {
    try {
        const addUser = {
            name: 'Abdullah-Navin',
            email: 'navin@mail.com',
            role: UserRole.ADMIN,
            password: 'admin12345'
        }
        // check the user exist or not
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: addUser.email
            }
        })

        if (isUserExist) {
            throw new Error('Admin user already exists')
        }

        const signupAdmin = await fetch('http://localhost:5000/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Origin": "http://localhost:5000"
            },
            body: JSON.stringify(addUser)
        })
        if (signupAdmin.ok) {
            const result = await prisma.user.update({
                where: {
                    email: addUser.email
                },
                data: {
                    emailVerified: true
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
}

seedAdmin()