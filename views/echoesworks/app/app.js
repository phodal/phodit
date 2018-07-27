window.onload = function(){
	EchoesWorks.get('data/example.md', function(data){
		document.querySelector('slide').innerHTML = EchoesWorks.md.parse(data);
		EchoesWorks.imageHandler();
		new EchoesWorks({
			element: 'slide',
			source: 'data/data.json',
			src: 'app/audio.mp3',
			auto: true
		});
	})
};
