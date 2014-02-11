(function () {
    'use strict';

    Narwhal.connectors.Csv = Narwhal.connectors.ConnectorBase.extend({
        constructor: function (raw, headerRow) {
            headerRow = typeof headerRow === 'undefined' ? true : headerRow;
            this.parse(raw, headerRow);

            this._dimension = 0;

            return this;
        },

        splitPatter: /\t/,

        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\r\n|\r|\n/);
            this._headers = headerRow ? _.each(rows.shift().split(this.splitPatter), function(d) { return d.toLowerCase(); }) : _.range(0, rows[0].length);
            _.each(rows, function (r) {
                this._data.push(r.split(this.splitPatter));
            }, this);
        }
    });

})();
