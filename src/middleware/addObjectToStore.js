import { initMinIO } from "../misc/minio";

const minioBucket = "image-storage";
export async function addObjectToStore(req,res,next){
   
    if ( req.file) {
   const minio = await initMinIO();
   const name = Date.now()+" "+req.file.originalname
   await minio.putObject(minioBucket, name, req.file.buffer);
    next()
    }
}