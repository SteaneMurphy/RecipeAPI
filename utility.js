import { GetRecipesByQuery, GetSingleRecipe, GetRandomRecipes } from "./api.js";
import { DisplayResults, DisplayMoreResults, DisplaySingleRecipe } from "./main.js";

let queryType = "";
let queryOffset = 0;

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

    return placeholderText[Math.floor(Math.random() * placeholderText.length)];
};

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

    return noResultsText[Math.floor(Math.random() * noResultsText.length)];
};

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

export function RemoveHTML(summary) {
    const text = new DOMParser().parseFromString(summary, 'text/html');
    return text.body.textContent || text.body.innerText;
};

export function SplitByListItems(summary) {
    return summary
        .split(/<\/?li>/)                               //split on <li>
        .map(summary => RemoveHTML(summary.trim()))     //iterate and remove HTML
        .filter(summary => summary.length > 0);         //iterate and remove blank strings
}

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

export async function SearchOnClick()
{
    ResetGlobals();                                                         

    let query = document.getElementById("searchField").value;               

    try                                                                     
    {
        let results = await GetRecipesByQuery(query, queryOffset);          
        queryType = "STANDARD";                                             
        queryOffset += results.number;                                      
        DisplayResults(results.results);                                    
    }
    catch (error)                                                           
    {
        console.log("API did not return any results: ", error);             
    }
};

export async function RandomOnClick()
{
    ResetGlobals();                                                         
    
    try                                                                     
    {
        let results = await GetRandomRecipes(queryOffset);                  
        queryType = "RANDOM";                                               
        queryOffset += results.number;                                      
        DisplayResults(results.results);                                    
    }
    catch (error)                                                           
    {
        console.log("API did not return any results: ", error);             
    }
};

export async function ExpandRecipe(id, container)
{
    if(container.classList.contains("expanded"))                            
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
            let results = await GetSingleRecipe(id);                        
            container.classList.add("expanded");                            
            DisplaySingleRecipe(results, container);                        
        }
        catch (error)
        {
            console.log("Recipe could not be found by that ID: ", error);
        }
    }
};

export async function LoadMoreOnClick(queryType)
{
    let query = document.getElementById("searchField").value;               

    try                                                                     
    {
        if(queryType === "STANDARD")                                        
        {
            let results = await GetRecipesByQuery(query, queryOffset);      
            queryOffset += results.number;                                  
            DisplayMoreResults(results.results);                            
        }
        else                                                                
        {
            let results = await GetRandomRecipes(queryOffset);              
            queryOffset += results.number;                                  
            DisplayMoreResults(results.results);                            
        }
    }
    catch (error)                                                           
    {
        console.log("API did not return any results: ", error);             
    }
}

export function ResetGlobals()
{
    queryType = "";
    queryOffset = 0;
};