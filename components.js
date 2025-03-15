import 
{
    RandomPlaceholder,
    RandomNoResults,
    ConditionText,
    RemoveHTML,
    SplitByListItems,
    SearchOnClick,
    RandomOnClick,
    ExpandRecipe,
    LoadMoreOnClick,
} from "./utility.js";

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
export const Logo = () => 
{
    const logoContainer = document.createElement("div");
    logoContainer.className = "logoContainer";

    const logo = document.createElement("img");
    logo.className = "logoImage";
    logo.alt = "FlavorSeek main logo";
    logo.src = "assets/Logo.png"

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
export const SearchBar = () => 
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
    randomButton.onclick = RandomOnClick;                                //API search query function call on button click

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

    The 'ExpandRecipe' function is called when the user clicks on the RecipeCard
    component. This function takes the RecipeCard id value and a reference to
    the parent container.

    These data points are:
        - recipeCardContainer: id set by 'results.id'
        - recipeImage: set by 'results.image'
        - reciptTitle: set by 'results.title'
        - RecipeScore: sub-component data set by 'results.spoonacularScore'
*/
export const RecipeCard = (data) => 
{
    const recipeCardContainer = document.createElement("div");
    recipeCardContainer.className = "recipeCardContainer";
    recipeCardContainer.setAttribute("recipeId", data.id);                          //stores unique recipe id in element
    recipeCardContainer.onclick = () => ExpandRecipe(data.id, recipeCardContainer); //expands the RecipeCard component

    const recipeImage = document.createElement("img");
    recipeImage.className = "recipeImage";
    recipeImage.src = `${data.image}`;                                              //image path is set to API data's given URL

    const recipeTitle = document.createElement("span");
    recipeTitle.className = "recipeTitle";
    recipeTitle.textContent = `${data.title}`;                                      //title element set by API data

    const recipeSummary = document.createElement("span");
    recipeSummary.className = "recipeSummary truncate";
    recipeSummary.textContent = RemoveHTML(data.summary);

    const recipeCardInfoContainer = document.createElement("div");
    recipeCardInfoContainer.className = "recipeCardInfoContainer";
    recipeCardInfoContainer.appendChild(recipeTitle);
    recipeCardInfoContainer.appendChild(RecipeScore(data.spoonacularScore));        //sub-component 'recipeScore', score data set by API
    recipeCardInfoContainer.appendChild(recipeSummary);
    let recipeConditionsArray =                                                     //create array of object data for use in 'RecipeConditions'
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
export const RecipeScore = (score) => 
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
    Sub-component of the 'RecipeCard' component. Takes the following API
    data points and displays the information based upon their status:
        - time: the cooking time
        - condition0: Vegetarian (bool)
        - condition1: Vegan (bool)
        - condition2: Gluten-free (bool)
        - condition3: Dairy-free (bool)
*/
export const RecipeConditions = (time, conditions) =>
{
    const recipeConditionContainer = document.createElement("div");
    recipeConditionContainer.className = "recipeConditionContainer";

    //appends the time parameter to the component before looping through the conditions
    recipeConditionContainer.appendChild(ConditionsSubContainer(`${time} mins`, `cookingTime`, recipeConditionContainer));

    /*
        For each condition parameter, if it is true, display the correct icon and text.
        The index number matches the condition icon name. This result is appended to the parent container
        for display.
    */
    conditions.forEach((condition, index) =>                                                        
        {
            if(condition)
            {
                recipeConditionContainer.appendChild(ConditionsSubContainer(ConditionText(index), `condition${index}`, recipeConditionContainer));
            }                           
        }); 

    return recipeConditionContainer;
};

/*
    Sub-component for the 'RecipeConditions' component. Displays the correct
    icon image and text based on the information calculated and sent in the
    parent component.
*/
export const ConditionsSubContainer = (text, image, parent) => 
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

/*
    Break-line component for styling purposes.
*/
export const CardBreakLine = () => 
{
    const breakLine = document.createElement("hr");

    return breakLine;
};

/*
    Text component for when no results are returned from the API endpoint.
    A randomised cheerful text is chosen to communicate this to the user.
    This function is 'RandomNoResults'.
*/
export const NoResultsReturned = () => 
{
    const noResultsText = document.createElement("span");
    noResultsText.className = "noResultsText";
    noResultsText.textContent = `${RandomNoResults()}`;

    return noResultsText;
};

/*
    Sub-component for the 'RecipeCard' component. This component displays a list of ingredients
    passed to it via its parent component via 'ingredientsArray'. 

    The forEach function iterates through the array and creates a new list element for
    each index. It then appends each list element to its parent container for display.
*/
export const IngredientsContainer = (ingredientsArray) =>
{
    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.className = "ingredientsContainer";

    const heading = document.createElement("span");
    heading.className = "heading";
    heading.textContent = "Ingredients"

    const ingredients = document.createElement("span");
    ingredients.className = "ingredients";
    ingredientsArray.forEach(ingredient =>                              //for each array item, create/append new list element
    {
        const listItem = document.createElement("li");
        listItem.textContent = `${ingredient.original}`;
        ingredients.appendChild(listItem);
    });

    ingredientsContainer.appendChild(heading);
    ingredientsContainer.appendChild(ingredients);
    
    return ingredientsContainer;
};

/*
    Sub-component for the 'RecipeCard' component. This component displays
    a list of cooking instructions sent to it as a text. Before the text
    can be displayed, it has to be sanitised. The text is sent to the 
    function 'SplitByListItems' which removes HTML tags and formatting, 
    and then splits each instruction by the <li></li> tags imbedded in the
    original text. Further information on this function is provided in its
    respective script.

    Similar to the 'IngredientsContainer' component, once this list is 
    generated, the forEach loop creates and appends each list item to its
    parent container for display.
*/
export const InstructionsContainer = (data) =>
{
    const instructionsContainer = document.createElement("div");
    instructionsContainer.className = "instructionsContainer";

    const heading = document.createElement("span");
    heading.className = "heading";
    heading.textContent = "Cooking Instructions"

    const instructions = document.createElement("span");
    instructions.className = "instructions";
    let instructionsList = SplitByListItems(data);                      //removes HTML formatting from text, splits text into seperate strings
    instructionsList.forEach(instruction =>                             //for each array item, create/append new list element
    {
        const listItem = document.createElement("li");
        listItem.textContent = `${instruction}`;
        instructions.appendChild(listItem);
    });

    instructionsContainer.appendChild(heading);
    instructionsContainer.appendChild(instructions);

    return instructionsContainer;
};

/*
    This component loads a further 10 recipes from either the
    'GetRecipesByQuery' or 'GetRandomRecipes' API endpoints.

    This function calls the 'LoadMoreOnClick' function which 
    takes the global querytype state and uses the appropriate
    API endpoint to generate more recipes.
*/
export const LoadMoreButton = (queryType) => 
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