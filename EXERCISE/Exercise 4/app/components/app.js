var app = app || {};
(function (window, document, app) {

    window.onbeforeunload = function() {
        return "Refreshing or changing the page will cause all scripts to reload!";
    };

    var modules = {},
        docReadyEvent = 'DOMContentLoaded',
        isDocReady = document.readyState != 'loading',
        proxy = document.createElement('div');

    Object.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    app.setLocation = setLocation;
    function setLocation(newLocation) {
        var hash = window.location.hash.substr(1);

        if(hash !== newLocation) {
            window.location.hash = '#' + newLocation;
        }
    }

    app.require = require;
    function require (names, callback) {

        function createCallback (names, name) {
            var arrCallback = function() {

                if (names.length === 1) {
                    callback();
                    return;
                }

                names.splice(names.indexOf(name), 1);
            };

            return arrCallback;
        }

        if(Object.isArray(names)) {

            for(var i = 0, j = names.length; i < j; i += 1) {
                if(modules[names[i]]) {
                    names.splice(i, 1);
                    j -= 1;
                    i -= 1;
                }
            }

            if (names.length === 0) {
                callback();
            }

            for(var k = 0, l = names.length; k < l; k += 1) {
                app.once('module:' + names[k] + ':loaded', createCallback(names, names[k]));
            }

            return;
        }

        if (modules[names]) {
            callback();
            return;
        }

        app.once('module:' + names + ':loaded', callback);
    }

    app.registerModule = registerModule;
    function registerModule (modName) {
        if(modules[modName]) {
            throw new Error(modName + ' is already registered!');
        }

        modules[modName] = true;
        app.trigger('module:' + modName + ':loaded');
    }

    app.once = once;
    function once (eventName, handler) {
        proxy.addEventListener(eventName, function() {
            proxy.removeEventListener(eventName, arguments.callee, false);
            handler();
        }, false);
    }

    app.listen = listen;
    function listen (eventName, handler) {
        proxy.addEventListener(eventName, handler, false);
    }

    app.stopListen = stopListen;
    function stopListen (eventName, handler) {
        proxy.removeEventListener(eventName);
    }

    app.trigger = trigger;
    function trigger (eventName, details) {
        proxy.dispatchEvent(new CustomEvent(eventName, {detail: details}));
    }

    app.docReady = docReady;
    function docReady (handler) {
        if (isDocReady) {
            handler();
            return;
        }

        document.addEventListener(docReadyEvent, function(){
            document.removeEventListener(docReadyEvent, arguments.callee, false);
            isDocReady = true;
            handler();
        }, false);
    }

    // class helpers
    var Class = {
        /**
         * Typescript's method of inheritance
         * @param  {Class} derived Child class
         * @param  {Class} base    Parent class
         * @return {void}
         */
        extends: function (derived, base) {

            for(var p in base) {
                if(base.hasOwnProperty(p)) {
                    derived[p] = base[p];
                }
            }

            function newProto() {
                this.constructor = derived.prototype;
            }

            newProto.prototype = base.prototype;
            derived.prototype = new newProto();
        }
    };
    window.Class = Class;

})(window, document, app);