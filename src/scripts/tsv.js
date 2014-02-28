(function () {
    'use strict';

    /**
    * Tab Separated Values Files connector (tsv)
    * @class Contour.connectors.Tsv
    */
    Contour.connectors.Tsv = Contour.connectors.Csv.extend({
        splitPatter: /\t/
    });

})();
