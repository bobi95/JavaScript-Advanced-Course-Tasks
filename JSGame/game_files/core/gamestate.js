(function (global) {

    var instance = null;

    // enumerator for the gamestates
    var gameConditions = {

        mainMenu: 0,
        options: 1,
        loadSave: 2,
        playing: 3,
        pauseMenu: 4,
        end: 5

    };

    var publicGameConditions = {};

    for(var key in gameConditions) {
        Object.defineProperty(publicGameConditions, key, {
            configurable: false,
            enumerable: true,
            value: gameConditions[key],
            writable: false
        });
    }

    function GameState() {

        this.level = null;
        this.entities = {};
        this.input = {};
        this.player ={};

        this.gameCondition = 0;
    }

    var publicApi = {
        getInstance: function () {
            if (!instance) {
                instance = new GameState();
            }
            return instance;
        }
    };

    // create the publicly visible enumerator
    // it and all of it's elements are constants
    Object.defineProperty(publicApi, 'gameConditions', {
        configurable: false,
        enumerable: false,
        value: publicGameConditions,
        writable: false
    });

    global.GameState = publicApi;
})(window);