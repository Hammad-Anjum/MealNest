import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  }
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ist: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "other" // Default value if not specified
  },
  ingredients: [ingredientSchema],
  // Keep the old fields for backward compatibility
  ing1: {type: String},
  ing2: {type: String},
  ing3: {type: String},
  ing4: {type: String},
  qty1: {type: String},
  qty2: {type: String},
  qty3: {type: String},
  qty4: {type: String},
  imgurl: {
    type: String,
    required: true
  },
  cookTime: {
    type: String,
    default: "30 minutes"
  },
  comments: [commentSchema],
  ratings: {
    totalRating: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
});

export const Recipe = mongoose.model("recipe", recipeSchema);