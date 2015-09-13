(function mapInit(GLOBAL, DOC){

    function Map (mapInfo, configuration) {
        var config = {
            segmentWidth: 64,
            segmentHeight: 64,
            segmentsWide: 20,
            segmentsHigh: 20
        };

        if (configuration) {
            for(var prop in config) {
                if(configuration[prop]) {
                    config[prop] = configuration[prop];
                }
            }
        }


    }

    function MapSegment () {

        this.traversable    = true;
        this.texture        = null;
        this.visibility     = 0;
        this.neightbours    = {
            left: null,
            above: null,
            right: null,
            below: null
        };
    }

    (function mapSegmentVisibilityEnumInit() {
        var _mapSegmentVisibility = {
            unExplored: 0,
            fogOfWar: 1,
            vvisible: 2
        };

        var result = {};

        // make all values constants
        for(var key in _mapSegmentVisibility) {
            Object.defineProperty(result, key, {
                configurable: false,
                enumerable: true,
                value: _mapSegmentVisibility[key],
                writable: false
            });
        }

        // make the enum a constant
        Object.defineProperty(MapSegment, "visibilityEnum", {
            configurable: false,
            enumerable: true,
            value: result,
            writable: false
        });

    })();

})(window, document);