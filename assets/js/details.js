let api_key = "a54ae990141a49038640374dd2d86d2d";
let gameId = localStorage.getItem("gameId");
let items_detail = document.getElementById("container-details");
let trailerContainer = document.querySelector(".swiper-wrapper");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmMessage = document.getElementById("confirmMessage");
let user = document.querySelector(".user");
let button = document.querySelector(".header .button");
let buttons = document.querySelector("#header .buttons");
let signout = document.querySelector(".signout");
let open_btn = document.querySelector(".btn_open_menu");
let header = document.querySelector(".header");
open_btn.addEventListener("click", function () {
  header.classList.toggle("active");
});
$("#gototop").on("click", function () {
  $("body,html").animate({ scrollTop: 0 }, 1000);
});
buttons.style.display = "none";
if (localStorage.getItem("userName") != null) {
  button.style.display = "none";
  buttons.style.display = "flex";

  user.innerHTML = `welcome ${localStorage.getItem("userName")}`;
}
function Signout() {
  localStorage.removeItem("userName");
  button.style.display = "block";
  buttons.style.display = "none";
  window.location.href = "index.html";
}

$(document).ready(function () {
  $(".loading").fadeOut(2000, function () {
    $(".loading").css("display", "none");
    ("");
  });
});
// Function to show the confirmation modal
function showConfirmModal(message, onConfirm, onCancel) {
  // Set the confirmation message
  confirmMessage.innerText = message;

  // Display the modal
  confirmModal.classList.add("show");

  // Handle confirmation
  confirmYes.onclick = function () {
    confirmModal.classList.remove("show"); // Hide modal
    if (onConfirm) onConfirm(); // Execute confirm action
  };

  // Handle cancellation
  confirmNo.onclick = function () {
    confirmModal.classList.remove("show"); // Hide modal
    if (onCancel) onCancel(); // Execute cancel action
  };
}

// Example usage
document.querySelector(".signout").addEventListener("click", function () {
  showConfirmModal(
    "Are you sure you want to Signout?",
    function () {
      Signout();
    },
    function () {
      // Cancellation action
      return;
    }
  );
});
async function getDetails() {
  // Retrieve game ID from localStorage
  if (!gameId) return; // Ensure game ID exists

  let data = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${api_key}`
  );
  let GameDetails = await data.json();

  displayDetails(GameDetails);
}

function displayDetails(details) {
  let item_detail = document.createElement("div");
  item_detail.classList.add("item_detail");
  let {
    background_image,
    name,
    released,
    description_raw,
    rating,
    genres,
    platforms,
    publishers,
    website,
  } = details;
  let shortDescription =
    description_raw.length > 200
      ? description_raw.slice(0, 200) + "..."
      : description_raw;
  document.title = "GamesReaper " + `${name}`;
  let platformsList = platforms
    .map((platform) => platform.platform.name)
    .join(", "); // Get platform names

  let gen = genres.map((gener) => gener.name).join(", ");
  console.log(gen);
  let publishersList = publishers.map((publisher) => publisher.name).join(", ");
  item_detail.innerHTML = `
    <div class="image">
      <img src="${background_image}" alt="${name}">
    </div>
    <div class="content">
      <h2 class="name">${name}</h2>
      <p class="release">Released: ${released}</p>
      <p class="type">description:</p>
      <p class="description">${shortDescription}</p>
      <p class="rating">Rating : <span>${rating}</span></p>
      <p class="platforms">Genres : <span>${gen}</span></p>
      <p class="platforms">Platforms: <span>${platformsList}</span></p>
      <p class="platforms">Publishers: <span>${publishersList}</span></p>
      <a class="website" target="_blanck" href="${website}">Game Website</a>
    </div>

    
  `;
  items_detail.appendChild(item_detail);
}
async function getTrailers() {
  try {
    let response = await fetch(
      `https://api.rawg.io/api/games/${gameId}/movies?key=${api_key}`
    );
    let data = await response.json();

    // Check if there are any trailers available
    if (data.results.length > 0) {
      displayTrailers(data.results); // Pass all trailers to display
      document.querySelector(".swiper-button-prev").style.display = "block";
      document.querySelector(".swiper-button-next").style.display = "block";
    } else {
      trailerContainer.innerHTML = `No Available Trailer`;
      trailerContainer.style.display = "flex";
      trailerContainer.style.justifyContent = "center"; // Horizontally center
      trailerContainer.style.alignItems = "center"; // Vertically center
      trailerContainer.style.fontSize = "24px"; // Font size for text
      trailerContainer.style.backgroundColor = "#12272c"; // Corrected background color
      trailerContainer.style.width = "100%";
      trailerContainer.style.height = "400px";
    }
  } catch (error) {
    console.error("Error fetching trailers:", error);
    trailerContainer.innerHTML = `<p class="error">Failed to load trailers. Please try again later.</p>`;
  }
}

// Function to display all trailers on the page
function displayTrailers(trailers) {
  trailers.forEach((trailer) => {
    let trailerElement = document.createElement("div");
    trailerElement.classList.add("swiper-slide");

    trailerElement.innerHTML = `
      <video controls>
        <source src="${trailer.data.max}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    trailerContainer.appendChild(trailerElement);
  });

  // Initialize Swiper after adding slides
  var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChange: function () {
        // Pause video in the previously active slide
        const activeSlide = document.querySelector(
          ".swiper-slide-active video"
        );
        if (activeSlide) {
          activeSlide.pause();
        }
      },
    },
  });
}

// Call the getTrailers function when the page loads
getTrailers();

getDetails(); // Fetch and display the game details
