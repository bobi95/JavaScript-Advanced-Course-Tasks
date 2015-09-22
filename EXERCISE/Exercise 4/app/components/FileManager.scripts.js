(function(window, document, app) {

    app.docReady(function(){
        fileManagerInit(app);
        app.registerModule('app.scripts');
    });

    function fileManagerInit (module) {

        module.scripts = (function() {

            var docBody = (function() {
                    var body = document.body;
                    var div = document.createElement('div');
                    div.style.width = '0';
                    div.style.height = '0';
                    div.style.display = 'none';
                    div.setAttribute('data-name', 'includes');
                    body.appendChild(div);
                    return div;
                })(),
                loading = [],
                loaded = [];

            function createElement(src, name) {
                var el = document.createElement('script');

                el.type = 'text/javascript';
                el.src = src;

                return el;
            }

            function prepareNameHandler(name, callback) {
                loading.push(name);

                return function() {
                    loading.splice(loading.indexOf(name));
                    loaded.push(name);
                    callback();
                };
            }

            function createScript(scriptObj, callback) {

                var script = createElement(scriptObj.src, scriptObj.name),
                    ready = false,
                    nameHandler = prepareNameHandler(scriptObj.name, callback);

                script.onload = script.onreadystatechange = function() {

                    if (!ready && (!this.readyState ||
                        this.readyState === 'complete')) {
                        ready = true;
                        nameHandler();
                    }

                };

                return script;
            }

            function loadSingle(scriptObj, callback) {

                if(loaded.indexOf(scriptObj.name) !== -1 ||
                   loading.indexOf(scriptObj.name) !== -1) {
                    return;
                }

                var script = createScript(scriptObj, prepareNameHandler(scriptObj.name, callback));

                docBody.appendChild(script);
            }

            function filterLoadedScripts(scriptObjArr) {
                var newScripts = [];

                for(var i = 0, j = scriptObjArr.length; i < j; i += 1) {
                    var obj = scriptObjArr[i];

                    if(loaded.indexOf(obj.name) !== -1 ||
                       loading.indexOf(obj.name) !== -1 ||
                       newScripts.indexOf(obj.name) !== -1) {

                        scriptObjArr.splice(i, 1);
                        i -= 1;
                        j -= 1;

                    } else {

                        newScripts.push(obj);
                    }
                }

                return newScripts;
            }

            function getNameCheckCallback(scriptNames, name, callback) {
                return function() {
                    scriptNames.splice(name, 1);

                    if(!scriptNames.length) {
                        callback();
                    }
                };
            }

            function loadNewScripts(newScripts, scriptNames, callback) {
                var elements = document.createDocumentFragment();

                for(var i = 0, j = newScripts.length; i < j; i += 1) {
                    var obj = newScripts[i];

                    var script = createScript(obj, getNameCheckCallback(scriptNames, obj.name, callback));

                    elements.appendChild(script);
                }

                docBody.appendChild(elements);
            }

            function loadMany(scriptObjArr, callback) {
                var newScripts = filterLoadedScripts(scriptObjArr),
                    newNames = [];

                if (!newScripts.length) {
                    return;
                }

                for(var i = 0, j = newScripts.length; i < j; i += 1) {
                    newNames.push(newScripts[i].name);
                }

                loadNewScripts(newScripts, newNames, callback);
            }

            return {
                loadSingle: loadSingle,
                loadMany: loadMany
            };

        })(); // module.scripts

    }

})(window, document, app);