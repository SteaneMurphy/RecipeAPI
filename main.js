import { TEST_DATA, TEST_DATA_2 } from "./testData.js";
import { GetRecipesByQuery, GetSingleRecipe, GetRandomRecipes } from "./api.js";

let queryType = "";
let queryOffset = 0;

/* ------------------
   --- COMPONENTS ---
   ------------------ 

    This section contains re-usable components. Each view has a different
    layout but reuses various HTML element blocks. In this way I can
    simply call a component function that returns that HTML block when
    I need it.

    I have commented only one component as the functions used are all the same
    across all component functions. Each component has a short description.

    I chose to use the 'createElement' function to create new HTML elements and the
    'appendChild' function to add these elements to the DOM. For most of the components,
    I have nested multiple elements within a parent element. This parent element is 
    called when I want to display the HTML block, yet contains many different elements.

    For each various element, I use the following properties:
        - .className: adds a class to the element
        - .alt: adds accessibility text to an image element
        - .src: adds a path to an image or other element
        - .placerHolder: adds default text to an input element
        - .textContent: adds text content to a span element
        - .setAttribute: stores a variable in the HTML element for later recall
    
    A final reason for choosing the 'createElement' method of adding elements to the DOM,
    was that the use of 'innerHTML +=' can introduce possible security issues, mainly with
    cross-site scripting or XSS attacks.
*/

//main logo: "FlavorSeek"
const Logo = () => 
{
    const logoContainer = document.createElement("div");
    logoContainer.className = "logoContainer";

    const logo = document.createElement("img");
    logo.className = "logoImage";
    logo.alt = "FlavorSeek main logo";
    logo.src = "assets/LogoBigger3.png"

    logoContainer.appendChild(logo);

    return logoContainer;
};

/*
    Search bar for user input and API queries. Contains an input field and
    button/image.

    An event listener has been added to the input field to detect the enter key being
    pressed when the field is in focus. This listener will then call the API search
    function (SearchOnClick). This function is also attatched to the button element.
*/
const SearchBar = () => 
{
    const searchFieldContainer = document.createElement("div");          //creates a new HTML element
    searchFieldContainer.className = "searchFieldContainer";             //adds a class to the element

    const searchField = document.createElement("input");
    searchField.className = "searchField";
    searchField.id = "searchField";                                      //sets the HTML id parameter of the element
    searchField.placeholder = `${RandomPlaceholder()}`;                  //sets the placeholder text of the element
    searchField.addEventListener("keydown", function(e){                 //event listener for the 'ENTER' key
        if(e.key === "Enter") 
        {
            e.preventDefault();                                          //prevents default behaviour or function call on page load
            SearchOnClick();                                             //API search query function call
        }
    });

    const searchButton = document.createElement("img");
    searchButton.src = "assets/SearchIcon.png";                          //sets image path for button icon
    searchButton.className = "searchButton";
    searchButton.id = "searchButton";
    searchButton.onclick = SearchOnClick;                                //API search query function call on button click

    const randomButton = document.createElement("button");
    randomButton.className = "randomButton";
    randomButton.textContent = "Help Me Decide!";
    randomButton.onclick = RandomOnClick;

    searchFieldContainer.appendChild(searchField);                       //attatches element to parent container
    searchFieldContainer.appendChild(searchButton);
    searchFieldContainer.appendChild(randomButton);

    return searchFieldContainer;                                         //returns bundled HTML element to parent function
};

/*
    Display for each returned recipe in the results view. Contains
    a parent container, image, sub-component 'RecipeCardInfoContainer'.

    This component takes in the returned JSON API results (data), saves each
    results unique id and sets various data points from the API data
    to various HTML elements for display.

    These data points are:
        - recipeCardContainer: id set by 'results.id'
        - recipeImage: set by 'results.image'
        - reciptTitle: set by 'results.title'
        - RecipeScore: sub-component data set by 'results.spoonacularScore'
*/
const RecipeCard = (data) => 
{
    const recipeCardContainer = document.createElement("div");
    recipeCardContainer.className = "recipeCardContainer";
    recipeCardContainer.setAttribute("recipeId", data.id);                      //stores unique recipe id in element
    recipeCardContainer.onclick = () => ExpandRecipe(data.id, recipeCardContainer);

    const recipeImage = document.createElement("img");
    recipeImage.className = "recipeImage";
    recipeImage.src = `${data.image}`;                                          //image path is set to API data's given URL

    const recipeTitle = document.createElement("span");
    recipeTitle.className = "recipeTitle";
    recipeTitle.textContent = `${data.title}`;                                  //title element set by API data

    const recipeSummary = document.createElement("span");
    recipeSummary.className = "recipeSummary truncate";
    recipeSummary.textContent = StripHTMLTags(data.summary);

    const recipeCardInfoContainer = document.createElement("div");
    recipeCardInfoContainer.className = "recipeCardInfoContainer";
    recipeCardInfoContainer.appendChild(recipeTitle);
    recipeCardInfoContainer.appendChild(RecipeScore(data.spoonacularScore));    //sub-component 'recipeScore', score data set by API
    recipeCardInfoContainer.appendChild(recipeSummary);
    let recipeConditionsArray =                                                 //create array of object data for use in 'RecipeConditions'
    [ 
        data.vegetarian, 
        data.vegan, 
        data.glutenFree, 
        data.dairyFree
    ];
    //send 'recipeConditionsArray' to component, append to DOM
    recipeCardInfoContainer.appendChild(RecipeConditions(data.readyInMinutes, recipeConditionsArray));


    recipeCardContainer.appendChild(recipeImage);
    recipeCardContainer.appendChild(recipeCardInfoContainer);

    return recipeCardContainer;
};

