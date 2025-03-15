import { GetRecipesByQuery, GetSingleRecipe, GetRandomRecipes } from "./api.js";
import { DisplayResults, DisplayMoreResults, DisplaySingleRecipe } from "./main.js";

/*
    Global variables used to store the current query type (API endpoint) being used
    and the current amount of recipes loaded. 'queryOffset' is used to tell the 
    API endpoint at which results to continue loading more recipes from.
*/
let queryType = "";
let queryOffset = 0;

/* -------------------------
   --- UTILITY FUNCTIONS ---
   -------------------------
*/

/*
    Array of pre-generated text for the input field text box.
    Designed to provide some personality to the application.
*/
export function RandomPlaceholder()
{
    const placeholderText = 
    [
        "Hungry?",
        "What do you feel like eating?",
        "Looking for dinner ideas?",
        "Searching for the perfect meal?",
        "What’s cooking in your kitchen?",
        "Need help picking a recipe?",
        "What's on the menu today?",
        "Looking for something new to try?",
        "Ready for your next meal adventure?",
    ];

    /*
        Using the 'placeholderText' array, choose a random index number between 0 and the
        length of the array. Return this value to the parent function.
    */
    return placeholderText[Math.floor(Math.random() * placeholderText.length)];
};

/*
    Array of pre-generated text to display when the API returns no results to the user.
    Designed to provide some personality to the application.
*/
export function RandomNoResults()
{
    const noResultsText = 
    [
        "Oops! We couldn’t find that recipe. How about trying something else?",
        "Looks like that dish is playing hide-and-seek! Try a different search.",
        "Hmm, nothing matched! Maybe give another recipe a go?",
        "Oops! That recipe is MIA. Try a different search and let’s get cooking!",
        "Yikes! No results found. Let’s cook up something new!",
        "Uh-oh! That recipe is lost in the sauce. Try a different search!",
        "Looks like that recipe went AWOL. How about trying another dish?",
    ];

        /*
        Using the 'noResultsText' array, choose a random index number between 0 and the
        length of the array. Return this value to the parent function.
    */
    return noResultsText[Math.floor(Math.random() * noResultsText.length)];
};

/*
    String literals for the condition components. The parent component
    uses an index to determine the correct string to return.
*/
export function ConditionText(index)
{
    const conditionText = 
    [
        "Vegetarian",
        "Vegan",
        "GF",
        "DF"
    ];

    return conditionText[index];
};

/*
    This function removes all HTML tags and formatting from a given text or
    string. In the case of this application, the recipe summaries and cooking
    instructions are provided with HTML formatting.

    The function uses the 'DOMParser' class and the 'parseFromString' function
    to read a given text as HTML. The returned variables 'textContent' and 'innerText'
    are just the strings minus any HTML formatting. These variables are returned to the
    parent function for use in display.
*/
export function RemoveHTML(summary) {
    const text = new DOMParser().parseFromString(summary, 'text/html');
    return text.body.textContent || text.body.innerText;
};

/*
    This function takes a text with HTML tags and formatting and splits the
    text into seperate strings. The strings are delimited by the <li></li> tags
    in the text, and a regular expression '/<\/?li>/' is used to determine the
    split point.

    Once an array has been generated of strings, the remaining HTML formatting needs
    to be removed by the 'RemoveHTML' function. This is acheived by iterating over the
    array using the built-in 'map' and 'filter' functions. These functions are specialised
    for each loops.

    The 'map' function is a shorthand way to iterate an array and perform a function on every
    index of that array - in this case removing HTML formatting.

    The 'filter' function is a shorthand way to iterate an array and selectively pull out
    elements in the array that match a condition - in this case, any index that has a length
    greater than 0 (a non empty string).

    The resultant array is returned for display to the parent component.
*/
export function SplitByListItems(summary) {
    return summary
        .split(/<\/?li>/)                               //split on <li>
        .map(summary => RemoveHTML(summary.trim()))     //iterate and remove HTML
        .filter(summary => summary.length > 0);         //iterate and remove blank strings
}

/*
    This function truncates text that is given to it. The 'RecipeCard' sub-component
    'recipeSummary' takes up too much space when the 'RecipeCard' is not expanded.
    This function is designed to limit the visible text so as to not overflow its parent
    container.

    To avoid styling mistakes, this function was chosen because 'Firefox' and other browsers 
    don't natively support the webkit library, otherwise this can be handled by CSS.

    The function finds all elements that need truncating (in this case, anything with the
    'truncate' class attactched). The height of the font is calculated using the
    'getComputedStyle' function and multiplied by the 'maxLines' variable. This sets a maximum
    height the element can be before text is cut off.

    The while loops keeps checking the height of the text element and removes a character until
    this height is reached. The final character is appended to some dots (...) to indicate that
    it has been truncated.
*/
export function TruncateText(selector, maxLines) {
    document.querySelectorAll(selector).forEach(element => {    
        const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * maxLines;
        
        while (element.scrollHeight > maxHeight) {                                      //loop until max height is reached
            element.textContent = element.textContent.slice(0, -1);                     //remove the last text character
            element.textContent = element.textContent.trim() + "…";                     //add '...' to the end of the character array
        }
    });
};

