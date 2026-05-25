function navbarSetup() {
	// Get the elements needed
	const toggleBtn = document.getElementById("toggleBtn");
	const closeBtn = document.getElementById("closeBtn");
	const header = document.getElementById("header");
	const sidenav = document.getElementById("modal");
	const body = document.querySelector("body");

	// Get the previous scroll position
	let prevScrollpos = window.pageYOffset;

	// Add event listeners
	toggleBtn.addEventListener("click", () => {
		openMenu();
	});
	closeBtn.addEventListener("click", () => {
		closeMenu();
	});
	//accessibility for keyboard users
	toggleBtn.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			openMenu();
		}
	});
	closeBtn.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			closeMenu();
		}
	});
	// Close on Escape key from anywhere inside the modal
	sidenav.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu();
		}
	});

	//on page load check if the page is already scrolled, if so add active class to header
	window.addEventListener("load", () => {
		addRemoveHeaderClassOnScroll(window.scrollY);
	});

	// Add event listener to the window for scroll events
	window.addEventListener("scroll", () => {
		// Get the current scroll position
		const currentScrollPos = window.pageYOffset;
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
			header.classList.add("active");
		} else {
			header.classList.remove("active");
		}
	}

	// Function to open the menu
	function openMenu() {
		const isOpened = toggleBtn.getAttribute("aria-expanded") === "true";
		if (isOpened) {
			closeMenu();
			return;
		}
		toggleBtn.setAttribute("aria-expanded", "true");
		sidenav.setAttribute("data-state", "opened");
		sidenav.setAttribute("aria-hidden", "false");
		body.style.overflow = "hidden";
		if (window.innerWidth > 768) {
			addOverlay();
		}
		// Move focus inside the modal so keyboard users are not stranded
		closeBtn.focus();
	}

	// Function to close the menu
	function closeMenu() {
		toggleBtn.setAttribute("aria-expanded", "false");
		sidenav.setAttribute("data-state", "closed");
		sidenav.setAttribute("aria-hidden", "true");
		body.style.overflow = "";
		if (window.innerWidth > 768) {
			removeOverlay();
		}
		// Return focus to the element that triggered the modal
		toggleBtn.focus();
	}

	// Function to add the overlay
	function addOverlay() {
		const overlay = document.createElement("div");
		overlay.classList.add("overlay");
		overlay.setAttribute("id", "overlay");
		overlay.addEventListener("click", () => {
			closeMenu();
		});
		body.appendChild(overlay);
	}

	// Function to remove the overlay
	function removeOverlay() {
		const overlay = document.getElementById("overlay");
		if (overlay) overlay.remove();
	}

	// Get the current page URL
	const currentPageURL = window.location.href;

	// Get all the links in the navigation menu
	const navItems = document.querySelectorAll(".nav-item");

	// Iterate over the links
	for (let i = 0; i < navItems.length; i++) {
		const link = navItems[i].children[0];

		// If the link URL matches the current page URL, add the active class
		if (link.href === currentPageURL) {
			navItems[i].classList.add("active");
		}
	}
	const dropdownToggles = document.querySelector(".dropdown__toggle");
	const submenu = document.querySelector(".dropdown__menu");

	dropdownToggles.addEventListener("click", function (e) {
		e.preventDefault();
		this.parentElement.classList.toggle("dropdown--open");
		const isExpanded = this.parentElement.classList.contains("dropdown--open");
		this.setAttribute("aria-expanded", isExpanded ? "true" : "false");
	});
}
navbarSetup();
document.addEventListener("astro:after-swap", navbarSetup);
