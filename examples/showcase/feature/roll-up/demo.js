$(function () {
      var csvData = '\
        quarter,region,cost,revenue,profit\n\
        2013Q1,North,100,150,50\n\
        2013Q1,South,200,250,50\n\
        2013Q2,North,110,150,40\n\
        2013Q2,South,220,250,30\n\
        2013Q3,North,90,180,90\n\
        2013Q3,South,115,180,65\n\
        2013Q4,North,105,190,85\n\
        2013Q4,South,90,180,90';

      var csv = new Contour.connectors.Csv(csvData);

      // by specifying dimension region, the connector will
      // aggregate all equal regions in the measure, so
      // the 'North' data point will be the sum of all profits on all quarters
      var data = csv.dimension('region').measure('profit');

      new Contour({
            el: '.myChart',
            xAxis: {
                title: 'Quarter, North region'
            },
            yAxis: {
                title: 'Profit ($)'
            }
      })
      .cartesian()
      .column(data)
      .render();
});
