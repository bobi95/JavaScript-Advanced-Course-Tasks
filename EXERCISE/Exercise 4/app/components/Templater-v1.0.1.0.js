/**
 * An API for creating and executing templates.
 *
 * The Templater can compile html code into templates.
 * The templates can be run multiple times with different
 * contexts (ViewModels).
 * These templates can echo text from the VM, run functions
 * which return text to be included into the result of the template,
 * make a partial template (sub-template) cycle multiple times, using
 * the VM or a part of it, or just contain a partial template, which
 * can be retrieved at will from the template object.
 *
 * Made by Borislav Rangelov
 * 3 August, 2015.
 *
 * Licence: Apache licence 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * (link included and existed on 3 August 2015 - may or may not exist
 * in the future)
 *
 * Template Code:
 * {{variable_name}} - Echoes a member of the VM with the required
 *                     name. 'this' can be used to reference
 *                     the VM of the executing template.
 *
 * {{#function_name [context_object]}}
 *                   - Will look for and run a function with the
 *                     required name. A context object may be
 *                     specified to be given to the function in
 *                     the function context ('this.model'). The
 *                     executing template can be accessed as
 *                     'this.template'.
 *
 * {{#template_name#}}
 *                   - Create a plain sub-template with given name.
 *                     Enclose the desired template html with
 *                     {{/#template-name#}}.
 *                     Warning: Be careful when creating 'trees' with
 *                     templates. If template A is opened before B,
 *                     always close B before closing A.
 *
 * {{#template_name# context_object_VM [number / context_object]}}
 *                   - Create a template cycle, which executes the
 *                     specified template number/context_object
 *                     number ot times or ONCE if no
 *                     number/context_object is specified.
 *                     The template is going to use the specified
 *                     context_object_VM as a VM.
 *
 *
 *
 * Example:
 *
 * [Given HTML:]
 * <p>
 *     This is the {{template_name}} template. <br>
 *     It's sub-template is going to execute {{number}} number of times:<br>
 * {{#SubTemplate# this.subtemplate this.number}}
 *     Executed: {{#MyFunction this}}<br>
 * {{/#SubTemplate#}}
 * </p>
 *
 * [Javascript:]
 * var template = new Template(html);
 *
 * template.innerTemplates.SubTemplate.functions.MyFunction = function () {
 *     var result = this.model.time;
 *     this.model.time++;
 *     return result;
 * };
 *
 * [OR]
 *
 * var subTemplateFuncs = template.innerTemplate.functions;
 * subTemplateFuncs.MyFunction = function () {
 *     var result = this.model.time;
 *     this.model.time++;
 *     return result;
 * };
 *
 * [Create the View Model:]
 *
 * var vm = {
 *    template_name: "My Template",
 *    number: 10,
 *    subtemplate: {
 *        time: 1
 *    }
 * };
 *
 * [Run the template:]
 * var result = template.run(vm);
 *
 * document.getElementsByTagName('body')[0].innerHTML = result;
 *
 * Result:
 *
 * This is the My Template template.
 * It's sub-template is going to execute 10 number of times:
 * Executed: 1
 * Executed: 2
 * Executed: 3
 * Executed: 4
 * Executed: 5
 * Executed: 6
 * Executed: 7
 * Executed: 8
 * Executed: 9
 * Executed: 10
 *
 */

/**
 * General error, thrown by the template engine
 * @param {String} errorMsg Error message
 */
var TemplateError = function (errorMsg) {

    this.message = (errorMsg || '');
    this.name = 'TemplateError';

};

TemplateError.prototype = Object.create(Error.prototype);
TemplateError.constructor = TemplateError;

/**
 * Error, thrown when a function of the Template
 * class is being used not on an instance of the
 * Template class
 * @param {String} errorMsg Error message
 */
var ContextError = function (errorMsg) {
    this.message = (errorMsg || '');
    this.name = 'ContextError';
};

ContextError.prototype = Object.create(TemplateError.prototype);
ContextError.constructor = ContextError;

