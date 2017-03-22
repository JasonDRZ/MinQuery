// methods acronym
var arr = [],
    slice = arr.slice,
    concat = arr.concat,
    push = arr.push,
    indexOf = arr.indexOf,
    class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty;
var $Prototype = {
    toArray: function () {
        return slice.call(this);
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
        return num != null ?

            // Return just the one element from the set
            (num < 0 ? this[num + this.length] : this[num]) :

            // Return all the elements in a clean array
            slice.call(this);
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (elems) {

        // Build a new MinQuery matched element set
        var ret = this.merge(this.constructor(), elems);

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;
        ret.context = this.context;

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function (callback, args) {
        return this.each(this, callback, args);
    },

    map: function (callback) {
        return this.pushStack(MinQuery.map(this, function (elem, i) {
            return callback.call(elem, i, elem);
        }));
    },

    slice: function () {
        return this.pushStack(slice.apply(this, arguments));
    },

    first: function () {
        return this.eq(0);
    },

    last: function () {
        return this.eq(-1);
    },

    eq: function (i) {
        var len = this.length,
            j = +i + (i < 0 ? len : 0);
        return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },

    end: function () {
        return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a MinQuery method.
    push: push,
    sort: arr.sort,
    splice: arr.splice
}
module.exports = $Prototype;