var JSSerializer = JSSerializer || {};

(function Init () {

    function _rawData(item) {

        var type = typeof item;

        if (item === null) {

            return 'null';

        } else if (item === undefined) {

            return 'undefined';

        } else if (type === 'string') {

            return '\'' + item + '\'';

        } else if (Object.prototype.toString.call(item) ===
            '[object Array]') {

            return _rawArray(item);

        } else if (type === 'object') {

            return _rawObject(item);

        } else if (type === 'function') {

            return item.toString().replace(
                /((?:{)|(?:})|(?:;))\s+(\S)/ig, '$1 $2');

        } else {

            return item.toString();
        }

    }

    function _rawArray(collection) {

        var result = '[';

        for (var i = 0, n = collection.length; i < n; i++) {

            result += _rawData(collection[i]);

            if (i < (n - 1)) {
                result += ',';
            }

        }

        result += ']';

        return result;
    }

    function _rawObject(item) {
        var result = '{';

        var hasItems = false;

        for (var key in item) {

            hasItems = true;

            result += key + ':' + _rawData(item[key]) + ',';

        }

        if (hasItems) {
            result = result.slice(0, result.length - 1); // remove last ','
        }

        result += '}';

        return result;
    }

    // public API

    JSSerializer.object = _rawObject;
    JSSerializer.array = _rawArray;
    JSSerializer.data = _rawData;

})();