(function () {
    'use strict';

    function inherit(C, P) {
        var F = function () {};
        F.prototype = P.prototype;
        C.prototype = new F();
        C.__super__ = P.prototype;
        C.prototype.constructor = C;
    }

    /**
    * Shallow copy of an object
    */
    Narwhal.extend = function (dest /*, var_args*/) {
        var obj = Array.prototype.slice.call(arguments, 1);
        var current;
        for (var j=0; j<obj.length; j++) {
            if (!(current = obj[j])) continue;
            for (var key in current) {
                dest[key] = current[key];
            }
        }

        return dest;
    };

    /**
    /* Inherit from a class (using prototype borrowing)
    */
    Narwhal.extendClass = function (props, staticProps) {
        var parent = this;
        var child;

        child = props && props.hasOwnProperty('constructor') ? props.constructor : function () { return parent.apply(this, arguments); };

        // add static properties to the child constructor function
        Narwhal.extend(child, parent, staticProps);

        // associate prototype chain
        inherit(child, parent);

        // add instance properties
        if (props) Narwhal.extend(child.prototype, props);

        // done
        return child;
    };


})();
