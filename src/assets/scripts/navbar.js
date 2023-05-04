// Get the elements needed
const toggleBtn = document.getElementById("toggleBtn");
const closeBtn = document.getElementById("closeBtn");
const header = document.getElementById("header");
const sidenav = document.getElementById("modal");
const body = document.querySelector("body");

// Get the previous scroll position
let prevScrollpos = window.pageYOffset;

// Get the current state of the menu
const isOpened = toggleBtn.getAttribute("aria-expanded") === "true";
// Add event listeners
toggleBtn.addEventListener("click", () => {
  openMenu();
});
closeBtn.addEventListener("click", () => {
  closeMenu();
});
//accessibility for keyboard users
toggleBtn.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === "Space") {
    openMenu();
  }
});
closeBtn.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === "Space") {
    closeMenu();
  }
});

//on page load check if the page is already scrolled, if so add active class to header
window.addEventListener("load", function () {
  addRemoveHeaderClassOnScroll(window.scrollY);
});
// Add event listener to the window for scroll events
window.addEventListener("scroll", function () {
  // Get the current scroll position
  let currentScrollPos = window.pageYOffset;
  // If the previous scroll position is greater than the current scroll position, show the header
  if (prevScrollpos > currentScrollPos || window.scrollY < 80) {
    header.style.top = "0";
  } else {
    // If the previous scroll position is less than the current scroll position, hide the header
    header.style.top = "-80px";
  }
  // If the current scroll position is greater than 150, add the class "active" to the header element
  addRemoveHeaderClassOnScroll(currentScrollPos);

  // Set the previous scroll position to the current scroll position
  prevScrollpos = currentScrollPos;
});
// Function to add or remove the class "active" from the header element
function addRemoveHeaderClassOnScroll(scroll) {
  if (scroll > 150) {
    // Add class "active" to the header
    header.classList.add("active");
  } else {
    // Remove class "active" from the header
    header.classList.remove("active");
  }
}
// Function to open the menu
function openMenu() {
  // If the menu is open, close it
  if (isOpened) {
    toggleBtn.setAttribute("aria-expanded", false);
    sidenav.setAttribute("data-state", "closed");
  } else {
    // If the menu is closed, open it
    toggleBtn.setAttribute("aria-expanded", true);
    sidenav.setAttribute("data-state", "opened");
  }
  if (window.innerWidth > 768) {
    // Add the overlay
    addOverlay();
  }
  // Prevent scrolling on the body element
  body.style.overflow = "hidden";
}

// Function to close the menu
function closeMenu() {
  // If the menu is open, close it
  if (isOpened) {
    toggleBtn.setAttribute("aria-expanded", true);
    sidenav.setAttribute("data-state", "opened");
  } else {
    // If the menu is closed, open it
    toggleBtn.setAttribute("aria-expanded", false);
    sidenav.setAttribute("data-state", "closed");
  }
  if (window.innerWidth > 768) {
    // Remove the overlay
    removeOverlay();
  }
  // Allow scrolling on the body element again
  body.style.overflow = "";
}

// Function to add the overlay
function addOverlay() {
  // Create the overlay element
  const overlay = document.createElement("div");
  // Add the class "overlay" to the overlay element
  overlay.classList.add("overlay");
  // Add the id "overlay" to the overlay element
  overlay.setAttribute("id", "overlay");
  // Add an event listener to the overlay element
  overlay.addEventListener("click", () => {
    // When the overlay is clicked, close the menu
    closeMenu();
  });
  // Append the overlay element to the body element
  body.appendChild(overlay);
}

// Function to remove the overlay
function removeOverlay() {
  // Get the overlay element
  const overlay = document.getElementById("overlay");
  // Remove the overlay element
  overlay.remove();
}

// Get the current page URL
let currentPageURL = window.location.href;

// Get all the links in the navigation menu
let navItems = document.querySelectorAll(".nav-item");

// Iterate over the links
for (let i = 0; i < navItems.length; i++) {
  let link = navItems[i].children[0];

  // If the link URL matches the current page URL, add the active class
  if (link.href === currentPageURL) {
    navItems[i].classList.add("active");
  }
}
let dropdownToggles = document.querySelector(".dropdown__toggle");
let submenu = document.querySelector(".dropdown__menu");

dropdownToggles.addEventListener("click", function (e) {
  e.preventDefault();
  this.parentElement.classList.toggle("dropdown--open");
  if (!this.parentElement.classList.contains("dropdown--open")) {
    this.setAttribute("aria-expanded", "true");
  } else {
    this.setAttribute("aria-expanded", "false");
  }
});
