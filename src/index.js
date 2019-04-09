Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let app = new Vue({
  el: '#chart',
  components: {
    apexchart: VueApexCharts,
  },
  data: {
    selectedDataPoints: [-1],
    seriesIndex: -1,
    dataPointIndex: -1,
    series: [{
      name: 'Marine Sprite',
      data: [44]
    }, {
      name: 'Striking Calf',
      data: [53]
    }, {
      name: 'Tank Picture',
      data: [12]
    }, {
      name: 'Bucket Slope',
      data: [9]
    }, {
      name: 'Reborn Kid',
      data: [25]
    }],
    chartOptions: {
      chart: {
        stacked: true,
        // stackType: '100%'
        events: {
          // click: function(ctx){
          //   console.log(`event: click = ${JSON.stringify(ctx)}`);
          // },
          dataPointSelection: function(event, chartContext, config){
            console.log(`event: dataPointSelection event = ${JSON.stringify(event)}`);
            const keys = Object.keys(config.selectedDataPoints);
            const ps = keys.map(function(k){return parseInt(k);})
            console.log(`ps = ${ps}`);
            console.log(chartContext);
            app.selectedDataPoints = ps;
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },

      title: {
        text: '100% Stacked Bar'
      },
      xaxis: {
        categories: [2008],
      },

      tooltip: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      states: {
        active: {
          allowMultipleDataPointsSelection: true
        }
      },

      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        onItemClick: {
          toggleDataSeries: false
        },
        onItemHover: {
          highlightDataSeries: true
        }
      }
    }
  },
  watch: {
    selectedDataPoints: function(ps){
      console.log('selectedDataPoints');
      if(ps.length == 2 && ps[1] - ps[0] == 1){
        const dataTotal = this.series[ps[0]].data[0] + this.series[ps[1]].data[0];
        this.series[ps[0]].data[0] = dataTotal;
        this.series.splice(ps[1], 1);
      }
    }
  }
});
