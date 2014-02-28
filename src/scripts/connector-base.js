(function () {
    'use strict';

    Contour.connectors.ConnectorBase = Contour.Base.extend({
        initialize: function () {
        },

        getDimensions: function () {
            if (!this._data.length) return this._headers[0];
            var dimensions = [];
            var sampleRow = this._data[1];

            _.each(this._headers, function (header, index) {
                if (_.isNaN(+sampleRow[index])) {
                    dimensions.push(header);
                }

            }, this);

            return dimensions;
        },

        getMeasures: function () {
            var measures = [];
            var sampleRow = this._data[1];

            _.each(this._headers, function (header, index) {
                if (!_.isNaN(+sampleRow[index])) {
                    measures.push(header);
                }

            }, this);

            return measures;
        },

        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];
            this._dimension = this._headers.indexOf(_.toLowerCase().trim());
            return this;
        },

        filter: function (criteria) {
            if (typeof criteria === 'function') {
                this._filterSelector = selector;
            } else {

                this._filterSelector = function (row) {
                    for(var key in criteria) {
                        var index = this._headers.indexOf(key);
                        if (index >= 0 && row[index] !== criteria[key])
                            return false;
                    }

                    return true;
                };
            }

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

        _rollup: function (data, dimension) {
            var rows = {};
            var dimensionIndex = dimension;
            var hashEntry;

            // map
            _.each(data, function (d) {
                if (!(hashEntry = rows[d[dimensionIndex]])) {
                    rows[d[dimensionIndex]] = hashEntry = [];
                }

                hashEntry.push(d);
            });

            // reduce
            var reduced = [];
            var gr = [];

            var reducer = function (row) {
                _.each(row, function (entry, i) {
                    if (!_.isNaN(+entry)) {
                        var val = +entry;
                        gr[i] = (gr[i] || 0) + val;
                    } else {
                        gr[i] = gr[i] || entry;
                    }
                });
            };

            for (var key in rows) {
                gr = [];
                _.each(rows[key], reducer);
                reduced.push(gr);
            }

            return reduced;
        },

        measure: function (name, extras) {
            name = _.isArray(name) ? name : [name];
            var lowerCase = function (x) { return x.toLowerCase().trim(); }

            return this.data(_.map(name, lowerCase), _.map(extras, lowerCase));
        },

        top: function (t) {
            this._take = t;
            return this;
        },

        bottom: function (t) {
            this._take = -t;
            return this;
        },

        data: function (measures, extras) {
            measures = _.isArray(measures) ? measures : [measures];
            var _this = this;
            var filteredData = this._filterSelector ? _.filter(_this._data, function(row, index) { return _this._filterSelector.call(_this, row, index, _this._headers); }) : this._data;
            var rolledRight = this._newMeasure ? _.map(filteredData, function (row, index) { var r = row.slice(); r.push(_this._newMeasure.fn.call(_this, row, index, _this._headers)); return r; } ) : filteredData;
            var rolledUp = this._rollup(rolledRight, this._dimension);
            var sortMeasureIndex = this._getMeasureIndex(measures[0]);

            if (this._take) {
                rolledUp.sort(function (a, b) { return +b[sortMeasureIndex] - +a[sortMeasureIndex]; });
                rolledUp = this._take > 0 ? rolledUp.slice(0, this._take) : rolledUp.slice(this._take);
            }

            var result = _.map(measures, function (m) { return _this._generateSeries.call(_this, m, rolledUp, extras); });

            return result;
        },

        _getMeasureIndex: function (measure) {
            return this._newMeasure && this._newMeasure.name === measure ? this._newMeasure.index : this._headers.indexOf(measure);
        },

        _getDimensionIndex: function (dimension) {
            return this._headers.indexOf(dimension);
        },

        _generateSeries: function (measure, data, extras) {
            var _this = this;
            var dimIndex = this._dimension;
            var measureIndex = this._getMeasureIndex(measure);
            var result = _.map(data, function (d) {
                var xVal = d[dimIndex];
                var tryDate = Date.parse(xVal);
                var xData = xVal == +xVal ? +xVal : !_.isNaN(tryDate) ? new Date(tryDate) : xVal;
                var dataPoint = {
                    x: xData,
                    y: _.isNaN(+d[measureIndex]) ? d[measureIndex] : +d[measureIndex]
                };

                if (extras) {
                    var indices = _.map(extras, function (f) { return _this._getMeasureIndex(f); });
                    var extrasObj = {};
                    _.each(indices, function (i,index) {
                        extrasObj[extras[index]] = d[i];
                    });
                    _.extend(dataPoint, extrasObj);
                }

                return dataPoint;
            });

            return { name: measure, data: result };
        }
    });

})();
