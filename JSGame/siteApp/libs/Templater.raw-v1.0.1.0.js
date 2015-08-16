var JSSerializer = JSSerializer || {};

JSSerializer.rawTemplate = (function Init () {

    function _rawTemplate (template, varName) {

        var result = '(function(){var newTemplate=new Template();newTemplate.processQueue=';

        result += JSSerializer.array(template.processQueue);

        result += ';newTemplate.innerTemplates={';

        var hasAny = false;
        for(var name in template.innerTemplates) {

            hasAny = true;
            result += name + ': ' + _rawTemplate(template.innerTemplates[name]) + ',';

        }

        if (hasAny) {
            result = result.slice(0, result.length - 1);
        }

        result += '};newTemplate.functions=';
        result += JSSerializer.data(template.functions);
        result += ';return newTemplate;})()';

        return result;
    }

    /**
     * Generate a raw JS vertion of the template
     * @param  {Template} template Template
     * @param  {String} name     Variable name to be automatically given
     * @param  {Boolean} download Redirect to a javascript file
     * @return {String}          Raw javascript
     */
    return function (template, name, download) {

        var result = 'var Templater=Templater || {};Templater.Views=Templater.Views || {};Templater.Views["' + name + '"]=' +  _rawTemplate(template) + ';';

        if (download) {
            window.open(
                'data:text/javascript;charset=utf-8,' +
                escape(result));
        } else {
            return result;
        }

    };
})();