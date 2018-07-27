var parser = function () {
	var that = this;
	if(that.source){
		parser.init(that.source);
	}
};

parser.data = [];

parser.init = function (source) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function () {
		if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
			parser.parse(JSON.parse(request.responseText));
		}
	};

	request.open('GET', source, true);
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.send();
};

parser.parse = function (data) {
	var times = [],
		codes = [],
		words = [],
		results;

	function callback(element) {
		times.push(element.time);
		codes.push(element.code);
		words.push(element.word);
	}

	data.forEach(callback);
	results = {
		times: times,
		codes: codes,
		words: words
	};
	parser.data = results;
	return results;
};

parser.parseTime = function(times) {
	var pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
		result = [];

	times.forEach(function(v1) {
		var t = v1.slice(1, -1).split(':');
		var value = v1.replace(pattern, '');
		result.push([parseFloat(t[0]) * 60 + parseFloat(t[1]), value][0]);
	});
	return result;
};

EchoesWorks.prototype = EchoesWorks.extend(EchoesWorks.prototype, {parser: parser});
