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
    title2: String,
    type1: Array,
  },
  data() {
    return {
      gradients: [null, null], // Add another gradient
      mixtypes: ["", ""], // Add another mixtype
      gradient: null,

    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "rgba(104, 192, 255, 1)");
    this.gradient.addColorStop(0.5, "rgba(104, 192, 255, 0)");
    this.gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.08)");
    this.gradient.addColorStop(1, "rgba(59, 130, 246, 0.08)");

    this.configureGradients();
    this.configureMixtypes();

    const datasets = [
      // {
      //   label: false,
      //   type: this.mixtype1,
      //   yAxisID: "A",
      //   borderColor: "rgba(99, 102, 241,1)",
      //   pointBackgroundColor: "rgba(35,137,218, 0.9)",
      //   borderWidth: 2,
      //   pointBorderColor: "white",
      //   backgroundColor: this.gradient,

      //   data: this.chartData,
      //   pointRadius: 0,
      //   lineTension: 0,
      // }
      {
        label: this.title1,
        type: this.mixtype1,
        yAxisID: "A",
        borderColor: "rgba(99, 102, 241,1)",
        pointBackgroundColor: "rgba(35,137,218, 0.9)",
        borderWidth: 2,
        pointBorderColor: "white",
        backgroundColor: this.gradient,

        data: this.chartData[0], // Use the first dataset
        pointRadius: 0,
        lineTension: 0,
      },
      {
        label: this.title2, // Add a label for the second line
        type: this.mixtype1,
        yAxisID: "A",
        borderColor: "rgba(255,0,0,1)", // Use a different color
        pointBackgroundColor: "rgba(255,0,0,1)",
        borderWidth: 2,
        pointBorderColor: "rgba(255,0,0,1)",
        backgroundColor: this.gradients[1], // Use the second gradient

        data: this.chartData[1], // Use the second dataset
        pointRadius: 2,
        lineTension: 0,
      },
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
      this.$data._chart.destroy();
      const datasets = [
        {
          label: this.title1,
          type: this.mixtype1,
          yAxisID: "A",
          borderColor: "rgba(99, 102, 241,1)",

          pointBackgroundColor: "rgba(35,137,218, 0.9)",

          borderWidth: 2,
          pointBorderColor: "white",
          backgroundColor: this.gradient,

          data: this.chartData[0],
          pointRadius: 0,
          lineTension: 0,
        },
        {
          label: this.title2, // Add a label for the second line
          type: this.mixtype1,
          yAxisID: "A",
          borderColor: "rgba(255,0,0,1)", // Use a different color
          pointBackgroundColor: "rgba(255,0,0,1)",
          borderWidth: 2,
          pointBorderColor: "rgba(255,0,0,1)",
          backgroundColor: this.gradients[1], // Use the second gradient

          data: this.chartData[1], // Use the second dataset
          pointRadius: 2,
          lineTension: 0,
        },
      ]


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
    label: "updateChart",
    chartData: "updateChart",
  },
};
</script>