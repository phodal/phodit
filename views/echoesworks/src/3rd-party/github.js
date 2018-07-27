function rawGitConvert(url){
	var results = url.replace('github.com', 'rawgit.com');
	results = results.replace('raw.githubusercontent.com', 'rawgit.com');
	return results;
}

var Github = {
	rawGitConvert: rawGitConvert
};

EchoesWorks.fn = EchoesWorks.extend(EchoesWorks.fn, Github);