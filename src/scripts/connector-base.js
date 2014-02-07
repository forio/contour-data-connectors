(function () {

    function ConnectorBase() {}

    ConnectorBase.prototype = {
        initialize: function () {
        },

        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];
            this._dimension = this._headers.indexOf(_.toLowerCase());
            return this;
        },

        filter: function (selector) {
            this._filterSelector = selector;
            return this;
        },

        newMeasure: function (name, fn) {
            this._newMeasure = {
                name: name,
                fn: fn,
                index: this._headers.length
            };

            return this;
        },

        rollup: function (selector) {
            this._rollup = selector;
            return this;
        },

        measure: function (name) {
            name = _.isArray(name) ? name : [name];

            return this.data(_.map(name, String.toLowerCase));
        },

        top: function (t) {
            this._take = t;
            return this;
        },

        bottom: function (t) {
            this._take = -t;
            return this;
        },

        data: function (measures) {
            measures = _.isArray(measures) ? measures : [measures];
            var _this = this;
            var filteredData = this._filterSelector ? _.filter(_this._data, function(row, index) { return _this._filterSelector.call(_this, row, index, _this._headers); }) : this._data;
            var rolledRight = this._newMeasure ? _.map(filteredData, function (row, index) { row.push(_this._newMeasure.fn.call(_this, row, index, _this._headers)); return row; } ) : filteredData;
            var sortMeasureIndex = this._getMeasureIndex(measures[0]);

            if (this._take) {
                rolledRight.sort(function (a, b) {
                    // console.log();
                    return +b[sortMeasureIndex] - +a[sortMeasureIndex];
                });
                rolledRight = this._take > 0 ? rolledRight.slice(0, this._take) : rolledRight.slice(this._take);
            }

            var result = _.map(measures, function (m) { return _this._generateSeries.call(_this, m, rolledRight); });

            return result;
        },

        _getMeasureIndex: function (measure) {
            return this._newMeasure && this._newMeasure.name === measure ? this._newMeasure.index : this._headers.indexOf(measure);

        },

        _generateSeries: function (measure, data) {
            var dimIndex = this._dimension;
            var measureIndex = this._getMeasureIndex(measure);
            var result = _.map(data, function (d) {
                return {
                    x: d[dimIndex],
                    y: _.isNaN(+d[measureIndex]) ? d[measureIndex] : +d[measureIndex]
                };
            });

            return { name: measure, data: result };
        }
    };

    ConnectorBase.extend = Narwhal.extend;
    Narwhal = Narwhal || {};
    Narwhal.connectors = Narwhal.connectors || {};
    Narwhal.connectors.ConnectorBase = ConnectorBase;

})();
