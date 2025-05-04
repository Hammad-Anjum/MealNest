import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_Context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { addRecipe } = useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    ist: "",
    ing1: "",
    ing2: "",
    ing3: "",
    ing4: "",
    qty1: "",
    qty2: "",
    qty3: "",
    qty4: "",
    imgurl: "",
    cookTime: "30 minutes",
    category: "other", 
    ingredients: []
  });

  // Define category options
  const categoryOptions = [
    "other",
    "vegan",
     "non veg",
    "keto",
    "gluten-free",
    "dairy-free",
    "low-carb",
    "dessert",
    "breakfast",
    "lunch",
    "dinner"
  ];

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", quantity: "" }]
    });
  };

  const removeIngredientField = (index) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const {
      title,
      ist,
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
      category, 
      ingredients
    } = formData;

    const result = await addRecipe(
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
    );

    toast.success(result.data.message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <ToastContainer />
      <div
        className="container my-5 p-5"
        style={{
          width: "700px",
          border: "2px solid yellow",
          borderRadius: "10px",
        }}
      >
        <h2 className="text-center mb-4">Add Recipe</h2>
        <form onSubmit={onSubmitHandler} className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              value={formData.title}
              onChange={onChangeHandler}
              name="title"
              type="text"
              className="form-control"
              id="title"
              required
            />
          </div>
          
          {/* Add the new category dropdown */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              value={formData.category}
              onChange={onChangeHandler}
              name="category"
              className="form-select"
              id="category"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="ist" className="form-label">
              Instructions
            </label>
            <textarea
              value={formData.ist}
              onChange={onChangeHandler}
              name="ist"
              className="form-control"
              id="ist"
              rows="3"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="cookTime" className="form-label">
              Cook Time
            </label>
            <input
              value={formData.cookTime}
              onChange={onChangeHandler}
              name="cookTime"
              type="text"
              className="form-control"
              id="cookTime"
            />
          </div>

          <div className="mb-4">
            <h4>Ingredients</h4>
            
            {/* Default 4 ingredients displayed side by side */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group mb-2">
                  <span className="input-group-text">1</span>
                  <input
                    value={formData.ing1}
                    onChange={onChangeHandler}
                    name="ing1"
                    type="text"
                    className="form-control"
                    placeholder="Ingredient"
                  />
                  <input
                    value={formData.qty1}
                    onChange={onChangeHandler}
                    name="qty1"
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="input-group mb-2">
                  <span className="input-group-text">2</span>
                  <input
                    value={formData.ing2}
                    onChange={onChangeHandler}
                    name="ing2"
                    type="text"
                    className="form-control"
                    placeholder="Ingredient"
                  />
                  <input
                    value={formData.qty2}
                    onChange={onChangeHandler}
                    name="qty2"
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                  />
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group mb-2">
                  <span className="input-group-text">3</span>
                  <input
                    value={formData.ing3}
                    onChange={onChangeHandler}
                    name="ing3"
                    type="text"
                    className="form-control"
                    placeholder="Ingredient"
                  />
                  <input
                    value={formData.qty3}
                    onChange={onChangeHandler}
                    name="qty3"
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="input-group mb-2">
                  <span className="input-group-text">4</span>
                  <input
                    value={formData.ing4}
                    onChange={onChangeHandler}
                    name="ing4"
                    type="text"
                    className="form-control"
                    placeholder="Ingredient"
                  />
                  <input
                    value={formData.qty4}
                    onChange={onChangeHandler}
                    name="qty4"
                    type="text"
                    className="form-control"
                    placeholder="Quantity"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional dynamic ingredients */}
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="input-group mb-2">
                <span className="input-group-text">{index + 5}</span>
                <input
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  placeholder="Ingredient"
                  className="form-control"
                />
                <input
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  placeholder="Quantity"
                  className="form-control"
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeIngredientField(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={addIngredientField}
            >
              Add More Ingredients
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="imgurl" className="form-label">
              Image URL
            </label>
            <input
              value={formData.imgurl}
              onChange={onChangeHandler}
              name="imgurl"
              type="text"
              className="form-control"
              id="imgurl"
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary mt-3 px-4">
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRecipe;