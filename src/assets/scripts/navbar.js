function navbarSetup() {
	const toggleBtn = document.getElementById("toggleBtn");
	const closeBtn = document.getElementById("closeBtn");
	const header = document.getElementById("header");
	const sidenav = document.getElementById("modal");
	const body = document.querySelector("body");

	let prevScrollpos = window.scrollY;

	toggleBtn.addEventListener("click", () => { openMenu(); });
	closeBtn.addEventListener("click", () => { closeMenu(); });

	sidenav.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu();
			return;
		}
		if (event.key === "Tab") {
			const focusable = [...sidenav.querySelectorAll(
				'a[href], button:not([disabled])'
			)];
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey) {
				if (document.activeElement === first) {
					event.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		}
	});

	window.addEventListener("load", () => {
		addRemoveHeaderClassOnScroll(window.scrollY);
	});

	window.addEventListener("scroll", () => {
		const currentScrollPos = window.scrollY;
		if (prevScrollpos > currentScrollPos || window.scrollY < 80) {
			header.style.top = "0";
		} else {
			header.style.top = "-80px";
		}
		addRemoveHeaderClassOnScroll(currentScrollPos);
		prevScrollpos = currentScrollPos;
	});

	function addRemoveHeaderClassOnScroll(scroll) {
		if (scroll > 150) {
			header.classList.add("active");
		} else {
			header.classList.remove("active");
		}
	}

	function setBackgroundInert(shouldInert) {
		[...document.body.children].forEach((el) => {
			if (el.id !== "modal") {
				if (shouldInert) el.setAttribute("inert", "");
				else el.removeAttribute("inert");
			}
		});
	}

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
		setBackgroundInert(true);
		if (window.innerWidth > 768) {
			addOverlay();
		}
		closeBtn.focus();
	}

	function closeMenu() {
		toggleBtn.setAttribute("aria-expanded", "false");
		sidenav.setAttribute("data-state", "closed");
		sidenav.setAttribute("aria-hidden", "true");
		body.style.overflow = "";
		setBackgroundInert(false);
		if (window.innerWidth > 768) {
			removeOverlay();
		}
		toggleBtn.focus();
	}

	function addOverlay() {
		const overlay = document.createElement("div");
		overlay.classList.add("overlay");
		overlay.setAttribute("id", "overlay");
		overlay.addEventListener("click", () => { closeMenu(); });
		body.appendChild(overlay);
	}

	function removeOverlay() {
		const overlay = document.getElementById("overlay");
		if (overlay) overlay.remove();
	}

	const currentPageURL = window.location.href;
	const navItems = document.querySelectorAll(".nav-item");

	for (let i = 0; i < navItems.length; i++) {
		const link = navItems[i].children[0];
		if (link && link.href === currentPageURL) {
			navItems[i].classList.add("active");
		}
	}

	const dropdownToggles = document.querySelectorAll(".dropdown__toggle");

	dropdownToggles.forEach((toggle) => {
		toggle.addEventListener("click", function (e) {
			e.preventDefault();
			this.parentElement.classList.toggle("dropdown--open");
			const isExpanded = this.parentElement.classList.contains("dropdown--open");
			this.setAttribute("aria-expanded", isExpanded ? "true" : "false");
		});
	});
}
navbarSetup();
document.addEventListener("astro:after-swap", navbarSetup);
