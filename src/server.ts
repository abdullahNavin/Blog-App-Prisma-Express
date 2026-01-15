import app from "./app";
import { prisma } from "./lib/prisma";

const PORT= process.env.PORT || 5000

const main = async () => {
    try {
        await prisma.$connect()
        console.log('connected to database successfully');

        app.listen(PORT,()=>{
            console.log('server is runing successfully');
        })
    }
    catch (err) {
        console.log('An error occurred', err);
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()