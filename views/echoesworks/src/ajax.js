EchoesWorks.get = function (url, callback) {
    EchoesWorks.send(url, 'GET', callback);
};

EchoesWorks.load = function (url, callback) {
    EchoesWorks.send(url, 'GET', callback);
};

EchoesWorks.post = function (url, data, callback) {
    EchoesWorks.send(url, 'POST', callback, data);
};

EchoesWorks.send = function (url, method, callback, data) {
    data = data || null;
    var request = new XMLHttpRequest();
    if (callback instanceof Function) {
        request.onreadystatechange = function () {
            if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
                callback(request.responseText);
            }
        };
    }
    request.open(method, url, true);
    request.send(data);
};
