$(function () {
      var csvData = 'quarter,region,cost,revenue,profit\n2013Q1,North,100,150,50\n2013Q1,South,200,250,50\n2013Q2,North,110,150,40\n2013Q2,South,220,250,30\n2013Q3,North,90,180,90\n2013Q3,South,115,180,65\n2013Q4,North,105,190,85\n2013Q4,South,90,180,90';
      var csv = new Contour.connectors.Csv(csvData);    
  
      new Contour({
          el: '.myChart',
          xAxis: { title: 'Quarter, North region' },
          yAxis: { title: 'Profit ($)' }
      })
      .cartesian()
      // to show only the top 2 regions, add .top(2) after the .filter()
      .column(csv.dimension('quarter').filter({region: 'North'}).measure('profit'))
      .render();
});