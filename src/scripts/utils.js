(function () {

    function inherit(C, P) {
        var F = function () {};
        F.prototype = P.prototype;
        C.prototype = new F();
        C.__super__ = P.prototype;
        C.prototype.constructor = C;
    }

    Narwhal.extend = function (props, static) {
        var parent = this;

        if (props && props.hasOwnProperty('constructor')) {
            child = props.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // add static properties to the child constructor function
        $.extend(child, parent, static);

        // associate prototype chain
        inherit(child, parent);

        // add instance properties
        if (props) $.extend(child.prototype, props);

        // done
        return child;
    };


})();
