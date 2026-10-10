import prisma from "../lib/prisma.js";
export const healthController = async (req,res)=>{
    try{
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "ok",
            database:"Connected"
         });
    }catch(e){
        console.error(e);
        res.status(500).json({ status: "error",
            database:"Disconnected"
         });
    }
}