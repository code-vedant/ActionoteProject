import mongoose from 'mongoose';

import k8sMachineWorkflow from './mongodb_oidc/k8s_machine_workflow'; // Check the correct path and extension


const connectDB = async () => {
    try {
        const connectinst = await mongoose.connect(`${process.env.MONGODB_URL}/Actionote`);
        
        console.log(`MongoDB Connected to ${connectinst.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;
