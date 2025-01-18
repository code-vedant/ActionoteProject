import mongoose, { Schema } from "mongoose";

const drawSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    drawing: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
})

export default mongoose.model("Draw", drawSchema);