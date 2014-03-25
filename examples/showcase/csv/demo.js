$(function () {
      var csvData = 'quarter,cost,revenue,profit\n2013Q1,100,150,50\n2013Q2,110,150,40\n2013Q3,90,180,90\n2013Q4,105,190,85';
      var csv = new Contour.connectors.Csv(csvData);    
  
      new Contour({
        el: '.myChart',
        xAxis: { title: 'Quarter' },
        yAxis: { title: 'Profit ($)' }
      })
      .cartesian()
      .column(csv.measure('profit'))
      .render();
});