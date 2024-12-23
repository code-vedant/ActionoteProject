import mongoose, { Schema } from 'mongoose';

// Define the schema for a Pomodoro session
const PomodoroSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    default: "25:00"
  },
  shortBreak: {
    type: Number,
    default: 5
  },
  longBreak: {
    type: Number,
    default: 15
  },
  cycles: {
    type: Number,
    default: 4
  },
  completedCycles: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pomodoro', PomodoroSchema);
