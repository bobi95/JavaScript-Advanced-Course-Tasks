(function canvasHelperInit (GLOBAL, DOC){

    function Context () {

        this.canvas = null;
        this.context = null;
    }

    function createContext (elem) {

        var ctx = new Context();

        ctx.context = null;
        ctx.canvas = null;

        if (elem instanceof HTMLCanvasElement) {
            ctx.canvas = elem;
        } else if (elem.getContext) {
            ctx.canvas = elem;
        } else if (typeof elem === 'string') {
            elem = DOC.getElementById(elem);
            if(elem && elem.getContext) {
                ctx.canvas = elem;
            }
        }

        if (ctx.canvas) {
            ctx.context = ctx.canvas.getContext('2d');
        }

        if (ctx.context && ctx.canvas) {
            return ctx;
        }

        return null;
    }

    var publicAPI = {
        createContext: createContext
    };

    GLOBAL.CanvasHelper = publicAPI;

})(window, document);