/**
 * Template class
 * @param {String} HTML to compile into a template. Not required!
 */
var Template  = function (html) {

    if (!(this instanceof Template)) {
        throw new ContextError('Template\'s context is not a Template\'s! Use the \'new\' keyword! Execution stopped!');
    }

    /**
     * Array of objects in a specific order, which tell the template
     * engine how to create the output and in what order.
     * @type {Array}
     */
    this.processQueue = [];

    /**
     * Key-value dictionary of templates, which are contained within
     * this template. They may or may-not be executed.
     * @type {Template}
     */
    this.innerTemplates = {};

    /**
     * Key-value dictionary of functions, which will be called in the
     * template.
     * @type {Object}
     */
    this.functions = {};

    if (html) {
        this.compile(html);
    }
};

/**
 * Compiles the given HTML, reseting this template.
 * @param {String} html HTML to be compiled into the template
 */
Template.prototype.compile = (function TemplateCompileInit () {

    var expressionsRAW = {
        findCode: '(.+?(?:{{[^{}]*}}))',
        templateCodeRaw: '[^{}]+',
        nameRaw: '[a-z_][a-z0-9_]*',
        funcPrefix: '#',
    };

    expressionsRAW.objRaw = expressionsRAW.nameRaw + '(?:\\.' +
        expressionsRAW.nameRaw + ')*';
    // [a-z_][a-z0-9_]*(?:\\.[a-z_][a-z0-9_]*)*

    expressionsRAW.func = expressionsRAW.funcPrefix + expressionsRAW.nameRaw;
    // #[a-z_][a-z0-9_]*

    expressionsRAW.funcCapture = expressionsRAW.funcPrefix + '(' +
        expressionsRAW.nameRaw + ')';
    // #([a-z_][a-z0-9_]*)

    expressionsRAW.partial =
        expressionsRAW.funcPrefix + '(' + expressionsRAW.nameRaw + ')' +
        expressionsRAW.funcPrefix + //partial's name
        '(?:\\s+(' + expressionsRAW.objRaw + ')(?:\\s+((?:\\d+)|(?:' +
        expressionsRAW.objRaw + ')))?)?';
    // ^{{#([a-z_][a-z0-9_]*)#(?:\s+([a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*)(?:\s+((?:\d+)|(?:[a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*)))?)?}}$

    expressionsRAW.closePartial = function (name) {
        return '\\/' + expressionsRAW.funcPrefix + '(' + name + ')' +
            expressionsRAW.funcPrefix;
    };
    // /#(name)#

    /**
     * The expressions used to capture template code from the given html
     * @type {Object}
     */
    var expressions = {
        findCode: new RegExp(expressionsRAW.findCode, 'i'),
        templateCode: new RegExp('({{' + expressionsRAW.templateCodeRaw +
            '}})', 'g'),
        func: new RegExp('^{{' + expressionsRAW.funcCapture +
            '(?:\\s+(' + expressionsRAW.objRaw + '))?}}$', 'i'),
        // ^{{#([a-z_][a-z0-9_]*)(?:\\s+((?:[a-z_][a-z0-9_.]*[a-z0-9_])|(?:[a-z_][a-z0-9_]*)))?}}$
        obj: new RegExp('^{{(' + expressionsRAW.objRaw + ')}}$',
            'i'),
        partial: new RegExp('^{{' + expressionsRAW.partial + '}}$',
            'i'),
        closePartial: function (name) {
            return new RegExp('{{' + expressionsRAW.closePartial(
                name) + '}}', 'i');
        }
    };

    /**
     * @param  {String} capturedCode   Code from the HTML
     * @param  {Object} compileContext Context for the compiler. Contains necessary data.
     * @return {Object}                Action object for the processQueue with additional
     *                                 additional data if necessary
     */
    function _actionFactory (capturedCode, compileContext) {

        // is the code a function
        var code = capturedCode.match(expressions.func);

        if (code) {

            var funcName = code[1],
                funcContext = (code[2] || 'this');

            funcContext = funcContext.split('.');

            return {
                action: _actionFunction(funcName, funcContext)
            };
        }

        // code of an 'echo' action
        code = capturedCode.match(expressions.obj);

        if (code) {

            var objContext = code[1].split('.');

            return {
                action: _actionEcho(objContext)
            };
        }

        // code of a plain or an auto-executing template
        code = capturedCode.match(expressions.partial);

        if (code) {

            var templName = code[1],
                closeTagExp = expressions.closePartial(templName),
                closingTagIndex = compileContext.html.search(closeTagExp),
                newHTML = compileContext.html.substring(0, closingTagIndex),
                templContext = code[2],
                templTimes = code[3];

            // remove html for inner template from rest of html
            compileContext.html = compileContext.html.substring(closingTagIndex + compileContext.html.match(
                closeTagExp)[0].length);

            var innerTemplate = new Template(newHTML);

            // is the template an auto-executed one
            if (templContext || templTimes) {

                // if for some reason the context wasn't captured, it will default to 'this'
                if (templContext) {

                    templContext = templContext.split('.');

                } else {

                    templContext = ['this'];

                }

                if (templTimes) {

                    if (!isNaN(Number(templTimes))) {

                        templTimes = Math.floor(templTimes);

                    } else {

                        templTimes = templTimes.split('.');
                    }

                } else {

                    templTimes = 1;
                }

                return {
                    action: _actionTemplateAutoExecution(templName, templTimes, templContext),
                    template: innerTemplate
                };

            // if it's a plain template
            } else {

                return {
                    action: _actionTemplate(templName),
                    template: innerTemplate
                };

            }
        }
    }

    /**
     * Creates an action object for plain text parsing
     * @param  {String} text Text to be parsed
     * @return {Object}      Action object
     */
    function _actionPlainText (text) {
        return {
            type: 'text',
            value: text
        };
    }

    /**
     * Creates an action object for parsing an item from
     * the context
     * @param  {Array}  contextPath Path to item for parsing
     * @return {Object}             Action object
     */
    function _actionEcho (contextPath) {
        return {
            type: 'echo',
            path: contextPath
        };
    }

    /**
     * Creates an action object for calling a function
     * @param  {String} name    Name of function
     * @param  {Array}  context Path to context for the function
     * @return {Object}         Action object
     */
    function _actionFunction (name, context) {
        return {
            type: 'function',
            name: name,
            context: context
        };
    }

    /**
     * Creates an action object for adding a template to the
     * innerTemplates collection. It WILL NOT be added to the
     * process queue!
     * @param  {String} name Name of template
     * @return {Object}      Action object
     */
    function _actionTemplate (name) {
        return {
            type: 'template',
            name: name
        };
    }

    /**
     * Creates an action object for an auto-executed template.
     * It holds information for the context to be used and the
     * number of times the template will be run.
     * @param  {String} name    Name of template
     * @param  {Mixed}  times   Number of times or path to the
     *                          number in the context
     * @param  {Array}  context Path to context
     * @return {Object}         Action object
     */
    function _actionTemplateAutoExecution (name, times, context) {
        return {
            type: 'templateAutoExecute',
            name: name,
            times: times,
            context: context
        };
    }

    /**
     * Compiles the given HTML, reseting this template.
     * @param {String} html HTML to be compiled into the template
     */
    return function _compile (html) {

        if (!(this instanceof Template)) {
            throw new ContextError('The context is not that of a Template\'s! Execution stopped!');
        }

        if (!html || typeof html !== 'string') {
           throw new TemplateError('Invalid argument value. Expected: string');
        }

        // reset the template
        this.processQueue = [];
        this.innerTemplates = {};
        this.functions = {};

        var compileContext = {
            html: html
        };

        // start search for template code
        while (true) {

            var indexOfCode = compileContext.html.search(expressions.templateCode);

            // if there is no more code, break the cicle
            if (indexOfCode == -1) {

                if (compileContext.html) {
                    this.processQueue.push(_actionPlainText(compileContext.html));
                }

                break;
            }

            // if there is non-code text before the template code
            // add it to the queue
            if (indexOfCode !== 0) {

                var nonCode = compileContext.html.substring(0, indexOfCode);
                this.processQueue.push(_actionPlainText(nonCode));
                compileContext.html = compileContext.html.substring(nonCode.length);
                continue;
            }

            var codeMatch = compileContext.html.match(expressions.templateCode);

            // something went wrong, abborting
            if (!codeMatch) {
                break;
            }

            // remove code from html
            compileContext.html = compileContext.html.substring(codeMatch[0].length);

            // get the action
            var codeResult = _actionFactory(codeMatch[0], compileContext);

            // add the action
            if (codeResult.action.type !== 'template') {
                this.processQueue.push(codeResult.action);
            }

            // plain templates and auto-executing templates have to be added to
            // the inner template collection
            if (codeResult.action.type === 'template' ||
                codeResult.action.type === 'templateAutoExecute') {

                this.innerTemplates[codeResult.action.name] = codeResult.template;

            }

            // functions are added to the function collection
            if (codeResult.action.type === 'function') {
                this.functions[codeResult.action.name] = null;
            }
        }
    };

})();

