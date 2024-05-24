<template>
  <div>
    <!-- <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts> -->
     <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import windbarb from 'highcharts/modules/windbarb';
import 'highcharts/css/highcharts.css';

// Import the required Highcharts modules
windbarb(Highcharts);

export default {
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          polar: true,
          type: 'windrose',
        },
        title: {
          text: 'Wind Rose',
        },
        series: [
          {
            type: 'windbarb',
            data: [
              [5, 180],
              [10, 225],
              [15, 270],
              // Add more wind speed and direction data points
            ],
          },
        ],
      },
    };
  },
};

</script>

<style scoped>
.highcharts-figure,
.highcharts-data-table table {
    min-width: 360px;
    max-width: 660px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}
</style>
