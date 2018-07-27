var headerHandler = function() {
	var headers = document.querySelectorAll('.header h1');
	EchoesWorks.forEach(headers, function(header, index){
		var head = document.createElement('h1');
		var section = header.parentNode.parentNode;
		head.innerHTML = header.innerHTML;
		section.insertBefore(head, section.firstChild);
		header.parentNode.removeChild(headers[index]);
	});
};

var imageHandler = function (sections) {
	var images = document.getElementsByTagName('img');
	EchoesWorks.forEach(images, function (image) {
		var imageSrc = image.src;
		var imageType = image.title;
		if (imageType === 'background') {
			imageHandler.backgroundHandler(image, imageSrc, imageType);
		} else {
			if (imageType === 'left') {
				imageHandler.directionHandler(image, imageType, imageSrc, 'right');
			} else if (imageType === 'right') {
				imageHandler.directionHandler(image, imageType, imageSrc, 'left');
			}
			headerHandler();
		}
	});
	imageHandler.removeImages();
	return sections;
};

imageHandler.directionHandler = function (image, imageType, imageSrc, direction) {
	var parentNode = image.parentNode;
	var contentDiv = document.createElement('div');
	contentDiv.innerHTML = parentNode.innerHTML;
	contentDiv.className = direction;
	contentDiv.className += ' header';
	parentNode.innerHTML = '';
	parentNode.appendChild(contentDiv);

	var imageDiv = document.createElement('div');
	parentNode.appendChild(imageDiv);
	imageDiv.classList.add('image-' + imageType);
	imageDiv.width = 200;
	imageDiv.style.background = "url('" + imageSrc + "') no-repeat";
};

imageHandler.backgroundHandler = function (image, imageSrc, imageType) {
	image.parentNode.style.backgroundImage = "url('" + imageSrc + "')";
	image.parentNode.classList.add(imageType);
};

imageHandler.removeImages = function () {
	var element = document.getElementsByTagName("img"), index;
	for (index = element.length - 1; index >= 0; index--) {
		element[index].parentNode.removeChild(element[index]);
	}
};

EchoesWorks.imageHandler = imageHandler;