/*
    Sub-component of the 'RecipeCard' component. Takes data sent from API
    through its parent (score) and displays on the 'recipeScore' element.

    This elements simply displays a user score on the parent component.
*/
const RecipeScore = (score) => 
{
    const recipeScoreContainer = document.createElement("div");
    recipeScoreContainer.className = "recipeScoreContainer";

    const recipeScoreIcon = document.createElement("img");
    recipeScoreIcon.src = "assets/score.png";
    recipeScoreIcon.className = "recipeScoreIcon";

    const recipeScore = document.createElement("span");
    recipeScore.textContent = `User Score: ${score.toFixed(1)}%`;              //score value is adjusted to 1 decimal place for display
    recipeScore.className = "recipeScore";

    recipeScoreContainer.appendChild(recipeScoreIcon);
    recipeScoreContainer.appendChild(recipeScore);

    return recipeScoreContainer;
};

/*

*/
const RecipeConditions = (time, conditions) =>
{
    const recipeConditionContainer = document.createElement("div");
    recipeConditionContainer.className = "recipeConditionContainer";

    recipeConditionContainer.appendChild(ConditionsSubContainer(`${time} mins`, `cookingTime`, recipeConditionContainer));

    conditions.forEach((condition, index) =>                                                        
        {
            if(condition)
            {
                recipeConditionContainer.appendChild(ConditionsSubContainer(ConditionText(index), `condition${index}`, recipeConditionContainer));
            }                           
        }); 

    return recipeConditionContainer;
};

const ConditionsSubContainer = (text, image, parent) => 
{
    const conditionsSubContainer = document.createElement("div");
    conditionsSubContainer.className = "conditionsSubContainer";

    const recipeConditionIcon = document.createElement("img");
    recipeConditionIcon.className = "recipeConditionIcon";
    recipeConditionIcon.src = `assets/${image}.png`

    const recipeConditionText = document.createElement("span");
    recipeConditionText.className = "recipeConditionText";
    recipeConditionText.textContent = `${text}`;

    conditionsSubContainer.appendChild(recipeConditionIcon);
    conditionsSubContainer.appendChild(recipeConditionText);
    parent.appendChild(conditionsSubContainer);

    return conditionsSubContainer;
};

const CardBreakLine = () => 
{
    const breakLine = document.createElement("hr");

    return breakLine;
};

const NoResultsReturned = () => 
{
    const noResultsText = document.createElement("span");
    noResultsText.className = "noResultsText";
    noResultsText.textContent = `${RandomNoResults()}`;

    return noResultsText;
};

const IngredientsContainer = (ingredientsArray) =>
{
    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.className = "ingredientsContainer";

    const heading = document.createElement("span");
    heading.className = "heading";
    heading.textContent = "Ingredients"

    const ingredients = document.createElement("span");
    ingredients.className = "ingredients";
    ingredientsArray.forEach(ingredient => 
    {
        const listItem = document.createElement("li");
        listItem.textContent = `${ingredient.original}`;
        ingredients.appendChild(listItem);
    });

    ingredientsContainer.appendChild(heading);
    ingredientsContainer.appendChild(ingredients);
    
    return ingredientsContainer;
};

const InstructionsContainer = (data) =>
{
    const instructionsContainer = document.createElement("div");
    instructionsContainer.className = "instructionsContainer";

    const heading = document.createElement("span");
    heading.className = "heading";
    heading.textContent = "Cooking Instructions"

    const instructions = document.createElement("span");
    instructions.className = "instructions";
    let instructionsList = SplitByListItems(data);
    instructionsList.forEach(instruction => 
    {
        const listItem = document.createElement("li");
        listItem.textContent = `${instruction}`;
        instructions.appendChild(listItem);
    });

    instructionsContainer.appendChild(heading);
    instructionsContainer.appendChild(instructions);

    return instructionsContainer;
};