/*
    Sends the user input to the API as a query string.

    This function is an asynchronous function meaning that its execution will be
    paused until the 'await' line is resolved. The await function will either return
    a pass or fail result, the latter triggering the 'catch' logic.

    The 'await' line is waiting on the 'GetRecipesByQuery' function from the 'API.js'
    script. This function is described in further detail there. Once this function
    successfully returns the API data, it is stored in the 'results' variable.

    The 'DisplayResults' function is then called and the retrieved 'results' data
    is sent to it for use in the displayed components.
*/
export async function SearchOnClick()
{
    ResetGlobals();                                                         //resets the global variables

    let query = document.getElementById("searchField").value;               //gets user input from search input field

    try                                                                     //try this logic, else catch
    {
        let results = await GetRecipesByQuery(query, queryOffset);          //sends user query to API
        queryType = "STANDARD";                                             //set global variable queryType
        queryOffset += results.number;                                      //adjust query results start point
        DisplayResults(results.results);                                    //displays returned results
    }
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
};

/*
    This function returns random recipes when the user clicks the 
    'Help Me Decide' button. Functionaly it is the same as the previous function.
*/
export async function RandomOnClick()
{
    ResetGlobals();                                                         //resets the global variables
    
    try                                                                     //try this logic, else catch
    {
        let results = await GetRandomRecipes(queryOffset);                  //sends user query to API
        queryType = "RANDOM";                                               //set global variable queryType
        queryOffset += results.number;                                      //adjust query results start point
        DisplayResults(results.results);                                    //displays returned results
    }
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
};

/*
    This function expands the 'RecipeCard' component. It adds a class to the
    selected component which immediately applies the different styling.

    The function is used as a toggle and either removes or adds this class.
    When it removes the class it also removes the associated extra components
    'ingredientsContainer' and 'instructionsContainer'.

    When expanding, the function calls the 'GetSingleRecipe' endpoint, provides
    the specific recipe id and then displays the results of that API call
    using the 'DisplaySingleRecipe' function.
*/
export async function ExpandRecipe(id, container)
{
    if(container.classList.contains("expanded"))                            //if the class already exists on the component
    {
        //remove the class and associated components
        container.classList.remove("expanded");                              
        const ingredientsContainer = container.querySelector(".ingredientsContainer");
        const instructionsContainer = container.querySelector(".instructionsContainer");
        ingredientsContainer ? ingredientsContainer.remove() : null;
        instructionsContainer ? instructionsContainer.remove() : null;

        const recipeSummary = container.querySelector(".recipeSummary");
        recipeSummary.classList.add("truncate");
    }
    else
    {
        try
        {
            let results = await GetSingleRecipe(id);                        //uses recipe id to return more information
            container.classList.add("expanded");                            //add the expand class to the component
            DisplaySingleRecipe(results, container);                        //display the retreived information
        }
        catch (error)
        {
            console.log("Recipe could not be found by that ID: ", error);
        }
    }
};

/*
    This function is called when the user clicks the 'Load More Recipes'
    button. Depending on the global variables 'queryType' and 'queryOffset',
    the correct API endpoint is called and passed the offset value.

    The returned results are then sent to 'DisplayMoreResults' for display.
    These results are appended to the current parent component, rather than
    re-rendering the entire element.
*/
export async function LoadMoreOnClick(queryType)
{
    let query = document.getElementById("searchField").value;               //gets user input from search input field

    try                                                                     //try this logic, else catch
    {
        if(queryType === "STANDARD")                                        //user input query type
        {
            let results = await GetRecipesByQuery(query, queryOffset);      //fetch more results
            queryOffset += results.number;                                  //adjust offset
            DisplayMoreResults(results.results);                            //append new results to component
        }
        else                                                                //random query type
        {
            let results = await GetRandomRecipes(queryOffset);              //fetch more results
            queryOffset += results.number;                                  //adjust offset
            DisplayMoreResults(results.results);                            //append new results to component
        }
    }
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
}

/*
    Resets the global variables 'queryType' and 'queryOffset.
    These two variables are used to determine the API endpoint being used
    and the start point for a query to the API.
*/
export function ResetGlobals()
{
    queryType = "";
    queryOffset = 0;
};