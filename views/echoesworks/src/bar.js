/* http://nanobar.micronube.com/  ||  https://github.com/jacoborus/nanobar/    MIT LICENSE */

var addCss, Bar, Nanobar, move, place, init,
	cssCont = {
		width: '100%',
		height: '4px',
		zIndex: 9999,
		bottom: '0'
	},
	cssBar = {
		width: 0,
		height: '100%',
		clear: 'both',
		transition: 'height .3s'
	};


addCss = function (el, css) {
	var i;
	for (i in css) {
		el.style[i] = css[i];
	}
	el.style.float = 'left';
};

move = function () {
	var self = this,
		dist = this.width - this.here;

	if (dist < 0.1 && dist > -0.1) {
		place.call(this, this.here);
		this.moving = false;
		if (this.width == 100) {
			this.el.style.height = 0;
			setTimeout(function () {
				self.cont.el.removeChild(self.el);
			}, 300);
		}
	} else {
		place.call(this, this.width - (dist / 4));
		setTimeout(function () {
			self.go();
		}, 16);
	}
};

place = function (num) {
	this.width = num;
	this.el.style.width = this.width + '%';
};

init = function () {
	var bar = new Bar(this);
	this.bars.unshift(bar);
};

Bar = function (cont) {
	this.el = document.createElement('div');
	this.el.style.backgroundColor = '#F44336';
	this.width = 0;
	this.here = 0;
	this.moving = false;
	this.cont = cont;
	addCss(this.el, cssBar);
	cont.el.appendChild(this.el);
};

Bar.prototype.go = function (num) {
	if (num) {
		this.here = num;
		if (!this.moving) {
			this.moving = true;
			move.call(this);
		}
	} else if (this.moving) {
		move.call(this);
	}
};


Nanobar = function () {
	this.bars = [];

	this.el = document.createElement('div');
	this.el.className = 'bar';
	addCss(this.el, cssCont);
	this.el.style.position = 'fixed';
	document.getElementsByTagName('body')[0].appendChild(this.el);

	init.call(this);
};


Nanobar.prototype.go = function (p) {
	this.bars[0].go(p);
	if (p == 100) {
		init.call(this);
	}
};

var bar = new Nanobar();
window.bar = bar;

EchoesWorks.bar = bar;