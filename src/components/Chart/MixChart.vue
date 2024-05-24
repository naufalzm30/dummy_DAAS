<script>
import { Line } from "vue-chartjs";

export default {
  name: "MixChart",
  extends: Line,
  props: {
    label: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
    chartData2: {
      type: Array,
    },
    legend: {
      type: Boolean,
    },
    title1: {
      type: String,
    },
    title2: {
      type: String,
    },
    type1: {
      type: Array,
    },
    type2: {
      type: Array,
    },
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
      mixtype1: "",
      mixtype2: "",
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    // this.gradient.addColorStop(0, "rgba(0,128,128, 0.9)");
    // this.gradient.addColorStop(0.5, "rgba(0,128,128, 0.5)");
    // this.gradient.addColorStop(1, "rgba(0,128,128, 0.2)");
    this.gradient.addColorStop(1, "rgba(59,130,246, 0.08)");

    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    // this.gradient2.addColorStop(0, "rgba(35,137,218, 0.9)");
    // this.gradient2.addColorStop(0.5, "rgba(35,137,218, 0.5)");
    // this.gradient2.addColorStop(1, "rgba(35,137,218, 0.2)");
    this.gradient2.addColorStop(1, "rgba(59,130,246, 0.08)");

    if (this.type1 == "LineChart") {
      this.mixtype1 = "line";
    }
    if (this.type2 == "BarChart") {
      this.mixtype2 = "bar";
    }
    this.renderChart(
      {
        labels: this.label,
        datasets: [
          {
            label: this.title1,
            type: this.mixtype1,
            yAxisID: "A",
            borderColor: "rgba(0, 96, 96,1)",
            pointBackgroundColor: "rgba(0,128,128, 0.9)",
            borderWidth: 2,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: this.chartData,
            pointRadius: 0,
            lineTension: 0,
          },
          {
            label: this.title2,
            type: this.mixtype2,
            yAxisID: "B",
            borderColor: "rgba(27,105,167,1)",
            pointBackgroundColor: "rgba(35,137,218, 0.9)",
            borderWidth: 2,
            pointBorderColor: "white",
            backgroundColor: this.gradient2,
            data: this.chartData2,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
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
            {
              id: "B",
              position: "right",
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
};
</script>