// MinQuery extend module from jQuery
 module.exports = function $Extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !this.isFunction(target)) {
        target = {};
    }

    // Extend MinQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && this.isArray(src) ? src : [];

                    } else {
                        clone = src && MinQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = this.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};