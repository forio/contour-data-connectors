## Narwhal Data Connectors

Data connectors are libraries that connect data sources to Narwhal visualizations.

#### Example CSV connector

```

    var csvData = 'quarter,cost,revenue,profit\n2013Q1,100,150,50\n2013Q2,110,150,40\n2013Q3,90,180,90\n2013Q4,105,190,85'
    var csv = new Narwhal.connectors.Csv(csvData);

    new Narwhal({
            el: '.connecto-basic',
            xAxis: {
                firstAndLast: false,
                title: 'Profit ($)',
            },
            yAxis: {
                title: 'Quarter'
            }
        })
        .cartesian()
        .column(csv.measure('profit'))
        .render();


```
