import mongoose, { Schema } from "mongoose";

const drawSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag",
    }],
    drawing: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
})

export default mongoose.model("Draw", drawSchema);