import mongoose, { mongo } from "mongoose";

 const connectDb=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`)}
    catch(err)
{
    console.log(err.message)
}
}
export default connectDb