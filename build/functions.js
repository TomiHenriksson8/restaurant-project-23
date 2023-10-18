import { apiUrl } from "./variables";
import { restaurantModal } from "./components";
import { modal } from "./main";
const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status} occurred`);
    }
    const json = await response.json();
    const favoriteRestaurant = localStorage.getItem('favoriteRestaurant');
    if (favoriteRestaurant) {
        console.log('Your favorite restaurant is:', JSON.parse(favoriteRestaurant));
    }
    return json;
};
async function handleRestaurantClick(restaurant, tr) {
    const allHighs = document.querySelectorAll(".highlight");
    allHighs.forEach((high) => {
        high.classList.remove("highlight");
    });
    tr.classList.add("highlight");
    modal.innerHTML = "";
    const renderMenu = async (type) => {
        let menu;
        try {
            if (type === "daily") {
                menu = await fetchData(apiUrl + `/restaurants/daily/${restaurant._id}/fi`);
            }
            else {
                menu = await fetchData(apiUrl + `/restaurants/weekly/${restaurant._id}/fi`);
            }
            // console.log(`Received ${type} Menu:`, menu);
            const newMenuHtml = restaurantModal(restaurant, menu, type);
            modal.innerHTML = newMenuHtml;
        }
        catch (error) {
            // console.error(`Failed to fetch ${type} menu:`, error);
        }
        attachMenuListeners();
    };
    const attachMenuListeners = () => {
        const dailyMenuButton = document.getElementById("dailyMenu");
        dailyMenuButton?.addEventListener("click", () => renderMenu("daily"));
        const weeklyMenuButton = document.getElementById("weeklyMenu");
        weeklyMenuButton?.addEventListener("click", () => renderMenu("weekly"));
    };
    renderMenu("daily");
    modal.showModal();
}
export { fetchData, handleRestaurantClick };
