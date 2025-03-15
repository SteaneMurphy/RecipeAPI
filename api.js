import { CONFIG } from "./config.js";

/*
    API QUERIES

    These three API queries fetch the following data from the Spoonacular public API:
        - Multiple recipes based on user search query (10 at a time)
        - Single recipes based on user click and stored recipe id
        - Random recipe based on user click of random button (10 at a time)

    The URL variable stores the individual API endpoint to be used. The user 'query' or
    stored recipe 'id' is passed to the function so that the query is adjusted for the
    user input.

    The 'offset' value that is passed into some of the endpoints

    The fetch request is then called using the predetermined URL variable, its HTTP method
    is applied (GET for fetching data). 
    
    The API key that authorises use of Spoonacular is
    passed to the header using an import from the config script. This script would normally
    be a form of environment file (.env) in development work but requires additional
    libraries. The 'CONFIG.API_KEY' references the stored key variable on the 'CONFIG.js'
    script.

    I chose this method of key use for three reasons:
        - Multiple API calls use the key, changing it in one place prevents having to copy
          and paste the key in various places, especially if the application scaled.
        - Key security: as i was using GIT to track and store changes to the project, I
          wanted to exclude the key from being uploaded to the cloud.
        - Another person wants to use their key, allowing the one variable to be changed
          or an empty 'CONFIG.js' file to be added to the repository for their use.

    After the fetch request, the '.then' function is used to turn the response into a .json
    file. The '.then' function is then used again to return the json data to the parent function
    making the API request.

    The '.catch' function is added to the end of the fetch request, in the event of a failed
    API request, which then returns this error as a console log.
*/

//returns 10 recipes by user provided query value and global offset value.
export function GetRecipesByQuery(query, offset)
{
    const URL = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&offset=${offset}&addRecipeInformation=true`                                

    return fetch(URL,                                                             //fetch request with HTTP type and headers
        { 
            method: "GET",
            headers: 
            {
                "x-api-key": `${CONFIG.API_KEY}`                                  //key imported from 'CONFIG.js'
            }
        })
    .then(response => response.json())                                            //returned response converted to json
    .then(data => 
        {
            return data;                                                          //return json data to parent function
        })
    .catch(error => console.error("GetMultiple failed:", error.message));         //log error message to console
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