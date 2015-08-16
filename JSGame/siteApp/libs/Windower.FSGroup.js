var Windower = Windower || {};

Windower.FSGroup = function (wrapper, options) {

    var events = {
        wrapper: function () {

        },
        fullscreen: function () {
            fullScreenToggled();
        },
        fullscreenError: function () {
            cancelFullScreen();
            fullScreenOff();
            console.log('"Fullscreenerror" occured!');
        },
        buttonOn: function () {
            requestFullScreen(settings.wrapper);
        },
        buttonOff: function () {
            cancelFullScreen();
        },
    };

    var settings = {
        wrapper: wrapper,
        buttonOn: null,
        buttonOnEventName: 'click',
        buttonOff: null,
        buttonOffEventName: 'click',
        classOn: 'fullScreenOn',
        classOff: 'fullScreenOff',
        addClassToButtons: false,
        onFullScreenOn: null,
        onFullScreenOff: null,
        onFullScreenToggle: null
    };

    if (options) {
        setNewSettings(options);
    }

    addDocumentEventHandlers();

    fullScreenToggled();

    function setNewSettings(options) {

        if (options.wrapper && options.wrapper instanceof HTMLElement) {
            settings.wrapper = options.wrapper;
        }

        // Button On
        if (options.buttonOn && options.buttonOn instanceof HTMLElement) {

            if (settings.buttonOn) {
                settings.buttonOn.removeEventListener(settings.buttonOnEventName,
                    events.buttonOn, false);
            }

            settings.buttonOn = options.buttonOn;

            if (options.buttonOnEventName && typeof options.buttonOnEventName ===
                'string') {
                settings.buttonOnEventName = options.buttonOnEventName;
            }

            settings.buttonOn.addEventListener(settings.buttonOnEventName,
                events.buttonOn, false);

        } else if (options.buttonOnEventName && typeof options.buttonOnEventName ===
            'string') {

            if (settings.buttonOn) {

                console.log(settings.buttonOnEventName + ' -> ' + options.buttonOnEventName);
                settings.buttonOn.removeEventListener(settings.buttonOnEventName,
                    events.buttonOn, false);
                settings.buttonOn.addEventListener(options.buttonOnEventName,
                    events.buttonOn, false);

            }

            settings.buttonOnEventName = options.buttonOnEventName;
        }

        // Button Off
        if (options.buttonOff && options.buttonOff instanceof HTMLElement) {

            if (settings.buttonOff) {
                settings.buttonOff.removeEventListener(settings.buttonOffEventName,
                    events.buttonOff, false);
            }

            settings.buttonOff = options.buttonOff;

            if (options.buttonOffEventName && typeof options.buttonOffEventName ===
                'string') {
                settings.buttonOffEventName = options.buttonOffEventName;
            }

            settings.buttonOff.addEventListener(settings.buttonOffEventName,
                events.buttonOff, false);

        } else if (options.buttonOffEventName && typeof options.buttonOffEventName ===
            'string') {

            if (settings.buttonOff) {

                settings.buttonOff.removeEventListener(settings.buttonOffEventName,
                    events.buttonOff, false);
                settings.buttonOff.addEventListener(options.buttonOffEventName,
                    events.buttonOff, false);

            }

            settings.buttonOffEventName = options.buttonOffEventName;
        }

        if (options.classOn && typeof options.classOn === 'string') {
            settings.classOn = options.classOn;
        }

        if (options.classOff && typeof options.classOff === 'string') {
            settings.classOff = options.classOff;
        }

        if (options.addClassToButtons && typeof options.addClassToButtons ===
            'boolean') {
            settings.addClassToButtons = options.addClassToButtons;
        }

        if (options.onFullScreenOn && typeof options.onFullScreenOn ===
            'function') {
            settings.onFullScreenOn = options.onFullScreenOn;
        }

        if (options.onFullScreenOff && typeof options.onFullScreenOff ===
            'function') {
            settings.onFullScreenOff = options.onFullScreenOff;
        }

        if (options.onFullScreenToggle && typeof options.onFullScreenToggle ===
            'function') {
            settings.onFullScreenToggle = options.onFullScreenToggle;
        }
    }

    function addDocumentEventHandlers() {
        var name = [];

        name.push('fullscreen');
        name.push('webkitfullscreen');
        name.push('mozfullscreen');
        name.push('msfullscreen');

        name.forEach(function (text) {
            document.addEventListener(text + 'change', events.fullscreen,
                false);
            document.addEventListener(text + 'error', events.fullscreenError,
                false);
        });
    }

    function fullScreenToggled() {

        var details = {
            fullscreen: true,
            settings: settings
        };

        if (document.fullscreenElement || // alternative standard method
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement) {

            fullScreenOn();

        } else {

            details.fullscreen = false;

            fullScreenOff();
        }

        var eventToggle = new CustomEvent('fullscreentoggle', {
            'detail': details
        });

        if (settings.onFullScreenToggle) {
            settings.onFullScreenToggle(details);
        }

        settings.wrapper.dispatchEvent(eventToggle);
    }

    function fullScreenOn() {

        setClass(settings.wrapper, settings.classOn, settings.classOff);

        if (settings.addClassToButtons) {

            setClass(settings.buttonOn, settings.classOn, settings.classOff);
            setClass(settings.buttonOff, settings.classOn, settings.classOff);

        }

        var details = {
            fullscreen: true,
            settings: settings
        };

        var eventOn = new CustomEvent('fullscreenon', {
            'detail': details
        });

        if (settings.onFullScreenOn) {
            settings.onFullScreenOn(details);
        }

        settings.wrapper.dispatchEvent(eventOn);

    }

    function fullScreenOff() {

        setClass(settings.wrapper, settings.classOff, settings.classOn);

        if (settings.addClassToButtons) {

            setClass(settings.buttonOn, settings.classOff, settings.classOn);
            setClass(settings.buttonOff, settings.classOff, settings.classOn);

        }

        var details = {
            fullscreen: false,
            settings: settings
        };

        var eventOff = new CustomEvent('fullscreenoff', {
            'detail': details
        });

        if (settings.onFullScreenOff) {
            settings.onFullScreenOff(details);
        }

        settings.wrapper.dispatchEvent(eventOff);

    }

    function requestFullScreen(item) {

        if (item.requestFullScreen) {

            item.requestFullScreen();

        } else if (item.webkitRequestFullscreen) {

            item.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

        } else if (item.mozRequestFullScreen) {

            item.mozRequestFullScreen();

        } else if (item.msRequestFullscreen) {

            item.msRequestFullscreen();

        }
    }

    function cancelFullScreen() {

        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.exitFullScreen) {
            document.exitFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullScreen) {
            document.msExitFullScreen();
        }
    }

    function setClass(item, newClass, oldClass) {

        if (!item) {
            console.log('item: ');
            console.log(item);

            console.log(
                '\n Have you set the buttonOn and buttonOff settings correctly?'
            );
            return;
        }

        if (oldClass && item.classList.contains(oldClass)) {
            item.classList.remove(oldClass);
        }

        if (newClass && !item.classList.contains(newClass)) {
            item.classList.add(newClass);
        }
    }

    var publicAPI = {
        setSettings: setNewSettings,
        getSetting: function (name) {
            if (settings[name]) {
                return settings[name];
            }
        },
        fullscreenOff: function () {
            cancelFullScreen();
        }
    };

    return publicAPI;
};

if (!FSGroup) {
    var FSGroup = Windower.FSGroup;
}