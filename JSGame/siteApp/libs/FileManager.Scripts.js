var FileManager = FileManager || {};

FileManager.scripts = (function () {

    var body = document.getElementsByTagName('body')[0],
        specificLoads = {};

    function loadScript(src, callback, id) {
        var ready = false,
            script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = src;

        script.onload = script.onreadystatechange = function () {

            if (!ready && (!this.readyState ||
                this.readyState === 'complete')) {

                ready = true;

                if (id && specificLoads[id]) {
                    specificLoads[id]();
                }

                if (callback) {
                    callback();
                }
            }
        };

        if (id) {
            script.id = id;
        }

        body.appendChild(script); //start loading the script
    }

    function loadManyScripts(scriptObjects, callback) {

        var loadedScripts = 0,

            allScripts = scriptObjects.length,

            scriptLoaded = function (obj) {
                return function () {

                    loadedScripts++;

                    if (obj && obj.callback) {
                        obj.callback();
                    }

                    callCallback();
                };
            },

            callCallback = function () {
                if (loadedScripts === allScripts) {
                    callback();
                }
            };

        for (var i = 0; i < allScripts; i++) {

            if (typeof scriptObjects[i] === 'string') {

                loadScript(scriptObjects[i], scriptLoaded());

            } else {

                loadScript(
                    scriptObjects[i].src,
                    scriptLoaded(scriptObjects[i]),
                    scriptObjects[i].id
                );

            }
        }

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
        load: loadScript,
        loadMany: loadManyScripts,
        onSpecificLoad: onSpecificLoad
    };

    return publicAPI;
})();