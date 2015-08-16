var Windower = Windower || {};

Windower.ProgressBar = function (barElement, options) {

    if (!(barElement instanceof HTMLElement)) {
        throw new Error('Bar element is not an HTML element.');
    }

    var settings = {
        bar: barElement,
        textElement: undefined,
        textPrefix: '',
        textSuffix: '',
        step: 0,
        maxSteps: 1,
        onStep: undefined,
        onFinished: undefined
    };

    _calcBarWidth();

    if (options) {
        setNewSettings(options);
    }

    function setNewSettings(newSettings) {

        if (newSettings.bar && newSettings.bar instanceof HTMLElement) {
            settings.bar = newSettings.bar;
            _calcBarWidth();
        }

        if (newSettings.textElement) {
            settings.textElement = newSettings.textElement;
        }

        if (newSettings.textPrefix) {
            settings.textPrefix = newSettings.textPrefix;
        }

        if (newSettings.textSuffix) {
            settings.textSuffix = newSettings.textSuffix;
        }

        if (Number.isInteger(newSettings.step)) {
            settings.step = newSettings.step;
        }

        if (Number.isInteger(newSettings.maxSteps)) {
            settings.maxSteps = newSettings.maxSteps;
        }

        if (typeof newSettings.onStep === 'function') {
            settings.onStep = newSettings.onStep;
        }

        if (typeof newSettings.onFinished === 'function') {
            settings.onFinished = newSettings.onFinished;
        }
    }

    function getSetting(name) {

        return settings[name];
    }

    function setStep(step, textToDisplay) {

        if (Number.isInteger(step)) {

            if (step > settings.maxSteps) {
                step = settings.maxSteps;
            }

            if (step === settings.step) {
                return;
            }

            settings.step = step;

            _calcBarWidth();
            _setText(textToDisplay);
            _triggerEvents();
        }
    }

    function nextStep(textToDisplay) {

        if (settings.step === settings.maxSteps) {
            return;
        }

        settings.step++;

        _calcBarWidth();
        _setText(textToDisplay);
        _triggerEvents();
    }

    function _calcBarWidth() {
        settings.bar.style.width = 100 * (settings.step / settings.maxSteps) +
            '%';
    }

    function _setText(textToDisplay) {

        if (settings.textElement) {

            var text = settings.textPrefix;

            if (textToDisplay) {

                text += textToDisplay;

            } else {

                text += (100 * (settings.step / settings.maxSteps)).toFixed(2);
            }

            text += settings.textSuffix;

            if ('value' in settings.textElement) {

                settings.textElement.value = text;

            } else {

                settings.textElement.innerText = text;

            }
        }
    }

    function _triggerEvents() {

        var details = {
                bar: settings.bar,
                textElement: settings.textElement,
                step: settings.step,
                maxSteps: settings.maxSteps,
            },
            stepEvent = new CustomEvent('onstep', {
                detail: details
            });

        if (settings.onStep) {
            settings.onStep(stepEvent);
        }

        settings.bar.dispatchEvent(stepEvent);

        if (settings.step === settings.maxSteps) {
            var finishedEvent = new CustomEvent('onfinished', {
                detail: details
            });

            if (settings.onFinished) {
                settings.onFinished(finishedEvent);
            }

            settings.bar.dispatchEvent(finishedEvent);
        }

    }

    var publicAPI = {

        setNewSettings: setNewSettings,
        getSetting: getSetting,
        setStep: setStep,
        nextStep: nextStep,
        onFinished: function (func) {
            if (typeof func === 'function') {
                settings.onFinished = func;
            } else {
                settings.onFinished = undefined;
            }
        },
        onStep: function (func) {
            if (typeof func === 'function') {
                settings.onStep = func;
            } else {
                settings.onStep = undefined;
            }
        }

    };

    return publicAPI;
};