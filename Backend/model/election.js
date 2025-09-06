const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // "09:30"
    endTime: { type: String, required: true },   // "17:00"

    candidates: [
      {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
        name: { type: String, required: true },  
        party: { type: String, required: true }, 
        logo: { type: String }, // URL or path to candidate logo
        voteCount: { type: Number, default: 0 },
        votes: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            votedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],

    winner: {
      candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
      name: String,
      party: String,
      logo: { type: String },
    },

    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Election", electionSchema);

/*
const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, // e.g., "General Election"
    year: { type: Number, required: true }, // e.g., "2025"
    date: { type: Date, required: true },
    candidates: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
        },
        name: { type: String, required: true }, // candidate name at the time of election
        party: { type: String, required: true }, // candidate party at that time
        voteCount: {
          type: Number,
          default: 0,
        },
        votes: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            votedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      name: { type: String, required: true }, // candidate name at the time of election
      party: { type: String, required: true }, // candidate party at that time
      default: null,
    },

    isActive: { type: Boolean, default: false }, // whether election is ongoing 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Election", electionSchema);
 */