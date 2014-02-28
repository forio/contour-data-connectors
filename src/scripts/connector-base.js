(function () {
    'use strict';

    Contour.connectors.ConnectorBase = Contour.Base.extend({
        initialize: function () {
        },

        /**
        * Returns the list of all posible dimensions for the data set
        */
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

        /**
        * Returns the list of all posible measures for the data set
        */
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

        /**
        * Specifies the dimension to be used when calling data()
        *
        * @param: {string} The name of the column to be used as main dimension for the data set
        */
        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];
            this._dimension = this._headers.indexOf(_.toLowerCase().trim());
            return this;
        },

        /**
        * Specifies a filter for the data set
        *
        * This can be a filter function function that will receive each row in the dataset
        * and should return true if the row should be included in the final data() or false otherwise
        *
        * If the parameter is an object, the object will be used as a 'match' for each row in the data set
        * ie. { country: 'US' } will filter out any row that do not have 'US' in the column country
        *
        * @param {function|object}
        */
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

        /**
        * Returns the dataset for the specificied measure
        * using the currently specified dimension
        *
        * @param Name {string|array} the column name of the dimension (case-insensitive), if its an array
        *  each measure will result in a chart series
        * @param extras {array} (optional) an array of extra columns to be included in the data set (usefull for including extra dimensions)
        * @return {array} Nornalize data set to be passed to a Contour chart
        */
        measure: function (name, extras) {
            name = _.isArray(name) ? name : [name];
            var lowerCase = function (x) { return x.toLowerCase().trim(); }

            return this.data(_.map(name, lowerCase), _.map(extras, lowerCase));
        },

        /**
        * Returns only the top X results form the sorted dataset
        */
        top: function (t) {
            this._take = t;
            return this;
        },

        /**
        * Returns only the bottom X results form the sorted dataset
        */
        bottom: function (t) {
            this._take = -t;
            return this;
        },

        /**
        * Returns only the top X results form the sorted dataset
        */
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