/**
 * Runs the template using the given context
 * @param  {Object} context Context for the template
 * @return {String}         Result
 */
Template.prototype.run = function (context) {

    if (!(this instanceof Template)) {
        throw new ContextError('Template\'s context is not a Template\'s! Execution stopped!');
    }

    var output = '';

    function _getFromObject (obj, path) {

        var result = obj;

        for(var i = 0, j = path.length; i < j; i++) {

            if (i !== 0 || path[i] !== 'this') {
                result = obj[path[i]];
            }

        }

        return result;
    }

    for (var i = 0, j = this.processQueue.length; i < j; i++) {

        var action = this.processQueue[i];

        if (action.type === 'text') {

            output += action.value;

        } else if (action.type === 'echo') {

            output += _getFromObject(context, action.path);

        } else if (action.type === 'function') {

            if (this.functions[action.name]) {

                var funcContext ={
                    model: _getFromObject(context, action.context),
                    template: this
                };


                var result = this.functions[action.name].call(funcContext);

                if (result) {
                    output += result;
                }

            }

        } else if (action.type === 'templateAutoExecute') {

            var template = this.innerTemplates[action.name],
                templContext  = _getFromObject(context, action.context),
                templTimes = Number.isInteger(action.times) ?
                                action.times : _getFromObject(context, action.times);

            // not checking context because it might be intended to be an empty object,
            // empty array or even something else, which results in false in 'if's
            if (template && templTimes) {

                for (; templTimes > 0; templTimes--) {
                    output += template.run(templContext);
                }

            }

        }
    }

    return output;
};

