import { CONFIG } from "./config.js";

function getRecipeBySearch()
{
    const URL = `https://api.spoonacular.com/recipes/complexSearch?query=pasta`

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
            console.log(data);
            return data;
        })
    .catch(error => console.error("Request failed:", error.message));
}

//getRecipeBySearch();