const LoadMoreButton = (queryType) => 
{
    const loadMoreButton = document.createElement("button");
    loadMoreButton.className = "loadMoreButton";
    loadMoreButton.textContent = "Load More Recipes";
    loadMoreButton.setAttribute("resultType", `${queryType}`)
    loadMoreButton.onclick = () => 
    {
        LoadMoreOnClick(queryType);
    };

    return loadMoreButton;
};



/* -------------------------
   --- UTILITY FUNCTIONS ---
   -------------------------
*/

/*
    Array of pre-generated text for the input field text box.
    Designed to provide some personality to the application.
*/
function RandomPlaceholder()
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

function RandomNoResults()
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

function ConditionText(index)
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

function StripHTMLTags(summary) {
    const text = new DOMParser().parseFromString(summary, 'text/html');
    return text.body.textContent || text.body.innerText;
};

function SplitByListItems(summary) {
    return summary
        .split(/<\/?li>/)
        .map(summary => StripHTMLTags(summary.trim()))
        .filter(summary => summary.length > 0);
}

function TruncateText(selector, maxLines) {
    document.querySelectorAll(selector).forEach(element => {    
        const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * maxLines;
        
        while (element.scrollHeight > maxHeight) {
            element.textContent = element.textContent.slice(0, -1);
            element.textContent = element.textContent.trim() + "…";
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
async function SearchOnClick()
{
    ResetGlobals();
    
    let query = document.getElementById("searchField").value;               //gets user input from search input field

    try                                                                     //try this logic, else catch
    {
        let results = await GetRecipesByQuery(query, queryOffset);                       //sends user query to API
        queryType = "STANDARD";
        queryOffset += results.number;
        DisplayResults(results.results);                                            //displays returned results
    }
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
};

async function RandomOnClick()
{
    ResetGlobals();
    
    try                                                                     //try this logic, else catch
    {
        let results = await GetRandomRecipes(queryOffset);                             //sends user query to API
        queryType = "RANDOM";
        queryOffset += results.number;
        DisplayResults(results.results);                                            //displays returned results
    }
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
};

async function ExpandRecipe(id, container)
{
    if(container.classList.contains("expanded"))
    {
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

async function LoadMoreOnClick(queryType)
{
    let query = document.getElementById("searchField").value;               //gets user input from search input field

    try                                                                     //try this logic, else catch
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
    catch (error)                                                           //triggered if await is unsuccessful
    {
        console.log("API did not return any results: ", error);             //error message
    }
}

function ResetGlobals()
{
    queryType = "";
    queryOffset = 0;
};

/* -------------
   --- VIEWS ---
   -------------
*/

/*
    Search results view. This view iterates through all the returned results retreived by the API.
    The API results are sent as an array of objects, each object contains the specific information
    and parameters for each retrieved recipe.

    The function initially receives these results as JSON object 'data' and is then iterated on
    using the 'forEach' function. Step by step:
        - results sent in as an array
        - 'forEach' iterates over this array, one index at a time
        - each index is a unique recipe information object
        - a component 'RecipeCard' is created
        - this component is sent the unique recipe object
        - this component is then appended to its parent container
        - the parent container is then appended to the main container and DOM
*/
function DisplayResults(data)
{
    //checks if container exists, if it does, delete it so a new results container can be displayed
    document.getElementById("resultsContainer") ? document.getElementById("resultsContainer").remove() : null;

    if(data.length == 0)
    {
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsContainer";
        resultsContainer.className = "resultsContainer";
        resultsContainer.appendChild(NoResultsReturned());
        document.getElementById("mainContainer").appendChild(resultsContainer);                  //append to 'mainContainer' (DOM)
    }
    else
    {
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsContainer";
        resultsContainer.className = "resultsContainer";

        data.forEach((recipe, index) =>                                                          //for each index in the array
        {
            resultsContainer.appendChild(RecipeCard(recipe));                                    //create a new 'RecipeCard' component
            index != data.length - 1 ? resultsContainer.appendChild(CardBreakLine()) : null;
        });                                                                                      //append to parent container

        TruncateText(".truncate", 3);
        document.getElementById("mainContainer").appendChild(resultsContainer);                  //append to 'mainContainer' (DOM)

        document.querySelectorAll(".loadMoreButton").forEach(button => 
        {
            button.remove();
        });
        document.getElementById("mainContainer").appendChild(LoadMoreButton("standard"));
    }
}

function DisplayMoreResults(data)
{
    const resultsContainer = document.getElementById("resultsContainer");

    resultsContainer.appendChild(CardBreakLine());

    data.forEach((recipe, index) =>                                                          //for each index in the array
    {
        resultsContainer.appendChild(RecipeCard(recipe));                                    //create a new 'RecipeCard' component
        index != data.length - 1 ? resultsContainer.appendChild(CardBreakLine()) : null;
    }); 
};

/*
    Expanded recipe view.
*/
function DisplaySingleRecipe(data, container)
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