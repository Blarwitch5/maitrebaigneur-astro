particlesJS.load("particles-js", {
	particles: {
		number: {
			value: 24,
			density: {
				enable: true,
				value_area: 1000
			}
		},
		color: {
			value: "#ffffff"
		},
		shape: {
			type: "circle",
			stroke: {
				width: 0,
				color: "#dedede"
			}
		},
		opacity: {
			value: 0.3,
			random: true,
			anim: {
				enable: false,
				speed: 1,
				opacity_min: 0.1,
				sync: false
			}
		},
		size: {
			value: 32.06824121731046,
			random: true,
			anim: {
				enable: true,
				speed: 1,
				size_min: 21.114007519834974,
				sync: false
			}
		},
		line_linked: {
			enable: false,
			distance: 200,
			color: "#ffffff",
			opacity: 1,
			width: 2
		},
		move: {
			enable: true,
			speed: 3,
			direction: "top",
			random: true,
			straight: false,
			out_mode: "out",
			bounce: false,
			attract: {
				enable: false,
				rotateX: 80.17060304327615,
				rotateY: 881.8766334760375
			}
		}
	},
	interactivity: {
		detect_on: "canvas",
		events: {
			onhover: {
				enable: true,
				mode: "repulse"
			},
			onclick: {
				enable: false,
				mode: "remove"
			},
			resize: true
		},
		modes: {
			grab: {
				distance: 400,
				line_linked: {
					opacity: 1
				}
			},
			bubble: {
				distance: 400,
				size: 40,
				duration: 2,
				opacity: 8,
				speed: 3
			},
			repulse: {
				distance: 200,
				duration: 0.4
			},
			push: {
				particles_nb: 4
			},
			remove: {
				particles_nb: 2
			}
		}
	},
	retina_detect: true
});