app.registerModule('Templater');

// Best of 5 test: 15008ms (v1.0.0.0 - 16106ms)
// Cycle from start to end of file 1,000,000 times

// Best of 5 test: 1953ms (v1.0.0.0 - 12304ms)
// Template run 1,000,000 times

// Best of 5 test: 5085 (v1.0.0.0 - 5376ms)
// Template compiled 1,000,000 times

// var html =
//                 '<p>This is the {{template_name}} template. <br>' +
//                 'Its sub-template is going to execute {{number}} number of times:<br>' +
//                 '{{#SubTemplate# this.subtemplate this.number}}' +
//                 'Executed: {{#MyFunction this}}<br>' +
//                 '{{/#SubTemplate#}}</p>';



// var template = new Template();
// template.compile(html);

// template.innerTemplates.SubTemplate.functions.MyFunction = function () {
//     var result = this.model.time;
//     this.model.time++;
//     return result;
// };

// var result = '';
// var beforeCycle = new Date();

// for (var i = 0; i < 1000000; i++) {
//     result = template.run({
//                 template_name: "My Template",
//                 number: 10,
//                 subtemplate: {
//                     time: 1
//                 }
//             });

//     var template = new Template(html);
// }

// var afterCycle = new Date();

// console.log(afterCycle - beforeCycle);
//console.log(result);