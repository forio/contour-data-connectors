(function () {
    'use strict';

    /**
    * Comma Separated Values Files connector (csv)
    * 
    * ### Example:
    *
    *       var csvData = 'quarter,cost,revenue,profit\n2013Q1,100,150,50\n2013Q2,110,150,40\n2013Q3,90,180,90\n2013Q4,105,190,85';
    *       var csv = new Contour.connectors.Csv(csvData);    
    *   
    *       new Contour({
    *         el: '.myChart',
    *         xAxis: { title: 'Quarter' },
    *         yAxis: { title: 'Profit ($)' }
    *       })
    *       .cartesian()
    *       .column(csv.measure('profit'))
    *       .render();
    *
    * @class Contour.connectors.Csv
    */
    Contour.connectors.Csv = Contour.connectors.ConnectorBase.extend({
        constructor: function (raw, headerRow) {
            headerRow = typeof headerRow === 'undefined' ? true : headerRow;
            this.parse(raw, headerRow);

            this._dimension = 0;

            return this;
        },

        splitPatter: /,/,

        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\r\n|\r|\n/);
            this._headers = headerRow ? _.map(rows.shift().split(this.splitPatter), function(d) { return d.toLowerCase().trim(); }) : _.range(0, rows[0].length);
            _.each(rows, function (r) {
                this._data.push(r.split(this.splitPatter));
            }, this);
        }
    });

})();
