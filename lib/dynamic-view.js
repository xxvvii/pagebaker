const View = require('express/lib/view');

const DynamicView = function(name, options) {
    View.prototype.constructor.apply(this, [name, options]);
};

DynamicView.prototype = {};

Object.assign(DynamicView.prototype, View.prototype);

DynamicView.prototype.lookup = function() {

};

module.exports = DynamicView;