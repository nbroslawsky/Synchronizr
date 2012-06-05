Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    value: function(from) {
        var dest = this;
        Object.getOwnPropertyNames(from).forEach(function(name) {
            Object.defineProperty(dest, name, Object.getOwnPropertyDescriptor(from, name));
        });
        return this;
    }
});