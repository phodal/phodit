var EchoesWorks = function (options) {
	var defaults;
	defaults = {
		element: 'slide',
		auto: false
	};

	if (options === undefined) {
		console.log("Default Options is Empty, use default options...");
		options = {};
	}

	EchoesWorks.defaults(options, defaults);

	this.options = options;
	if (options.source) {
		this.source = this.options.source;
	}
	if (options.src) {
		this.audioSrc = this.options.src;
	}
	this.element = this.options.element;
	this.playing = false;
	this.data = [];
	this.fps = 10;
	this.time = 0;
	this.audio = null;
	if (this.options.auto) {
		this.play();
	}
	this.init();
	window.ew = this;
};

EchoesWorks.prototype.init = function () {
	var that = this;
	if(this.audioSrc){
		this.audio = document.createElement('audio');
		this.audio.src = this.audioSrc;
		this.audio.autoplay = this.options.auto;
	}

	that.slide();
	EchoesWorks.triggerEvent("ew:slide:init");

	if (window.slide) {
		window.slide.auto = that.options.auto;
		that.parser();
		setInterval(function () {
			that.update();
		}, 1000 / this.fps);
	}
};

EchoesWorks.prototype.stop = function () {
	console.log("total time:", this.time);
	this.playing = false;
	this.time = 0;
};

EchoesWorks.prototype.pause = function () {
	this.playing = false;
};

EchoesWorks.prototype.play = function () {
	this.playing = true;
};

EchoesWorks.prototype.update = function () {
	if (this.playing) {
		this.time += 1 / this.fps;
	}
	this.applyEchoes();
};

function showCode(that, currentSlide) {
	var url = EchoesWorks.fn.rawGitConvert(that.data.codes[currentSlide]);
	EchoesWorks.get(url, function (response) {
		document.querySelector('code').innerHTML = response;
		document.querySelector('slide').classList.remove('full');
		document.querySelector('pre ').classList.remove('hidden');
	});
}

function showWords(that, currentSlide) {
	var timerWord;
	var words = that.data.words[currentSlide];
	//To do use stand speak speed
	//var standSpeakSpeed = 60 / 240 * 100;

	if (EchoesWorks.isObject(words)) {
		var nextTime = that.parser.parseTime(that.data.times)[currentSlide + 1];
		if (that.time < nextTime && words.length > 1) {
			var length = words.length;
			var currentTime = that.parser.parseTime(that.data.times)[currentSlide];
			var time = nextTime - currentTime;
			var average = time / length * 1000;
			var i = 0;
			document.querySelector('words').innerHTML = words[i].word;

			timerWord = setInterval(function () {
				i++;
				if (i - 1 === length) {
					clearInterval(timerWord);
				} else {
					document.querySelector('words').innerHTML = words[i].word;
				}
			}, average);
		}
		return timerWord;
	} else {
		document.querySelector('words').innerHTML = words;
	}
}

function hiddenWords() {
	document.querySelector('slide').classList.add('full');
	document.querySelector('words').classList.add('hidden');
}

function hiddenCode() {
	document.querySelector('slide').classList.add('full');
	document.querySelector('pre').classList.add('hidden');
}

EchoesWorks.prototype.applyEchoes = function () {
	var that = this;
	var isDataValid = that.parser.data && that.parser.data.codes !== undefined && that.parser.data.codes.length > 0;
	if (isDataValid) {
		that.data = that.parser.data;
		var times = that.parser.parseTime(that.data.times);
		var currentSlide = window.slide.slide();

		if (parseFloat(that.time) > times[currentSlide] && window.slide.auto) {
			window.slide.next();
			if (that.data.codes[currentSlide] && window.slide.auto) {
				showCode(that, currentSlide);
			} else {
				hiddenCode();
			}
			if (that.data.words[currentSlide]) {
				showWords(that, currentSlide);
			} else {
				hiddenWords(that, currentSlide);
			}
		}
	}
};


EchoesWorks.version = EchoesWorks.VERSION = '0.2.2';

root.EchoesWorks = EchoesWorks;
root.EW = EchoesWorks;