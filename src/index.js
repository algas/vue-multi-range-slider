Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let app = new Vue({
  el: '#app',
  components: {
    apexchart: VueApexCharts,
  },
  data: {
    canMerge: false,
    dividerValue: 50,
    selectedDataPoints: [],
    rangeValues: [100],
    series: [],
    chartOptions: {
      chart: {
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        },  
        events: {
          dataPointSelection (event, chartContext, config){
            const MAGIC_OFFSET = 34;
            const bar_x = event.x - MAGIC_OFFSET;
            const bar_width = event.view.innerWidth - MAGIC_OFFSET;
            const dividerValue = Math.floor(100 * bar_x / bar_width);
            app.clickedDividerValue(dividerValue);
            const ps = [];
            config.selectedDataPoints.forEach((element, index) => {
              if(element && element.length > 0){
                ps.push(index);
              }
            });
            if(config.selectedIndex == 0){
              config.selectedDataPoints = [];
            }
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
      labels: [1,2,100],
      title: {
        text: '100% Stacked Bar'
      },
      xaxis: {
        show: true,
        categories: [''],
      },
      yaxis: {
        show: true,
      },
      tooltip: {
        enabled: false,
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
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        onItemClick: {
          toggleDataSeries: false
        },
        onItemHover: {
          highlightDataSeries: true
        }
      }
    }
  },
  created() {
    this.updateSeries();
  },
  methods: {
    clickedDividerValue(val){
      this.dividerValue = val;
    },
    canDivide(){
      return this.rangeValues.indexOf(this.dividerValue) < 0;
    },
    updateSeries (){
      this.series = this.rangeValues.map((v, i) => {
        const min = (i == 0) ? 0 : this.rangeValues[i-1];
        const max = v;
        const val = (i == 0) ? v : v - this.rangeValues[i-1];
        return { name: `${min}以上 ${max}未満`, data: [val] };
      })
    },
    mergeDataPoints(){
      this.rangeValues.splice(this.selectedDataPoints[0], 1);
      this.updateSeries();
    },
    divideDataPoint(){
      let values = this.rangeValues;
      values.push(this.dividerValue);
      values = values.sort((a,b)=>{
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
      });
      this.rangeValues = values;
      this.updateSeries();
    }
  },
  watch: {
    selectedDataPoints (ps){
      if(ps.length == 2 && ps[1] - ps[0] == 1){
        this.canMerge = true;
      } else if (ps.length == 1){
        this.canMerge = false;
      } else{
        this.canMerge = false;
      }
    }
  }
});
