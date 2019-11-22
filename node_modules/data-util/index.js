/*jslint node: true */
"use strict";

var u       = require("underscore");

exports.truth = (function () {
    var tex = /^\s*(?:true|yes|t|y|1)\s*$/i,
        fex = /^\s*(?:false|no|f|n|0)?\s*$/i;

    return function (v) {

        var rval;

        if (v === null || v === undefined) {
            rval = undefined;
        } else if (u.isBoolean(v)) {
            rval = v;
        } else if (u.isString(v)) {
            if (v.match(tex)) {
                rval = true;
            } else if (v.match(fex)) {
                rval = false;
            } else {
                throw new Error("cannot convert string to boolean");
            }
        } else if (v  === 0) {
            rval = false;
        } else if (v  === 1) {
            rval = true;
        } else {
            throw new Error("cannot convert type to boolean");
        }

        return rval;
    };
}());

exports.nstr = function (v) {
    var temp, rval;

    if (v === null || v === undefined) {
        rval = undefined;
    } else if (u.isString(v)) {
        temp = v.trim();
        rval = temp || undefined;
    } else {
        throw new Error("cannot normalize non-string");
    }

    return rval;
};

exports.num = function (v) {
    var temp, rval;
    if (v === null || v === undefined) {
        rval = undefined;
    } else if (u.isNumber(v)) {
        rval = v;
    } else if (u.isString(v)) {
        temp = parseFloat(v || "0");
        rval = u.isNaN(temp) ? undefined : temp;
    } else {
        throw new Error("cannot convert to number");
    }
    return rval;
};

exports.require = function (v, desc) {
    if (v === null || v === undefined) {
        throw new Error(desc || "value is required");
    }
    return v;
};

