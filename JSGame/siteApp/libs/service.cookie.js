(function CookieInit (GLOBAL, DOC) {

    function Cookie (name, value) {
        var _name = (name || ''),
             _value = (value || {}),
             _expires = new Date(),
             _domain = '';

        this.setExpiration = function CookieSetExpiration (date) {

            if (date instanceof Date) {
                _expires = date;
            }

            if (typeof date === 'number') {
                _expires.setTime(date);
            }

        };

        this.getExpiration = function CookieGetExpiration () {
            return _expires.toUTCString();
        };

        this.setName = function CookieSetName (name) {
            if (name) {
                _name = encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&");
            }
        };

        this.getName = function CookieGetName () {
            return _name;
        };

        this.setDomain = function CookieSetDomain (domain) {
            _domain = encodeURIComponent(domain);
        };

        this.getDomain = function CookieGetDomain () {
            return _domain;
        };

        GLOBAL.Cookie = Cookie;

        function CookieService () {

            this.getCookie = function CookieServiceGetCookie (name) {

                if (!name) {
                    return null;
                }

                var cookies = DOC.cookie;

                var cookie = decodeURIComponent(cookies.replace(new RegExp("(?:(?:^|.*;)\\s*" +
                                                encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
                                                "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            };


        }
    }

})(window, document);