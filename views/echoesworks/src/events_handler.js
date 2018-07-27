/* global EchoesWorks */

/*jshint unused:false, eqnull:true */
/* global window, navigator */

(function (document) {
	'use strict';

	var TAB = 9,
		SPACE = 32,
		PAGE_DOWN = 34,
		LEFT = 37,
		RIGHT = 39,
		DOWN = 40,
		PAGE_UP = 33,
		UP = 38,
		slide,
		slides,
		start,
		dragging;

	var isTouchDevice = function () {
		return 'ontouchstart' in window || navigator.msMaxTouchPoints;
	};

	function stopAutoPlay() {
		window.slide.auto = false;
    if(!!window.ew && !!window.ew.audio) {
      window.ew.audio.pause();
    }
	}

	function touchDeviceHandler() {
		EchoesWorks.forEach(slides, function (slide) {
			var halfWidth = window.screen.width / 3,
				thirdHeight = window.screen.height / 3,
				delta;

			slide.addEventListener('touchstart', function (event) {
				start = {
					x: event.touches[0].pageX,
					y: event.touches[0].pageY
				};
				dragging = true;
			});

			slide.addEventListener('touchend', function () {
				dragging = false;
			});

			slide.addEventListener('touchmove', function (event) {
				if (dragging) {
					event.preventDefault();
					delta = {
						x: event.touches[0].pageX - start.x,
						y: event.touches[0].pageY - start.y
					};

					var lastX = delta.x > 0 && (delta.x > halfWidth);
					var nextY = delta.y > 0 && (delta.y > thirdHeight);
					var nextX = delta.x < 0 && (Math.abs(delta.x) > halfWidth);
					var lastY = delta.y < 0 && (Math.abs(delta.y) > thirdHeight);

					if (nextX || nextY) {
						window.slide.next();
						dragging = false;
					} else if (lastX || lastY) {
						window.slide.prev();
						dragging = false;
					}
				}
				stopAutoPlay();
			});
		});
	}

	function syncSliderEventHandler() {
		function handler() {
			window.slide.slide(parseInt(localStorage.getItem('slides'), 10));
		}

		if (window.addEventListener) {
			window.addEventListener("storage", handler, false);
		} else {
			window.attachEvent("onstorage", handler);
		}
	}

	document.addEventListener("ew:slide:init", function () {
		slides = document.getElementsByTagName('section');
		syncSliderEventHandler();

		if (slides && isTouchDevice && window.slide) {
			touchDeviceHandler();
		}

		document.addEventListener("keydown", function (event) {
			stopAutoPlay();
			var keyCode = event.keyCode;
			if (keyCode === TAB || ( keyCode >= SPACE && keyCode <= PAGE_DOWN ) || (keyCode >= LEFT && keyCode <= DOWN)) {
				event.preventDefault();
			}
		}, false);

		document.addEventListener("keyup", function (event) {
			var keyCode = event.keyCode;
			if (keyCode === TAB || ( keyCode >= SPACE && keyCode <= PAGE_DOWN ) || (keyCode >= LEFT && keyCode <= DOWN)) {
				switch (keyCode) {
					case  PAGE_UP:
					case  LEFT:
					case  UP:
						window.slide.prev();
						break;
					case TAB:
					case SPACE:
					case PAGE_DOWN:
					case  RIGHT:
					case DOWN:
						window.slide.next();
						break;
				}

				event.preventDefault();
			}
		});
	});
}(document));
