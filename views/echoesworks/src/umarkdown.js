/*
 * micro-markdown.js
 * markdown in under 5kb
 *
 * Copyright 2014, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/micromarkdown.js/
 * Version: 0.3.0
 */

/*jshint strict: true */
var micromarkdown = {
	regexobject: {
		headline: /^(\#{1,6})([^\#\n]+)$/m,
		pre: /\s\`\`\`(\w+)\n?[^`]+\`\`\`/g,
		code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
		hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
		lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
		bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
		links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
		reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
		smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,
		mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
		tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
		include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
		url: /<([a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g
	},

	codeHandler: function (stra, str) {
		var pre = '', preClass;
		if ((preClass = this.regexobject.pre.exec(stra)) !== null) {
			pre = preClass[1];
		}

		return str.replace(stra[0], '<pre><code class="' + pre + '">\n' + micromarkdown.htmlEncode(stra[1]).replace(pre + '\n', '').replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;') + '</code></pre>\n');
	},

	headlineHandler: function (stra, str) {
		var count = stra[1].length;
		return str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
	},

	linksHandler: function (stra, str, strict) {
		if (stra[0].substr(0, 1) === '!') {
			str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />\n');
		} else {
			str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(stra[2], strict) + 'href="' + stra[2] + '">' + stra[1] + '</a>\n');
		}
		return str;
	},
	mailHandler: function (stra, str) {
		return str.replace(stra[0], '<a href="mailto:' + stra[1] + '">' + stra[1] + '</a>');
	},
	hrHandler: function (stra, str) {
		return str.replace(stra[0], '\n<hr/>\n');
	},
	urlHandler: function (stra, str, strict) {
		var replaceString = stra[1];
		if (replaceString.indexOf('://') === -1) {
			replaceString = 'http://' + replaceString;
		}
		return str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(replaceString, strict) + 'href="' + replaceString + '">' + replaceString.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi, '') + '</a>');
	},
	refLinksHandler: function (str, stra, helper, strict) {
		return str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(helper[1], strict) + 'href="' + helper[1] + '">' + stra[1] + '</a>');
	},
	smlinksHandler: function (stra, str, strict) {
		var replaceStr = "";
		switch (stra[2]) {
			case 't':
				replaceStr = 'https://twitter.com/' + stra[1];
				break;
			case 'gh':
				replaceStr = 'https://github.com/' + stra[1];
				break;
			case 'fb':
				replaceStr = 'https://www.facebook.com/' + stra[1];
				break;
			case 'gp':
				replaceStr = 'https://plus.google.com/+' + stra[1];
				break;
		}
		return str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(replaceStr, strict) + 'href="' + replaceStr + '">' + stra[1] + '</a>');
	},
	boldItalicHandler: function (stra, str) {
		var replaceStr = [];
		if (stra[1] === '~~') {
			str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
		} else {
			switch (stra[1].length) {
				case 1:
					replaceStr = ['<i>', '</i>'];
					break;
				case 2:
					replaceStr = ['<b>', '</b>'];
					break;
				case 3:
					replaceStr = ['<i><b>', '</b></i>'];
					break;
			}
			str = str.replace(stra[0], replaceStr[0] + stra[2] + replaceStr[1]);
		}
		return str;
	},
	tableHandlerHelper: function (helper, calign, strict) {
		var i;
		for (i = 0; i < helper.length; i++) {
			if (calign.length <= i) {
				calign.push(0);
			} else if ((calign[i].trimRight().slice(-1) === ':') && (strict !== true)) {
				if (calign[i][0] === ':') {
					calign[i] = 3;
				} else {
					calign[i] = 2;
				}
			} else if (strict !== true) {
				if (calign[i][0] === ':') {
					calign[i] = 1;
				} else {
					calign[i] = 0;
				}
			} else {
				calign[i] = 0;
			}
		}
	},
	tableHandler: function (helper1, i, calign, replaceStr, cel) {
		var j, helper2;
		helper2 = helper1[i].split('|');
		if (helper2[0].length !== 0) {
			while (calign.length < helper2.length) {
				calign.push(0);
			}
			replaceStr += '<tr>';
			for (j = 0; j < helper2.length; j++) {
				replaceStr += cel[calign[j]] + helper2[j].trim() + '</td>';
			}
			replaceStr += '</tr>' + '\n';
		}
		return {helper2: helper2, replaceStr: replaceStr};
	},

	tablesHandler: function (stra, str, strict) {
		var replaceStr, cel, helper, calign, helper1, helper2, i;

		replaceStr = '<table><tr>';
		helper = stra[1].split('|');
		calign = stra[4].split('|');
		this.tableHandlerHelper(helper, calign, strict);
		cel = ['<th>', '<th align="left">', '<th align="right">', '<th align="center">'];
		for (i = 0; i < helper.length; i++) {
			replaceStr += cel[calign[i]] + helper[i].trim() + '</th>';
		}
		replaceStr += '</tr>';
		cel = ['<td>', '<td align="left">', '<td align="right">', '<td align="center">'];
		helper1 = stra[7].split('\n');
		for (i = 0; i < helper1.length; i++) {
			var result = this.tableHandler(helper1, i, calign, replaceStr, cel);
			helper2 = result.helper2;
			replaceStr = result.replaceStr;
		}
		replaceStr += '</table>';
		return str.replace(stra[0], replaceStr);
	},

	listHandlerStart: function (stra, replaceStr) {
		if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
			replaceStr = '<ul>';
		} else {
			replaceStr = '<ol>';
		}
		return replaceStr;
	},

	listsHandlerEnd: function (stra, replaceStr) {
		if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
			replaceStr += '</ul>';
		} else {
			replaceStr += '</ol>';
		}
		return replaceStr;
	},

	listsHandlerSub: function (line, replaceStr, helper1) {
		if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
			replaceStr += '<ul>';
			helper1.push('</ul>');
		} else {
			replaceStr += '<ol>';
			helper1.push('</ol>');
		}
		return replaceStr;
	},

	listHandler: function (line, nstatus, status, replaceStr, helper1, casca) {
		var indent = false;
		if ((line[2] === undefined) || (line[2].length === 0)) {
			nstatus = 0;
		} else {
			if (indent === false) {
				indent = line[2].replace(/\t/, '    ').length;
			}
			nstatus = Math.round(line[2].replace(/\t/, '    ').length / indent);
		}
		while (status > nstatus) {
			replaceStr += helper1.pop();
			status--;
			casca--;
		}
		while (status < nstatus) {
			replaceStr = this.listsHandlerSub(line, replaceStr, helper1);
			status++;
			casca++;
		}
		replaceStr += '<li>' + line[6] + '</li>' + '\n';
		return {nstatus: nstatus, status: status, replaceStr: replaceStr, casca: casca};
	},

	listsHandler: function (stra, str) {
		var helper, helper1 = [], status = 0, line, nstatus, replaceStr, i, casca = 0;
		replaceStr = this.listHandlerStart(stra, replaceStr);
		helper = stra[0].split('\n');
		for (i = 0; i < helper.length; i++) {
			if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
				var result = this.listHandler(line, nstatus, status, replaceStr, helper1, casca);
				nstatus = result.nstatus;
				status = result.status;
				replaceStr = result.replaceStr;
				casca = result.casca;
			}
		}
		while (casca > 0) {
			replaceStr += '</ul>';
			casca--;
		}
		replaceStr = this.listsHandlerEnd(stra, replaceStr);
		return str.replace(stra[0], replaceStr + '\n');
	},

	listStrict: function (strict, regexobject) {
		if (strict !== true) {
			regexobject.lists = /^((\s*(\*|\d\.) [^\n]+)\n)+/gm;
		}
		return regexobject.lists;
	},
	removeRefLinks: function (trashgc, str) {
		var i;
		for (i = 0; i < trashgc.length; i++) {
			str = str.replace(trashgc[i], '');
		}
		return str;
	},

	parse: function (str, strict) {
		var helper, helper1, stra, trashgc = [], i, that = this, regexObject = micromarkdown.regexobject;
		regexObject.lists = this.listStrict(strict, regexObject);

		str = '\n' + str + '\n';
		['code', 'headline', 'lists', 'tables', 'links', 'mail', 'url', 'smlinks', 'hr'].forEach(function (type) {
			while ((stra = regexObject[type].exec(str)) !== null) {
				str = that[(type + 'Handler')].apply(that, [stra, str, strict]);
			}
		});

		for (i = 0; i < 3; i++) {
			while ((stra = regexObject.bolditalic.exec(str)) !== null) {
				str = this.boldItalicHandler(stra, str);
			}
		}

		while ((stra = regexObject.reflinks.exec(str)) !== null) {
			helper1 = new RegExp('\\[' + stra[2] + '\\]: ?([^ \n]+)', "gi");
			if ((helper = helper1.exec(str)) !== null) {
				str = this.refLinksHandler(str, stra, helper, strict);
				trashgc.push(helper[0]);
			}
		}

		str = this.removeRefLinks(trashgc, str);
		return str.replace(/ {2,}[\n]{1,}/gmi, '<br/><br/>');
	},

	htmlEncode: function (str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	},

	mmdCSSclass: function (str, strict) {
		var urlTemp;
		if ((str.indexOf('/') !== -1) && (strict !== true)) {
			urlTemp = str.split('/');
			if (urlTemp[1].length === 0) {
				urlTemp = urlTemp[2].split('.');
			} else {
				urlTemp = urlTemp[0].split('.');
			}
			return 'class="mmd_' + urlTemp[urlTemp.length - 2].replace(/[^\w\d]/g, '') + urlTemp[urlTemp.length - 1] + '" ';
		}
		return '';
	}
};

EchoesWorks.md = micromarkdown;