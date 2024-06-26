const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search"); 
const popupBtn = document.getElementById("popup");
const infoContainer = document.getElementById("info-container");
const   showInfo = document.getElementById("show-info");


getRandomMeal();
fetchFavMeals();    





async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = await respData.meals[0];

   

    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealBysearch(term){
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
    );

    const respData = await resp.json();
    const meals = respData.meals;

   

    return meals;

    
}






function removeMealLs(mealId){
    const mealIds = getMealLS();

    localStorage.setItem(
        "mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealLS(){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}
        
function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addMealFav(meal);
    }
}

function addMealFav(mealData) {
    

    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const clear = favMeal.querySelector(".clear");
    clear.addEventListener("click", () =>{
        removeMealLs(mealData.idMeal);

        fetchFavMeals();
    });
    

    favoriteContainer.appendChild(favMeal);
}








function addMeal(mealData, random = false){
   console.log(mealData);
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
    <div class="meal-header">
        ${random ? ` <span class="random">
        Random Recipe   
    </span>` : ''
        }
    
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart"></i>
        </button>
    </div>`
;

const btn = meal.querySelector(".meal-body .fav-btn");

btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
        removeMealLS(mealData.idMeal);
        btn.classList.remove("active");
    } else {
        addMealLS(mealData.idMeal);
        btn.classList.add("active");
    }

  
    fetchFavMeals();
});

meal.addEventListener("click",()=>{
    showMealInfo(mealData);
});



mealsEl.appendChild(meal);
}


searchBtn.addEventListener("click", async ()=>{
    const search = searchTerm.value;

meals = await getMealBysearch(search);

meals.forEach((meal)=>{
    addMeal(meal);
});

   
});

popupBtn.addEventListener("click", ()=>{
    
    infoContainer.classList.add("hidden");
});

function showMealInfo(mealData){

    showInfo.innerHTML = "";
    const showInfoEl = document.createElement("div");
    

    showInfoEl.innerHTML = `
    
    <h2>"${mealData.strMeal}"</h2>
    <img src= 
    "${mealData.strMealThumb}" alt="">

    <p>${mealData.strInstructions}</p>`;

    showInfo.appendChild(showInfoEl);
    infoContainer.classList.remove("hidden");
}