import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectinst = await mongoose.connect(`${process.env.MONGODB_URL}/Actionote`)
        console.log(`\n mongoDB Connected to ${connectinst.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error: " , error);
        process.exit(1);
    }
}

export default connectDB;