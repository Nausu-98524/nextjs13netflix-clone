import mongoose from "mongoose";


const connectToDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://net-clone:net-clone123@cluster0.qxxtruy.mongodb.net/");
        console.log('Mongo DB Connected');
    } catch (error) {
        console.log(error);
        
    }
}

export default connectToDB;