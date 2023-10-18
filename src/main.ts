import { restaurantRow, displayFavoriteRestaurants } from "./components";
import { fetchData, handleRestaurantClick } from "./functions";
import { Restaurant } from "./interfaces/Restaurant";
import { apiUrl, positionOptions } from "./variables";

let restaurants: Restaurant[] = [];

async function fetchDataAndFilterRestaurants() {
  restaurants = await fetchData(apiUrl + "/restaurants");
  createTable(restaurants);
  document.getElementById("search")?.addEventListener("click", () => {
    const searchInput = (
      document.getElementById("search-input") as HTMLInputElement
    ).value.toLowerCase();
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchInput)
    );
    createTable(filteredRestaurants);
  });
}

const modal = document.getElementById("restaurantModal") as HTMLDialogElement;
if (!modal) {
  throw new Error("Modal not found");
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.open) modal.close();
});

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const addClickListenerToRestaurantRow = (
  restaurant: Restaurant,
  tr: HTMLTableRowElement
) => {
  tr.addEventListener("click", () => handleRestaurantClick(restaurant, tr));
};

const createTable = (filteredRestaurants: Restaurant[]) => {
  const table = document.querySelector("table");
  const rows = table?.getElementsByTagName("tr");
  if (rows) {
    Array.from(rows)
      .slice(1)
      .forEach((tr) => tr.remove());
  }

  filteredRestaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    table?.appendChild(tr);
    addClickListenerToRestaurantRow(restaurant, tr);
  });
};

const geolocationError = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const geolocationSuccess = async (pos: GeolocationPosition) => {
  const crd = pos.coords;
  restaurants.sort((a: Restaurant, b: Restaurant) => {
    const x1 = crd.latitude;
    const y1 = crd.longitude;
    const distanceA = calculateDistance(
      x1,
      y1,
      a.location.coordinates[1],
      a.location.coordinates[0]
    );
    const distanceB = calculateDistance(
      x1,
      y1,
      b.location.coordinates[1],
      b.location.coordinates[0]
    );
    return distanceA - distanceB;
  });
  createTable(restaurants);
  filterButtonsInit(restaurants);
};

const filterButtonsInit = (restaurants: Restaurant[]) => {
  document.querySelector("#sodexo")?.addEventListener("click", () => {
    createTable(restaurants.filter((r) => r.company === "Sodexo"));
  });

  document.querySelector("#compass")?.addEventListener("click", () => {
    createTable(restaurants.filter((r) => r.company === "Compass Group"));
  });

  document.querySelector("#reset")?.addEventListener("click", () => {
    createTable(restaurants);
  });
};

const initCloseButtons = () => {
  const closeButtons = document.querySelectorAll(".close-btn");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (event: Event) => {
      const targetElement = event.target as HTMLElement;
      const dialogElement = targetElement.closest(
        "dialog"
      ) as HTMLDialogElement;
      if (dialogElement) {
        dialogElement.close();
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  displayFavoriteRestaurants();
  await fetchDataAndFilterRestaurants();
  filterButtonsInit(restaurants);
  initCloseButtons();
  navigator.geolocation.getCurrentPosition(
    geolocationSuccess,
    geolocationError,
    positionOptions
  );
});

export { modal };
