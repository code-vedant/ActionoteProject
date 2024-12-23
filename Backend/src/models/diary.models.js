import mongoose, { Schema } from 'mongoose';

const DiarySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    entry: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// compound index to ensure that each user can only have one entry per date.
DiarySchema.index({ date: 1, owner: 1 }, { unique: true });

export default mongoose.model("Diary", DiarySchema);
