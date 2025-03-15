import 
{ 
    Logo, 
    SearchBar, 
    RecipeCard, 
    CardBreakLine, 
    NoResultsReturned, 
    IngredientsContainer, 
    InstructionsContainer, 
    LoadMoreButton 
} from "./components.js";

import { TruncateText, ResetGlobals } from "./utility.js";

export function DisplayResults(data)
{
    //checks if container exists, if it does, delete it so a new results container can be displayed
    document.getElementById("resultsContainer") ? document.getElementById("resultsContainer").remove() : null;

    //if no results are returned, display a message and clear globals
    if(data.length == 0)
    {
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsContainer";
        resultsContainer.className = "resultsContainer";
        resultsContainer.appendChild(NoResultsReturned());               
        document.getElementById("mainContainer").appendChild(resultsContainer);                  

        //find all instances of the load more button and remove them, prevent double-ups
        document.querySelectorAll(".loadMoreButton").forEach(button =>                  
            {
                button.remove();
            });

        ResetGlobals();                                                                         
    }
    else
    {
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsContainer";
        resultsContainer.className = "resultsContainer";

        data.forEach((recipe, index) =>                                                          
        {
            resultsContainer.appendChild(RecipeCard(recipe));                                    
            index != data.length - 1 ? resultsContainer.appendChild(CardBreakLine()) : null;     //dont put a breakline under the last 'RecipeCard'
        });                                                                                      

        TruncateText(".truncate", 3);                                                            //trucate the recipe summary text
        document.getElementById("mainContainer").appendChild(resultsContainer);                  

        //find all instances of the load more button and remove to prevent double-ups
        document.querySelectorAll(".loadMoreButton").forEach(button =>                          
        {
            button.remove();
        });
        document.getElementById("mainContainer").appendChild(LoadMoreButton("standard"));       //add a new load more button to bottom of the page
    }
}

/*
    View for appending further results after an intial retrieval.
*/
export function DisplayMoreResults(data)
{
    const resultsContainer = document.getElementById("resultsContainer");

    resultsContainer.appendChild(CardBreakLine());                                           //put a single breakline above the first result, styling reasons

    data.forEach((recipe, index) =>                                                          
    {
        resultsContainer.appendChild(RecipeCard(recipe));                                    
        index != data.length - 1 ? resultsContainer.appendChild(CardBreakLine()) : null;     //don't put a breakline under the last 'RecipeCard' component
    }); 
};

/*
    Expanded recipe view. Appends the new retrieved information to the component.
*/
export function DisplaySingleRecipe(data, container)
{
    container.appendChild(IngredientsContainer(data.extendedIngredients));
    container.appendChild(InstructionsContainer(data.instructions));
}

/*
    Main/Home view. Initial display on page load, main application loop start point.
    Appends the logo and searchbar components to the DOM.
*/
function DisplayPage()
{
    document.getElementById("mainContainer").appendChild(Logo());
    document.getElementById("mainContainer").appendChild(SearchBar());
    ResetGlobals();  
}

//starts the application
DisplayPage();