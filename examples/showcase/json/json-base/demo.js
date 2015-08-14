$(function() {
    var json = {
        'quarter': ['2013Q1', '2013Q2', '2013Q3', '2013Q4'],
        'cost': [100, 110, 90, 105],
        'revenue': [150, 150, 180, 190],
        'profit': [50, 40, 90, 85]
    };

    var ds = new Contour.connectors.Json(json);

    new Contour({
        el: '.myChart',
        xAxis: {
            title: 'Quarter'
        },
        yAxis: {
            title: 'Profit ($)'
        }
    })
    .cartesian()
    .line(ds.measure(['profit', 'cost', 'revenue']))
    .render();
});
