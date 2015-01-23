(function () {
    'use strict';

    /**
    * JSON connector
    *
    * JSON data is assumed to have the following format:
    *   `{ "field1": ["a", "b", "c"], "field2": [1,2,3] }`
    *
    * ### Example:
    *
    *       var json = '{...}';
    *       var ds = new Contour.connectors.Json(json);
    *
    *       new Contour({
    *         el: '.myChart',
    *         xAxis: { title: 'Quarter' },
    *         yAxis: { title: 'Profit ($)' }
    *       })
    *       .cartesian()
    *       .column(ds.measure('profit'))
    *       .render();
    *
    * @class Contour.connectors.Json
    */
    Contour.connectors.Json = Contour.connectors.ConnectorBase.extend({
        constructor: function (json) {
            this._dimension = 0;
            this.parse(json);
            return this;
        },

        parse: function (raw) {
            var keys = _.keys(raw);
            this._headers = _.map(keys, function (d) { return d.toLowerCase(); }) || [];
            this._data = [];

            for (var i=0; i<keys.length; i++) {
                var keyData = raw[keys[i]];

                for (var j=0; j<keyData.length; j++) {
                    var row = this._data[j] || (this._data[j] = []);
                    row.push(keyData[j]);
                }
            }
        }
    });

})();
