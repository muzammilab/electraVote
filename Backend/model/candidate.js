const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    party: { 
      type: String, 
      required: true 
    },
    logo: {
      type: String,
      get: (logoPath) => {
        // If logo exists
        if (logoPath) {
          return `${logoPath}`;
        }
        return null;
      },
    },
    age: { 
      type: Number 
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true }, // enable getter for JSON output & Due to this we also get id field along with _id both are same but id is easier to use on frontend.
    toObject: { getters: true } 
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);


/*  
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    party: { 
      type: String, 
      required: true 
    },
    logo: {
      type: String,
    },
    age: { 
      type: Number 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
 */