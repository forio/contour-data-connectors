(function () {
    'use strict';

    Contour.connectors.Tsv = Contour.connectors.Csv.extend({
        splitPatter: /\t/
    });

})();
