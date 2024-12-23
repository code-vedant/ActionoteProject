import mongoose, { Schema } from "mongoose";

const FlowSchema = new Schema(
  {
    name: {
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
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "Tag",
      default: [],
    },
    nodes: [
      {
        id: { type: String, required: true },
        type: { type: String },
        data: { type: Schema.Types.Mixed },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
      },
    ],
    edges: [
      {
        id: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
        type: { type: String },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster search
FlowSchema.index({ name: 1, owner: 1 });

// Virtual for node count
FlowSchema.virtual("nodeCount").get(function () {
  return Array.isArray(this.nodes) ? this.nodes.length : 0;
});

export default mongoose.model("Flow", FlowSchema);
