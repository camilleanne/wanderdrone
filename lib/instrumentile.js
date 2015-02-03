!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.instrumentile=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/camille/dev/MapBox/wanderdrone/node_modules/instrumentile/instrumentile.js":[function(require,module,exports){
'use strict';

var Instrumentile = L.Class.extend({

    initialize: function(layer, endpoint, options){
        this.endpoint = endpoint;
        this.options = options || {};

        this.initialLoad = true;
        this.tileStats = {};

        layer.on({
            'tileloadstart': this._setTileLoadStart,
            'tileload': this._calcTileLoadTime,
            'load': this._calcAverageTileLoadTime
            }, this); 
    },

    _setTileLoadStart: function(e) {
        var tileUrl = e.tile.src;
        this.tileStats[tileUrl] = {tileloadstart: this._performance()};
    },

    _calcTileLoadTime: function(e){
        var tileUrl = e.tile.src;

        if (tileUrl in this.tileStats){
            var tileLoad = this._performance();
            this.tileStats[tileUrl]['tileloadtime'] = tileLoad - this.tileStats[tileUrl]['tileloadstart'];
        }
    },

    _calcAverageTileLoadTime: function(e){
        var averageTileLoadTime = 0,
        tileLoadCount = 0;

        for (var tile in this.tileStats){
            if ('tileloadtime' in this.tileStats[tile]){
                averageTileLoadTime += this.tileStats[tile].tileloadtime;
                tileLoadCount += 1;
            }
        }
        averageTileLoadTime = Math.round(averageTileLoadTime / tileLoadCount);

        var statsObj = (this.initialLoad) ?
            {tileloadtime: averageTileLoadTime,
            tileloadcount_initial: tileLoadCount} :
            {tileloadtime: averageTileLoadTime,
            tileloadcount_pan: tileLoadCount};

        if (tileLoadCount > 0 ){
            this._logToPong(statsObj);
        }

        this.tileStats = {};
        this.initialLoad = false;
    },

    // _logToPong is the entire Pong Client
    // creates blank image to post to Pong
    _logToPong: function(e) {
        var img = new Image();
        img.src = this.endpoint + L.Util.getParamString(e, this.endpoint);
        if (this.options.log) console.log('sent: ', img.src)
        img.onload = img.onerror = function() {
            img = null;
        };
    },

    //use performance.now over new Date() when available
    _performance: function(){
        if (window.performance && window.performance.now){
            return window.performance.now();
        } else {
            return new Date();
        }
    }
});

module.exports = function(_, endpoint, options) {
    return new Instrumentile(_, endpoint, options);
};
},{}]},{},["/Users/camille/dev/MapBox/wanderdrone/node_modules/instrumentile/instrumentile.js"])("/Users/camille/dev/MapBox/wanderdrone/node_modules/instrumentile/instrumentile.js")
});