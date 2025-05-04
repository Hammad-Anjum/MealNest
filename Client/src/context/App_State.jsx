import React, { useEffect, useState } from "react";
import { AppContext } from "./App_Context";
import axios from "axios";

const App_State = (props) => {
  const url = "http://localhost:3000/api";
  const [token, setToken] = useState("");
  const [recipe, setrecipe] = useState([]);
  const [savedRecipe, setsavedRecipe] = useState([]);
  const [user, setuser] = useState([]);
  const [userId, setuserId] = useState("");
  const [userRecipe, setuserRecipe] = useState([]);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [reload, setreload] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const api = await axios.get(`${url}/`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setrecipe(api.data.recipe);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    
    fetchRecipe();
    
    if (isAuthenticated) {
      getSavedRecipeById();
      profile();
    }
    
    if (userId) {
      recipeByUser(userId);
    }
  }, [token, userId, reload, isAuthenticated]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      setisAuthenticated(true);
    }
  }, [token]);

  // register
  const register = async (name, gmail, password) => {
    const api = await axios.post(
      `${url}/register`,
      { name, gmail, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return api;
  };

  const login = async (gmail, password) => {
    try {
      const api = await axios.post(
        `${url}/login`,
        { gmail, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (api.data && api.data.token) {
        setToken(api.data.token);
        setisAuthenticated(true);
        return { success: true, data: api.data };
      } else {
        throw new Error("Login failed - no token received");
      }
    } catch (error) {
      // Clear any existing auth state on failure
        setToken(null);
        setisAuthenticated(false);
        throw error;
    }
  };
  
  // addRecipe
  const addRecipe = async (
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
  ) => {
    const api = await axios.post(
      `${url}/add`,
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      }
    );
    setreload(!reload);
    return api;
  };


  

const updateRecipe = async (id, recipeData) => {
  try {
    const api = await axios.put(
      `${url}/${id}`,
      recipeData,
      {
        headers: {
          "Content-Type": "application/json",
          "Auth": token, // Make sure this matches what your backend expects
        },
        withCredentials: true,
      }
    );
    setreload(!reload);
    return api;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

const deleteRecipe = async (id) => {
  try {
    const api = await axios.delete(
      `${url}/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Auth": token,
        },
        withCredentials: true,
      }
    );
    setreload(!reload);
    return api;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    // Return the error response so it can be handled in the component
    return error.response;
  }
};

  // Update User Settings
  const updateUserSettings = async (updateData) => {
    try {
      const api = await axios.put(
        `${url}/user/settings`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      
      if (api.data.status === 'success') {
        setuser(api.data.user);
      }
      
      return api;
    } catch (error) {
      console.error("Error updating user settings:", error);
      return { data: { status: 'error', message: "Failed to update settings" } };
    }
  };

  // recipeById
  const getRecipeById = async (id) => {
    try {
      const api = await axios.get(`${url}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return api;
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      return { data: { message: "Error fetching recipe" } };
    }
  };

  // save Recipe By Id
  const savedRecipeById = async (id) => {
    try {
      const api = await axios.post(
        `${url}/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      setreload(!reload);
      return api;
    } catch (error) {
      console.error("Error saving recipe:", error);
      return { data: { message: "Error saving recipe" } };
    }
  };

  // getSaved recipe
  const getSavedRecipeById = async () => {
    try {
      const api = await axios.get(`${url}/saved`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      setsavedRecipe(api.data.recipe);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  // profile
  const profile = async () => {
    try {
      const api = await axios.get(`${url}/user`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });
      setuserId(api.data.user._id);
      setuser(api.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // get recipe by userId
  const recipeByUser = async (id) => {
    try {
      const api = await axios.get(`${url}/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setuserRecipe(api.data.recipe);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  // add comment to recipe
  const addComment = async (recipeId, text, rating) => {
    try {
      const api = await axios.post(
        `${url}/${recipeId}/comment`,
        { text, rating },
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      setreload(!reload);
      return api;
    } catch (error) {
      console.error("Error adding comment:", error);
      return { data: { message: "Error adding comment" } };
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setisAuthenticated(false);
    window.location.href = '/'; 
  };

  return (
    <AppContext.Provider
      value={{
        login,
        register,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        recipe,
        getRecipeById,
        getSavedRecipeById,
        savedRecipeById,
        savedRecipe,
        userRecipe,
        user,
        updateUserSettings,
        logOut,
        isAuthenticated,
        setisAuthenticated,
        addComment,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default App_State;