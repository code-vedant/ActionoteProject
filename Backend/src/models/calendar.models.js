import mongoose, { Schema } from "mongoose";

const CalendarSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: String,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    recurrenceEndDate: { type: Date },
    color: {
      type: String,
      validate: {
        validator: function (v) {
          return /^#([0-9A-F]{3}){1,2}$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid hex color!`,
      },
    },
    reminder: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ["confirmed", "tentative", "canceled"],
      default: "confirmed",
    },
    todo:{
      type: Schema.Types.ObjectId,
      ref: "Todo",
    }
  },
  { timestamps: true }
);

export default mongoose.model("CalendarEvent", CalendarSchema);
