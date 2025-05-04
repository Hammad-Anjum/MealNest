import {Recipe} from '../Models/Recipe.js'
import {SavedRecipe} from '../Models/SavedRecipe.js'

// Add Recipe
export const add = async (req, res) => {
  const {
    title,
    ist,
    ingredients,
    ing1,
    ing2,
    ing3,
    ing4,
    qty1,
    qty2,
    qty3,
    qty4,
    imgurl,
    cookTime,
    category 
  } = req.body;
    
  try {

    const recipe = await Recipe.create({
      title,
      ist,
      ingredients: ingredients || [],
      ing1,
      ing2,
      ing3,
      ing4,
      qty1,
      qty2,
      qty3,
      qty4,
      imgurl,
      cookTime: cookTime || "30 minutes",
      category: category || "other", // Set the category with a default value
      user: req.user,
      comments: [],
      ratings: {
        totalRating: 0,
        count: 0,
        average: 0
      }
    });
    
    res.json({message:"Recipe Created Successfully..!", recipe})
  } catch (error) {
    res.json({message: error.message})
  }
}

export const updateRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;
  
  try {
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Recipe not found' 
      });
    }
    
    if (recipe.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You are not authorized to update this recipe' 
      });
    }

    // Prepare the update object
    const updateData = {
      title: req.body.title,
      ist: req.body.ist,
      imgurl: req.body.imgurl,
      cookTime: req.body.cookTime,
      category: req.body.category,
      ingredients: req.body.ingredients
    };

    // Handle legacy ingredients - only include if they have values
    for (let i = 1; i <= 4; i++) {
      const ingKey = `ing${i}`;
      const qtyKey = `qty${i}`;
      
      if (req.body[ingKey] || req.body[qtyKey]) {
        // If either field has a value, include both
        updateData[ingKey] = req.body[ingKey] || '';
        updateData[qtyKey] = req.body[qtyKey] || '';
      } else {
        // If both are empty, explicitly set to empty strings to clear them
        updateData[ingKey] = '';
        updateData[qtyKey] = '';
      }
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: updateData },
      { new: true }
    );
    
    res.json({
      status: 'success',
      message: 'Recipe updated successfully',
      recipe: updatedRecipe
    });
    
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Recipe not found' 
      });
    }

    if (recipe.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Unauthorized' 
      });
    }

    await Recipe.findByIdAndDelete(recipeId);
    await SavedRecipe.deleteMany({ recipe: recipeId });

    // Explicit success response
    return res.status(200).json({ 
      status: 'success', 
      message: 'Recipe deleted successfully' 
    });

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
}; 



export const getAllRecipe = async (req, res) => {
  const recipe = await Recipe.find();
  res.json({recipe}) 
}

export const getRecipeById = async (req, res) => {
  const id = req.params.id
  try { 
    let recipe = await Recipe.findById(id)

    if(!recipe) return res.json({message:'recipe not exist'})

    res.json({message:"recipe by id", recipe})
      
  } catch (error) {
    res.json({message: error.message})
  }
}

export const getRecipeByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    let recipe = await Recipe.find({user: userId});

    if (!recipe) return res.json({ message: "recipe not exist" });

    res.json({ message: "recipe by userId", recipe });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export const savedRecipeById = async (req, res) => {
  const id = req.params.id
  const userId = req.user

  let recipe = await SavedRecipe.findOne({recipe: id, user: userId})

  if(recipe) return res.json({message: "recipe already saved"})

  recipe = await SavedRecipe.create({
    recipe: id,
    user: userId
  })
  
  res.json({message: "Recipe saved Successfully..!"})
}

export const getSavedRecipe = async (req, res) => {
  const userId = req.user;
  try {
    const recipes = await SavedRecipe.find({ user: userId }).populate('recipe');
    res.json({ recipe: recipes });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export const addComment = async (req, res) => {
  const { text, rating } = req.body;
  const recipeId = req.params.id;
  const userId = req.user;

  try {
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) return res.json({ message: "Recipe not found" });

    // Add new comment
    recipe.comments.push({
      user: userId,
      text,
      rating,
      createdAt: new Date()
    });

    // Update ratings
    recipe.ratings.totalRating += rating;
    recipe.ratings.count += 1;
    recipe.ratings.average = recipe.ratings.totalRating / recipe.ratings.count;

    await recipe.save();
    
    res.json({ message: "Comment added successfully", recipe });
  } catch (error) {
    res.json({ message: error.message });
  }
}