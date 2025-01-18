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

DiarySchema.index({ date: 1, owner: 1 }, { unique: true });

DiarySchema.pre('save', function (next) {
  const diary = this;
  diary.date = new Date(diary.date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  next();
});

export default mongoose.model("Diary", DiarySchema);
