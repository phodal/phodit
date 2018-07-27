/*!
 * Bespoke.js v1.0.0
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

/*jshint -W030 */

var from = function () {

	var element = this.options.element,
		parent = element.nodeType === 1 ? element : document.querySelector(element),
		slides = [].filter.call(parent.children, function (el) {
			return el.nodeName !== 'SCRIPT';
		}),
		activeSlide = slides[0],
		listeners = {},

		readURL = function () {
			var hash = window.location.hash,
				current = hash.replace(/#|\//gi, '');

			if (current > 0) {
				activate(current);
			} else {
				activate(0);
			}
		},

		activate = function (index, customData) {
			if (!slides[index]) {
				return;
			}

			activeSlide.className = activeSlide.className.replace(new RegExp('active' + '(\\s|$)', 'g'), ' ').trim();
			activeSlide.classList.add('past');

			fire('deactivate', createEventData(activeSlide, customData));
			activeSlide = slides[index];
			activeSlide.className = 'active';
			var isLastSlide = parseInt(index, 10) === (slides.length - 1);
			var isFirstSlide = parseInt(index, 10) === 0;
			if(isFirstSlide || isLastSlide) {
				activeSlide.classList.add('specify');
			}
			window.bar.go(100 * ( index + 1) / slides.length);
			writeURL(index);
			localStorage.setItem('slides', index);
			fire('activate', createEventData(activeSlide, customData));
		},

		slide = function (index, customData) {
			if (arguments.length) {
				fire('slide', createEventData(slides[index], customData)) && activate(index, customData);
			} else {
				return slides.indexOf(activeSlide);
			}
		},

		writeURL = function (index) {
			window.location.hash = '#/' + index;
		},

		step = function (offset, customData) {
			var slideIndex = slides.indexOf(activeSlide) + offset;

			fire(offset > 0 ? 'next' : 'prev', createEventData(activeSlide, customData)) && activate(slideIndex, customData);
		},

		on = function (eventName, callback) {
			(listeners[eventName] || (listeners[eventName] = [])).push(callback);

			return function () {
				listeners[eventName] = listeners[eventName].filter(function (listener) {
					return listener !== callback;
				});
			};
		},

		fire = function (eventName, eventData) {
			return (listeners[eventName] || [])
				.reduce(function (notCancelled, callback) {
					return notCancelled && callback(eventData) !== false;
				}, true);
		},

		createEventData = function (el, eventData) {
			eventData = eventData || {};
			eventData.index = slides.indexOf(el);
			eventData.slide = el;
			return eventData;
		},

		deck = {
			on: on,
			fire: fire,
			slide: slide,
			next: step.bind(null, 1),
			prev: step.bind(null, -1),
			parent: parent,
			slides: slides,
			auto: false
		};

	readURL();
	window.slide = deck;

	return deck;
};

EchoesWorks.prototype = EchoesWorks.extend(EchoesWorks.prototype, {slide: from});
