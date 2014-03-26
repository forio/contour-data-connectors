$(function () {
      var tsvData = 'quarter\tcost\trevenue\tprofit\n2013Q1\t100\t150\t50\n2013Q2\t110\t150\t40\n2013Q3\t90\t180\t90\n2013Q4\t105\t190\t85';
      var tsv = new Contour.connectors.Tsv(tsvData);    
  
      new Contour({
        el: '.myChart',
       xAxis: { title: 'Quarter' },
       yAxis: { title: 'Profit ($)' }
      })
      .cartesian()
      .column(tsv.measure('profit'))
      .render();
});