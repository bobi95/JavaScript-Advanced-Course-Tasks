(function (GLOBAL) {

    var siteApp = GLOBAL.siteApp || {};
    var config = siteApp.config;

    function AjaxRequest(options) {

        this.options = {
            url: '',
            type: config.ajax.type,
            dataType: config.ajax.dataType,
            contentType: config.ajax.contentType,
            async: config.ajax.async,
            data: {},
            success: undefined,
            error: undefined
        };

        if (options) {
            for (var key in this.options) {
                this.options[key] = options[key];
            }
        }
    }

    AjaxRequest.prototype.send = function () {

        var http,
            options = this.options;

        if (GLOBAL.XMLHttpRequest) {
            http = new GLOBAL.XMLHttpRequest();
        } else {
            http = new GLOBAL.ActiveXObject("Microsoft.XMLHTTP");
        }

        function onReadyStateChange() {
            if (http.readyState === 4) {

                // on success
                if (http.status === 200 && options.success && typeof options.success === 'function') {
                    options.success(http.responseText);
                }

                // on error
                if (http.status > 202 && options.error && typeof options.error === 'function') {
                    console.log('Http response status: ' + http.statusText + ' (' + http.status + ')');
                    options.error(http);
                }
            }
        }

        if (options.async) {
            http.onreadystatechange = onReadyStateChange;
        }

        if (options.type === 'GET') {
            http.open(options.type, options.url + '?' + _parseDataAsGet(options.data), options.async);
        } else {
            http.open(options.type, options.url, options.async);
        }

        if (options.type === "POST") {

            http.setRequestHeader("Content-type", options.contentType);
            http.send(options.data);

        } else {

            http.send();

        }

        if (!options.async) {
            onReadyStateChange();
        }

        function _parseDataAsGet(data) {
            var result = "noCacheIndex=" + Math.random(),
                stringData = [];

            for (var index in data) {
                stringData.push(index + "=" + data[index]);
            }

            stringData = stringData.join('&');

            if (stringData) {
                result += '&' + stringData;
            }

            return result;
        }
    };

    AjaxRequest.prototype.get = function (url, data) {

        if (url) {
            this.options.url = (url || '');
        }

        if (data) {
            this.options.data = (data || {});
        }

        this.options.type = 'GET';
        this.send();
    };

    AjaxRequest.prototype.post = function (url, data) {

        if (url) {
            this.options.url = (url || '');
        }

        if (data) {
            this.options.data = (data || {});
        }

        this.options.type = 'POST';
        this.send();

    };

    GLOBAL.AjaxRequest = AjaxRequest;
})(window);