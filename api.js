import { CONFIG } from "./config.js";

//returns 10 recipes by user provided query value and global offset value.
export function GetRecipesByQuery(query, offset)
{
    const URL = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&offset=${offset}&addRecipeInformation=true`                                

    return fetch(URL,                                                             
        { 
            method: "GET",
            headers: 
            {
                "x-api-key": `${CONFIG.API_KEY}`                                  
            }
        })
    .then(response => response.json())                                            
    .then(data => 
        {
            return data;                                                        
        })
    .catch(error => console.error("GetMultiple failed:", error.message));         
}

//returns a single recipe by recipe id
export function GetSingleRecipe(id)
{
    const URL = `https://api.spoonacular.com/recipes/${id}/information`

    return fetch(URL, 
        { 
            method: "GET",
            headers: 
            {
                "x-api-key": `${CONFIG.API_KEY}`
            }
        })
    .then(response => response.json())
    .then(data => 
        {
            return data;
        })
    .catch(error => console.error("GetSingle failed:", error.message));
}

//returns 10 random recipes
export function GetRandomRecipes(offset)
{
    const URL = `https://api.spoonacular.com/recipes/complexSearch?sort=random&offset=${offset}&addRecipeInformation=true`

    return fetch(URL, 
        { 
            method: "GET",
            headers: 
            {
                "x-api-key": `${CONFIG.API_KEY}`
            }
        })
    .then(response => response.json())
    .then(data => 
        {
            return data;
        })
    .catch(error => console.error("GetRandom failed:", error.message));
}