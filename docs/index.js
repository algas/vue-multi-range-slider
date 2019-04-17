Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

let app = new Vue({
  el: '#app',
  components: {
    apexchart: VueApexCharts,
  },
  data: {
    canDivide: true,
    canMerge: false,
    thumbX: 0,
    dividerValue: 50,
    selectedDataPoints: [],
    rangeValues: [100],
    series: [],
    offsetX: 0,
    gridWidth: 1,
    chartOptions: {
      chart: {
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        },  
        events: {
          mounted(chartContext, config){
            app.offsetX = config.globals.translateX;
            app.gridWidth = config.globals.gridWidth;
          },
          dataPointSelection (event, chartContext, config){
            const dividerValue = Math.floor((event.x - app.offsetX) * 100 / app.gridWidth);
            app.clickedDividerValue(dividerValue);
            app.updateThumbPosition(event.offsetX);
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
          allowMultipleDataPointsSelection: false
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
    updateCanDivide(){
      this.canDivide = !this.rangeValues.includes(this.dividerValue);
    },
    updateCanMerge(){
      this.canMerge = this.rangeValues.length > 1 && this.rangeValues.includes(this.dividerValue);
    },
    updateSeries (){
      this.series = this.rangeValues.map((v, i) => {
        const min = (i == 0) ? 0 : this.rangeValues[i-1];
        const max = v;
        const val = (i == 0) ? v : v - this.rangeValues[i-1];
        return { name: `${min}以上 ${max}未満`, data: [val] };
      });
      this.updateCanDivide();
      this.updateCanMerge();
    },
    mergeDataPoints(){
      if(this.dividerValue == 100){
        return
      }
      const index = this.rangeValues.indexOf(this.dividerValue);
      this.rangeValues.splice(index, 1);
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
    },
    changeDivider(){
      this.updateThumbPosition(Math.floor(this.offsetX + this.dividerValue * this.gridWidth / 100));
      this.updateCanDivide();
      this.updateCanMerge();
    },
    updateThumbPosition(x){
      this.thumbX = x;
      this.updateCanDivide();
      this.updateCanMerge();
    }
  },
  watch: {
    // selectedDataPoints (ps){
    //   if(ps.length == 2 && ps[1] - ps[0] == 1){
    //     this.canMerge = true;
    //   } else if (ps.length == 1){
    //     this.canMerge = false;
    //   } else{
    //     this.canMerge = false;
    //   }
    // }
  }
});
