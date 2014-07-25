(function () {
    'use strict';

    // Return array of string values, or NULL if CSV string not well formed.
    function CSVtoArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    };

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

        splitPattern: /,/,

        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\r\n|\r|\n/);
            this._headers = headerRow ? _.map(rows.shift().split(this.splitPattern), function(d) { return d.toLowerCase().trim(); }) : _.range(0, rows[0].length);
            _.each(rows.filter(function (row) { return row.length; }), function (r) {
                this._data.push(r.split(this.splitPattern));
            }, this);
        }
    });

})();
