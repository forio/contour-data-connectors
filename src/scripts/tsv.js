(function () {
    'use strict';

    Narwhal.connectors.Tsv = Narwhal.connectors.Csv.extend({
        splitPatter: /\t/
    });

})();
