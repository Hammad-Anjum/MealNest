import express from 'express';
import { 
  add, 
  getAllRecipe, 
  getRecipeById, 
  getRecipeByUserId, 
  getSavedRecipe, 
  savedRecipeById,
  addComment,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipe.js';

import { Authenticate } from '../middlewares/auth.js';

const router = express.Router();

// create recipe
router.post('/add', Authenticate, add);

// get all recipe
router.get('/', getAllRecipe);

// get all saved Recipe
router.get('/saved', Authenticate, getSavedRecipe);

// get recipe by Id
router.get('/:id', getRecipeById);

// get recipe by userId
router.get('/user/:id', getRecipeByUserId);

// saved Recipe by Id
router.post("/:id", Authenticate, savedRecipeById);

// add comment and rating to recipe
router.post("/:id/comment", Authenticate, addComment);

// update recipe
router.put('/:id', Authenticate, updateRecipe);

// delete recipe
router.delete('/:id', Authenticate, deleteRecipe);



export default router;