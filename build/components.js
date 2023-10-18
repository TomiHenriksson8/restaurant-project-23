import { handleRestaurantClick } from "./functions";
const addFavoriteRestaurant = (restaurant) => {
    const favoriteRestaurantsData = localStorage.getItem("favoriteRestaurants");
    let favoriteRestaurants = [];
    if (favoriteRestaurantsData) {
        favoriteRestaurants = JSON.parse(favoriteRestaurantsData);
        if (favoriteRestaurants.some((r) => r._id === restaurant._id)) {
            alert(`${restaurant.name} is already one of your favorite restaurants.`);
            return;
        }
    }
    favoriteRestaurants.push(restaurant);
    localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
    alert(`${restaurant.name} has been added to your favorite restaurants.`);
    displayFavoriteRestaurants();
};
const removeFavoriteRestaurant = (id) => {
    const favoriteRestaurantsData = localStorage.getItem("favoriteRestaurants");
    if (!favoriteRestaurantsData)
        return;
    const favoriteRestaurants = JSON.parse(favoriteRestaurantsData);
    const updatedFavorites = favoriteRestaurants.filter((restaurant) => restaurant._id !== id);
    localStorage.setItem("favoriteRestaurants", JSON.stringify(updatedFavorites));
    displayFavoriteRestaurants();
};
const restaurantRow = (restaurant) => {
    const { name, address, company } = restaurant;
    const tr = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerText = name;
    const addressCell = document.createElement("td");
    addressCell.innerText = address;
    const companyCell = document.createElement("td");
    companyCell.classList.add("restaurant-group");
    companyCell.innerText = company;
    const favoriteCell = document.createElement("td");
    const favoriteButton = document.createElement("button");
    favoriteButton.innerText = "Favorite";
    favoriteButton.classList.add("favorite-btn");
    favoriteButton.onclick = () => addFavoriteRestaurant(restaurant);
    favoriteCell.appendChild(favoriteButton);
    tr.appendChild(nameCell);
    tr.appendChild(addressCell);
    tr.appendChild(companyCell);
    tr.appendChild(favoriteCell);
    return tr;
};
const restaurantModal = (restaurant, menu, type) => {
    const { name, address, city, postalCode, phone, company } = restaurant;
    let html = `
      <h3>${name}</h3>
      <p>${company}</p>
      <p>${address} ${postalCode} ${city}</p>
      <p>${phone}</p>
      <!-- Adding the buttons here -->
      <div class="menu-buttons">
          <button id="dailyMenu">Daily Menu</button>
          <button id="weeklyMenu">Weekly Menu</button>
      </div>
      <!-- Placeholders for both daily and weekly menus -->
      <div id="dailyMenuContent" style="display:${type === 'daily' ? 'block' : 'none'};">
          <table>
              <tr>
                  <th>Course</th>
                  <th>Diet</th>
                  <th>Price</th>
              </tr>
  `;
    if (type === "daily" && menu.courses) {
        menu.courses.forEach((course) => {
            const { name, diets, price } = course;
            html += `
              <tr>
                  <td>${name}</td>
                  <td>${diets ?? " - "}</td>
                  <td>${price ?? " - "}</td>
              </tr>
          `;
        });
    }
    html += "</table></div>";
    html += `
      <div id="weeklyMenuContent" style="display:${type === 'weekly' ? 'block' : 'none'};">
          <table>
              <tr>
                  <th>Course</th>
                  <th>Diet</th>
                  <th>Price</th>
              </tr>
  `;
    if (type === "weekly" && menu.days) {
        menu.days.forEach((day) => {
            html += `<h4>${day.date}</h4>`;
            day.courses.forEach((course) => {
                const { name, diets, price } = course;
                html += `
                  <tr>
                      <td>${name}</td>
                      <td>${diets ?? " - "}</td>
                      <td>${price ?? " - "}</td>
                  </tr>
              `;
            });
        });
    }
    html += "</table></div>";
    return html;
};
const errorModal = (message) => {
    const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
    return html;
};
const displayFavoriteRestaurants = () => {
    const favoriteRestaurantsData = localStorage.getItem("favoriteRestaurants");
    const favoritesSection = document.getElementById("favorites-section");
    if (favoritesSection)
        favoritesSection.innerHTML = "";
    if (favoriteRestaurantsData && favoritesSection) {
        const favoriteRestaurants = JSON.parse(favoriteRestaurantsData);
        if (favoriteRestaurants.length === 0) {
            favoritesSection.style.display = "none";
            return;
        }
        else {
            favoritesSection.style.display = "flex";
        }
        const heading = document.createElement("h3");
        heading.innerText = "Favorite Restaurants:";
        favoritesSection.appendChild(heading);
        favoriteRestaurants.forEach((restaurant) => {
            const restaurantButton = document.createElement("button");
            restaurantButton.innerText = restaurant.name;
            restaurantButton.classList.add("restaurant-button");
            restaurantButton.onclick = (event) => {
                event.stopPropagation();
                handleRestaurantClick(restaurant, restaurantButton);
            };
            const removeButton = document.createElement("button");
            removeButton.innerText = "X";
            removeButton.classList.add("remove-button");
            removeButton.onclick = (event) => {
                event.stopPropagation();
                removeFavoriteRestaurant(restaurant._id);
            };
            restaurantButton.appendChild(removeButton);
            favoritesSection.appendChild(restaurantButton);
        });
    }
};
export { restaurantRow, restaurantModal, errorModal, displayFavoriteRestaurants, };
