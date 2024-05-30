<script>
import { Line } from "vue-chartjs";

export default {
  name: "LineChartFiltered",
  extends: Line,
  props: {
    label: Array,
    chartData: Array,
    legend: Boolean,
    title1: String,
    type1: Array,
  },
  data() {
    return {
      gradients: [null],
      mixtypes: [""],

    };
  },
  mounted() {
    this.configureGradients();
    this.configureMixtypes();

    const datasets = [
      {
        label: false,
        type: this.mixtype1,
        yAxisID: "A",
        borderColor: "rgba(99,102,241,1)",

        pointBackgroundColor: "rgba(35,137,218, 0.9)",

        borderWidth: 2,
        pointBorderColor: "white",
        backgroundColor: this.gradients[0],
        data: this.chartData,
        pointRadius: 0,
        lineTension: 0,
      }
    ]

    this.renderChart(
      {
        labels: this.label,
        datasets: datasets,
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              id: "A",
              position: "left",
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                color: "rgba(151,151,151,0.2)",
              },
            },

          ],
          xAxes: [
            {
              ticks: {
                display: true,
                callback: (value, index, values) => {
                  if (index === 0 || index === values.length - 1) {
                    return value;
                  } else {
                    return "";
                  }
                },
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                fontColor: "#6c757d",
              },
              gridLines: {
                color: false,
              },
            },
          ],
        },
      }
    );
  },
  methods: {
    updateChart() {
      // Destroy the existing chart
      this.$data._chart.destroy();
      const datasets = [
        {
          label: this.title1,
          type: this.mixtype1,
          yAxisID: "A",
          borderColor: "rgba(99,102,241,1)",

          pointBackgroundColor: "rgba(35,137,218, 0.9)",

          borderWidth: 2,
          pointBorderColor: "white",
          backgroundColor: this.gradients[0],
          data: this.chartData,
          pointRadius: 0,
          lineTension: 0,
        }
      ]


      // Recreate the chart
      this.renderChart(
        {
          labels: this.label,
          datasets: datasets,
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                id: "A",
                position: "left",
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  color: "rgba(151,151,151,0.2)",
                },
              }

            ],
            xAxes: [
              {
                ticks: {
                  display: true,
                  callback: (value, index, values) => {
                    if (index === 0 || index === values.length - 1) {
                      return value;
                    } else {
                      return "";
                    }
                  },
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                  fontColor: "#6c757d",
                },
                gridLines: {
                  color: false,
                },
              },
            ],
          },
        }
      );
    },
    configureGradients() {
      const colors = ["0,128,128", "35,137,218", "27,105,167"];

      for (let i = 0; i < this.gradients.length; i++) {
        this.gradients[i] = this.$refs.canvas
          .getContext("2d")
          .createLinearGradient(0, 0, 0, 450);
        this.gradients[i].addColorStop(1, `rgba(${colors[i]}, 0.08)`);
      }
    },
    configureMixtypes() {
      const chartTypes = [this.type1, this.type2, this.type3];

      for (let i = 0; i < this.mixtypes.length; i++) {
        if (chartTypes[i] === "LineChart") {
          this.mixtypes[i] = "line";
        } else if (chartTypes[i] === "BarChart") {
          this.mixtypes[i] = "bar";
        }
      }
    },
  },
  watch: {
    // Watch for changes in props and call updateChart when needed
    label: "updateChart",
    chartData: "updateChart",
    // ... other props ...
  },
};
</script>