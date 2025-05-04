import mongoose from "mongoose";

const savedRecipeSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recipe"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

export const SavedRecipe = mongoose.model("savedrecipe", savedRecipeSchema);