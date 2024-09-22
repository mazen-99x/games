let api_key = "a54ae990141a49038640374dd2d86d2d";
let GameList = [];
let valueDisplays = document.querySelectorAll(".num");
let user = document.querySelector(".user");
let items = document.getElementById("items");
let offsetup = $("#game").offset().top;
let button = document.querySelector(".header .button");
let buttons = document.querySelector("#header .buttons");
let signout = document.querySelector(".signout");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmMessage = document.getElementById("confirmMessage");
let open_btn = document.querySelector(".btn_open_menu");
let header = document.querySelector(".header");
open_btn.addEventListener("click", function () {
  header.classList.toggle("active");
});
let num = document.querySelectorAll(".num");
let stats = document.querySelector(".stats");
let started = false;

window.onscroll = function () {
  if (window.scrollY >= stats.offsetTop) {
    if (!started) {
      num.forEach((num) => {
        startCount(num);
      });
    }
    started = true;
  }
};
function startCount(el) {
  let goal = el.dataset.goal;
  let counter = setInterval(() => {
    el.textContent++;
    if (el.textContent == goal) {
      clearInterval(counter);
    }
  }, 2000 / goal);
}
$("#gototop").on("click", function () {
  $("body,html").animate({ scrollTop: 0 }, 2000);
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
$(window).on("scroll", function () {
  let scrollup = $(window).scrollTop();
  if (scrollup >= offsetup) {
    $(".header").removeClass("bg-white").addClass("bgs");
    $("#gototop").fadeIn(1000);
  } else {
    $(".header").addClass("bg-white").removeClass("bgs");
    $("#gototop").fadeOut(1000);
  }
});
$(".header ul li a")
  .slice(-2)
  .on("click", function (e) {
    e.preventDefault(); // Prevent the default behavior of the anchor
    let hrefEl = $(e.target).attr("href");
    let offset = $(hrefEl).offset().top;
    console.log(hrefEl);
    $("body,html").animate({ scrollTop: offset }, 2000);
  });

// Hide loading screen after document is ready
$(document).ready(function () {
  $(".loading").fadeOut(2000, function () {
    $(".loading").css("display", "none");
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

// Fetch games from the API
async function getGames() {
  try {
    let data = await fetch(
      `https://api.rawg.io/api/games?key=${api_key}&page_size=12&ordering=-rating`
    );
    let req = await data.json();
    GameList = req.results;
    display();
  } catch (error) {
    console.error("Error fetching games:", error);
    items.innerHTML = `<p class="error">Failed to load games. Please try again later.</p>`;
  }
}

// Display fetched games on the page
function display() {
  GameList.forEach((ele) => {
    let item = document.createElement("div");
    let genres = ele.genres.map((genre) => genre.name).join(", ");
    let platforms = ele.platforms
      .slice(0, 1)
      .map((platform) => platform.platform.name)
      .join(", ");
    item.classList.add("item");

    // Limit game name and genre if they are too long
    let name =
      ele.name.length > 20 ? ele.name.substring(0, 20) + "..." : ele.name;
    let genre = genres.length > 30 ? genres.substring(0, 30) + "..." : genres;

    item.innerHTML = `
      <a onclick="getDetails(${ele.id})" href="./details.html">
        <img src="${ele.background_image}" alt="${ele.name}">
      </a>
      <div class="content">
        <p class="name">Name: <span>${name}</span></p>
        <p class="rating">Rating: <span>${ele.rating}</span></p>
        <p class="genre">Genre: <span>${genre}</span></p>
        <p class="platform">Platform: <span>${platforms + " , ..."}</span></p>
      </div>
    `;
    items.appendChild(item);
  });
}

// Redirect to details page and store game ID
async function getDetails(id) {
  localStorage.setItem("gameId", id); // Store game ID in localStorage
  window.location.href = "details.html"; // Redirect to details page
}

// Initial call to get games
getGames();
