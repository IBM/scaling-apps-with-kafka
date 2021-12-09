let dropdownDOM = document.getElementById('restaurantDropdown');

async function startGettingRestaurants() {
  let backend_url = await getBackendURL();
  let restaurants = await getRestaurants(250, backend_url);

  showRestaurants(dropdownDOM, restaurants);
}

startGettingRestaurants();