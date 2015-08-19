(function keyboardCaptureInit (GLOBAL){

    GLOBAL.siteApp = GLOBAL.siteApp || {};

    function keyboardCapture () {

        var keybindings = {},
            configuration = {
                eventNamespace: 'keycapture',
                showCapturedKeycodes: false
            },
            isCapturing = false;

        function bindKey (keyName, keyCode) {
            keybindings[keyCode] = keyName;
        }

        function bindNextKey(keyName) {
            var iscapturing = isCapturing;

            stopCaptureKeys();

            GLOBAL.addEventListener('keydown', function (evnt) {
                evnt.preventDefault();

                if (configuration.showCapturedKeycodes) {
                    console.log('Bound: ' + keyName + ' - ' + evnt.keyCode);
                }

                bindKey(keyName, evnt.keyCode);

                GLOBAL.removeEventListener('keydown', arguments.callee, false);

                if (iscapturing) {
                    captureKeys();
                }
            });
        }

        function unbindKey (keyName) {

            for(var i = 0, j = keybindings.length; i < j; i++) {
                if (keybindings[i] === keyName) {
                    keybindings[i] = undefined;
                    break;
                }
            }

        }

        function getBind (keyName) {
            for(var keyCode in keybindings) {
                if (keybindings[keyCode] === keyName) {
                    return Number(keyCode);
                }
            }
            return undefined;
        }

        function captureKeys () {
            if (!isCapturing) {
                GLOBAL.addEventListener('keydown', onKeyDownCapture.bind(this), false);
                GLOBAL.addEventListener('keyup', onKeyUpCapture.bind(this), false);
                GLOBAL.addEventListener('keypress', onKeyPressCapture.bind(this), false);
            }
        }

        function stopCaptureKeys () {
            if (isCapturing) {
                GLOBAL.removeEventListener('keydown', onKeyDownCapture.bind(this), false);
                GLOBAL.removeEventListener('keyup', onKeyUpCapture.bind(this), false);
                GLOBAL.removeEventListener('keypress', onKeyPressCapture.bind(this), false);
            }
        }

        function getIsCapturing() {
            return isCapturing;
        }

        function onKeyDownCapture(evnt) {
            onKeyCapture(evnt, 'keydown');
        }

        function onKeyUpCapture(evnt) {
            onKeyCapture(evnt, 'keyup');
        }

        function onKeyPressCapture(evnt) {
            onKeyCapture(evnt, 'keypress');
        }

        function onKeyCapture (evnt, type) {

            if (keybindings[evnt.keyCode]) {
                evnt.preventDefault();
                GLOBAL.siteApp.events.trigger(configuration.eventNamespace + ':' + type + ':' + keybindings[evnt.keyCode], evnt);
            }

            if (configuration.showCapturedKeycodes) {
                console.log(type + ' - ' + evnt.keyCode);
            }
        }

        function configure (options) {
            for(var key in configuration) {
                if (options[key]) {
                    configuration[key] = options[key];
                }
            }
        }

        var publicAPI = {
            bindKey: bindKey,
            bindNextKey: bindNextKey,
            unbindKey: unbindKey,
            getBind: getBind,
            captureKeys: captureKeys,
            stopCaptureKeys: stopCaptureKeys,
            configure: configure,
            isCapturing: getIsCapturing
        };

        return publicAPI;
    }

    var instance = null;

    GLOBAL.keyboardCapture = {
        getInstance: function() {
            if (!instance) {
                instance = new keyboardCapture();
            }
            return instance;
        }
    };

})(window);