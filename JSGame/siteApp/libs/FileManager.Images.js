var FileManager = FileManager || {};

FileManager.images = (function () {
    var loadedImages = {},
        specificLoads = {};

    function load(name, src, callback) {

        var imageObj = {
            name: name,
            img: new Image()
        };

        imageObj.img.onload = function () {

            loadedImages[imageObj.name] = imageObj;

            if (specificLoads[name]) {
                specificLoads[name]();
            }

            if (callback) {
                callback();
            }
        };

        imageObj.img.src = src;
    }

    function loadMany(imageObjects, callback) {

        var loaded = 0,

            images = imageObjects.length,

            imageLoaded = function (index, img) {
                return function () {

                    loaded++;
                    loadedImages[img.name] = img;

                    if (Number.isInteger(index) && imageObjects[
                            index].callback) {
                        imageObjects[index].callback();
                    }

                    if (specificLoads[img.name]) {
                        specificLoads[img.name]();
                    }

                    callCallback();
                };
            },
            callCallback = function () {
                if (loaded === images) {
                    callback();
                }
            };

        for (var i = 0; i < images; i++) {

            var imageObj = {
                name: imageObjects[i].name,
                img: new Image()
            };

            imageObj.img.onload = imageLoaded(i, imageObj);

            imageObj.img.src = imageObjects[i].src;
        }
    }

    function get(name) {
        if (loadedImages[name]) {
            return loadedImages[name].img;
        }
        return null;
    }

    function onSpecificLoad(name, func) {

        if (typeof name === 'string') {

            if (typeof func === 'function') {
                specificLoads[name] = func;
            } else {
                specificLoads[name] = undefined;
            }
        }

    }

    var publicAPI = {

        load: load,
        loadMany: loadMany,
        get: get,
        onSpecificLoad: onSpecificLoad
    };

    return publicAPI;

})();