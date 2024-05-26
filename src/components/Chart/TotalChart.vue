<script>
import { Line } from "vue-chartjs";

export default {
  name: "TotalChart",
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
    title: {
      type: String,
    },
  },
  data() {
    return {
      gradient: null,
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    // this.gradient.addColorStop(0, "rgba(35,137,218, 0.9)");
    // this.gradient.addColorStop(0.5, "rgba(35,137,218, 0.5)");
    // this.gradient.addColorStop(1, "rgba(35,137,218, 0.2)");

    this.gradient.addColorStop(1, "rgba(59,130,246, 0.08)");

    this.renderChart(
      {
        labels: this.label,
        datasets: [
          {
            label: this.title,
            borderColor: "rgba(99,102,241,1)",
            pointBackgroundColor: "rgba(35,137,218, 0.9)",
            borderWidth: 2,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: this.chartData,
            pointRadius: 0,
            lineTension: 0,
            z: 2,
          },
        ],
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
              ticks: {
                beginAtZero: false,
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
                borderDash: [8, 4],
                color: false,
                z: 1,
              },
            },
          ],
        },
      }
    );
  },
};
</script>