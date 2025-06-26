const API_URL = "https://country-server-p.onrender.com/countries"

document.addEventListener("DOMContentLoaded" ,() => {
const countriesDiv = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const favoritesList = document.getElementById('favorite-countries');
const detailsDiv = document.getElementById('country-details')
//fetch from json server
async function fetchCountries(){
    const res = await fetch(API_URL)
    const countries = await res.json()
    renderCountries(countries)
}

async function fetchFavorites(){
    const res = await fetch(API_URL)
     const countries = await res.json()  
     const favorites = countries.filter(c=> c .favorite)
     renderFavorites(favorites) 
    
}

//render countries
function renderCountries (countries){
  countriesDiv.innerHTML = ''
  countries.forEach(country => {
    const div = document.createElement('div')
    div.innerHTML =`
    <img src="${country.flag}" >
    <h3>${country.name}</h3>
    <p>${country.capital}</p>
    <p>${country.region}</p>
    <button class="details-btn">View Details</button>
    <button class="fav-btn">${country.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>`
    
     // View details
    div.querySelector('.details-btn').addEventListener('click', () => {
      showCountryDetails(country);
    });

    // Toggle favorite
    div.querySelector('.fav-btn').addEventListener('click', () => {
      toggleFavorite(country);
    });
   
     countriesDiv.appendChild(div)
  
  });
} 
    ///showing details on another section
  function showCountryDetails(country){
       
        detailsDiv.innerHTML=`
        <img src="${country.flag}" >
        <h3>${country.name}</h3>
        <p>${country.capital}</p>
         <p>${country.region}</p>
         <p>${country.details}</p>`
     } 

// Toggle favorite status
  async function toggleFavorite(country) {
   const updated = { ...country, favorite: !country.favorite };

  await fetch(`http://localhost:3001/countries/${country.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  }); 

    fetchCountries()
    fetchFavorites()
 }   

     //render favorites
function renderFavorites (favorites){
   favoritesList.innerHTML = ''
   favorites.forEach(country => {
    const div = document.createElement('div')
   div.innerHTML = `
  <img src="${country.flag}" alt="${country.name}">  
   <span>${country.name}</span>`
   
   favoritesList.appendChild(div)

  });
   }  
 
   // 3. Search by name
  searchInput.addEventListener('input', async () => {
  const searchText = searchInput.value.toLowerCase()
  const res = await fetch(API_URL);
  const countries = await res.json();

  const matchingCountries = countries.filter(country =>
  country.name.toLowerCase().includes(searchText)
);

  renderCountries(matchingCountries);
});

// 4. Filter by region
  regionFilter.addEventListener('change', async () => {
  const selectedRegion = regionFilter.value;

  const response = await fetch(API_URL);
  const countries = await response.json();
    
     let filteredCountries
    
    
  if(selectedRegion === 'All'){
    filteredCountries = countries
  }else{
    filteredCountries = countries.filter(country =>country.region===
    selectedRegion
    )
  } 

  renderCountries(filteredCountries);
});

  fetchCountries();
  fetchFavorites();
})




    