function transformData(data){
  return data.monthlyVariance.map(item => ({
    x: item.year,
    y: item.month - 1,
    heat: item.variance + data.baseTemperature
  }));
}

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(response => response.json())
.then(data => {
  const heatmapData = transformData(data);

  anychart.onDocumentReady(function() {
    var chart = anychart.heatMap(heatmapData);

    var colorScale = anychart.scales.linearColor();
    colorScale.colors(["#313695", "#74add1", "#ffffbf", "#f46d43", "#a50026"]);

    chart.colorScale(colorScale);
    chart.hovered().fill(function() { return anychart.color.darken(this.sourceColor, 0.5); });

    chart.yAxis().labels().format(function() {
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return months[this.value];
    });

    chart.xAxis().title("Years");
    chart.yAxis().title("Months");

    chart.tooltip().format(function(){
      return 'Year: ' + this.x + '<br>' +
             'Month: ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][this.y] + '<br>' +
             'Temp: ' + this.heat.toFixed(2) + '℃';
    });

    chart.container("container");
    chart.draw();

    var colorBar = anychart.standalones.colorRange(colorScale);
    colorBar.container("color-bar");
    colorBar.orientation("horizontal");
    colorBar.draw();
  });
})
.catch(error => console.error("Error happened", error));
