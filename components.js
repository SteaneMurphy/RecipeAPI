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

export const SearchBar = () => 
{
    const searchFieldContainer = document.createElement("div");          
    searchFieldContainer.className = "searchFieldContainer";             

    const searchField = document.createElement("input");
    searchField.className = "searchField";
    searchField.id = "searchField";                                      
    searchField.placeholder = `${RandomPlaceholder()}`;                  
    searchField.addEventListener("keydown", function(e){                 
        if(e.key === "Enter") 
        {
            e.preventDefault();                                          
            SearchOnClick();                                             
        }
    });

    const searchButton = document.createElement("img");
    searchButton.src = "assets/SearchIcon.png";                          
    searchButton.className = "searchButton";
    searchButton.id = "searchButton";
    searchButton.onclick = SearchOnClick;                                

    const randomButton = document.createElement("button");
    randomButton.className = "randomButton";
    randomButton.textContent = "Help Me Decide!";
    randomButton.onclick = RandomOnClick;                                

    searchFieldContainer.appendChild(searchField);                       
    searchFieldContainer.appendChild(searchButton);
    searchFieldContainer.appendChild(randomButton);

    return searchFieldContainer;                                         
};

export const RecipeCard = (data) => 
{
    const recipeCardContainer = document.createElement("div");
    recipeCardContainer.className = "recipeCardContainer";
    recipeCardContainer.setAttribute("recipeId", data.id);                          
    recipeCardContainer.onclick = () => ExpandRecipe(data.id, recipeCardContainer); 

    const recipeImage = document.createElement("img");
    recipeImage.className = "recipeImage";
    recipeImage.src = `${data.image}`;                                              

    const recipeTitle = document.createElement("span");
    recipeTitle.className = "recipeTitle";
    recipeTitle.textContent = `${data.title}`;                                      

    const recipeSummary = document.createElement("span");
    recipeSummary.className = "recipeSummary truncate";
    recipeSummary.textContent = RemoveHTML(data.summary);

    const recipeCardInfoContainer = document.createElement("div");
    recipeCardInfoContainer.className = "recipeCardInfoContainer";
    recipeCardInfoContainer.appendChild(recipeTitle);
    recipeCardInfoContainer.appendChild(RecipeScore(data.spoonacularScore));       
    recipeCardInfoContainer.appendChild(recipeSummary);
    let recipeConditionsArray =                                                     
    [ 
        data.vegetarian, 
        data.vegan, 
        data.glutenFree, 
        data.dairyFree
    ];

    recipeCardInfoContainer.appendChild(RecipeConditions(data.readyInMinutes, recipeConditionsArray));


    recipeCardContainer.appendChild(recipeImage);
    recipeCardContainer.appendChild(recipeCardInfoContainer);

    return recipeCardContainer;
};

export const RecipeScore = (score) => 
{
    const recipeScoreContainer = document.createElement("div");
    recipeScoreContainer.className = "recipeScoreContainer";

    const recipeScoreIcon = document.createElement("img");
    recipeScoreIcon.src = "assets/score.png";
    recipeScoreIcon.className = "recipeScoreIcon";

    const recipeScore = document.createElement("span");
    recipeScore.textContent = `User Score: ${score.toFixed(1)}%`;              
    recipeScore.className = "recipeScore";

    recipeScoreContainer.appendChild(recipeScoreIcon);
    recipeScoreContainer.appendChild(recipeScore);

    return recipeScoreContainer;
};

export const RecipeConditions = (time, conditions) =>
{
    const recipeConditionContainer = document.createElement("div");
    recipeConditionContainer.className = "recipeConditionContainer";

    //appends the time parameter to the component before looping through the conditions
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

export const CardBreakLine = () => 
{
    const breakLine = document.createElement("hr");

    return breakLine;
};

export const NoResultsReturned = () => 
{
    const noResultsText = document.createElement("span");
    noResultsText.className = "noResultsText";
    noResultsText.textContent = `${RandomNoResults()}`;

    return noResultsText;
};

export const IngredientsContainer = (ingredientsArray) =>
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

export const InstructionsContainer = (data) =>
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