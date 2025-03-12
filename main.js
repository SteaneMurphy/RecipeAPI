import { CONFIG } from "./config.js";
import { TEST_DATA } from "./testData.js";

function GetRecipeByType()
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

function GetRecipeByName()
{

}

/*
    Default View
*/

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

const SearchBar = () => 
{
    //using the 'createElement' to add to the DOM as using strings and innerHTML can
    //be a XSS vulnerbility
    const searchFieldContainer = document.createElement("div");
    searchFieldContainer.className = "searchFieldContainer";

    const searchField = document.createElement("input");
    searchField.className = "searchField";
    searchField.placeholder = `${RandomPlaceholder()}`;
    searchField.addEventListener("keydown", function(e){
        if(e.key === "Enter") 
        {
            SearchOnClick();
        }
    });

    const searchButton = document.createElement("img");
    searchButton.src = "assets/SearchIcon.png";
    searchButton.className = "searchButton";
    searchButton.onclick = SearchOnClick;

    searchFieldContainer.appendChild(searchField);
    searchFieldContainer.appendChild(searchButton);

    return searchFieldContainer;
};

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

    return placeholderText[Math.floor(Math.random() * placeholderText.length)];
}

function SearchOnClick()
{
    console.log(TEST_DATA[0][0]);
    DisplayResults(TEST_DATA[0]);
}

/*
    Search Results View
*/

const recipeCard = (data) => 
{
    const recipeCardContainer = document.createElement("div");
    recipeCardContainer.className = "recipeCardContainer";
    recipeCardContainer.setAttribute("recipeId", data.id);

    const recipeImage = document.createElement("img");
    recipeImage.className = "recipeImage";
    recipeImage.src = `${data.image}`;

    const recipeTitle = document.createElement("span");
    recipeTitle.className = "recipeTitle";
    recipeTitle.textContent = `${data.title}`;

    recipeCardContainer.appendChild(recipeTitle);
    recipeCardContainer.appendChild(recipeImage);

    return recipeCardContainer;
};

function DisplayResults(data)
{
    document.getElementById("resultsContainer") ? document.getElementById("resultsContainer").remove() : null;

    const resultsContainer = document.createElement("div");
    resultsContainer.id = "resultsContainer";
    resultsContainer.className = "resultsContainer";
    
    data.forEach(recipe => 
    {
        resultsContainer.appendChild(recipeCard(recipe));
    });

    document.getElementById("mainContainer").appendChild(resultsContainer);
}

/*
    Main Application Loop
*/
function DisplayPage()
{
    document.getElementById("mainContainer").appendChild(Logo());
    document.getElementById("mainContainer").appendChild(SearchBar());   
}

DisplayPage();
//GetRecipeByType();