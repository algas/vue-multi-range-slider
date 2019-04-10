Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let app = new Vue({
  el: '#app',
  components: {
    apexchart: VueApexCharts,
  },
  data: {
    canMerge: false,
    canDivide: false,
    selectedDataPoints: [],
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
          dataPointMouseEnter (event, chartContext, config){
            console.log(`event: dataPointMouseEnter = ${JSON.stringify(event)}`);
          },
          dataPointSelection (event, chartContext, config){
            console.log(`event: dataPointSelection event = ${JSON.stringify(event)}`);
            app.toggleDataPoints(parseInt(config.seriesIndex));
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
        enabled: true,
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function(){
              return '';
            }
          },
          formatter: function(){
            return 'separate?';
          }
        },
        marker: false
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
  methods: {
    clearAnnotations (){
      app.$refs.exampleChart.clearAnnotations();
    },
    toggleDataPoints (selectedIndex){
      console.log(JSON.stringify(this.selectedDataPoints));
      console.log(app.$refs);
      const foundIndex = this.selectedDataPoints.indexOf(selectedIndex);
      if(foundIndex < 0){
        this.selectedDataPoints.push(selectedIndex);
      }
      else{
        console.log(app.$refs);
        this.selectedDataPoints.splice(foundIndex, 1);
        this.clearAnnotations();
      }
      this.selectedDataPoints.sort();
    },
    mergeDataPoints(){
      const ps = this.selectedDataPoints;
      const dataTotal = parseInt(this.series[ps[0]].data[0]) + parseInt(this.series[ps[1]].data[0]);
      this.series[ps[0]].data[0] = dataTotal;
      this.series.splice(ps[1], 1);
    },
    divideDataPoint(){
      const selectedIndex = this.selectedDataPoints[0];
      const selectedValue = this.series[selectedIndex].data[0];
      this.series.splice(selectedIndex+1, 0, {name: 'new data', data: [parseInt(selectedValue/2)]})
      this.$set(this.series[selectedIndex].data, 0, [parseInt(selectedValue/2)]);
    }
  },
  watch: {
    selectedDataPoints (ps){
      console.log('selectedDataPoints');
      if(ps.length == 2 && ps[1] - ps[0] == 1){
        this.canMerge = true;
        this.canDivide = false;
      } else if (ps.length == 1){
        this.canMerge = false;
        this.canDivide = true;
      } else{
        this.canMerge = false;
        this.canDivide = false;
      }
    }
  }
});
