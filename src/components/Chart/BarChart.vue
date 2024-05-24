<script>
import { Bar } from "vue-chartjs";

export default {
  name: "Bar",
  extends: Bar,
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

    // this.gradient.addColorStop(0, "rgba(10,128,128, 0.9)");
    // this.gradient.addColorStop(0.5, "rgba(10,128,128, 0.5)");
    // this.gradient.addColorStop(1, "rgba(10,128,128, 0.2)");
    this.gradient.addColorStop(1, "rgba(125,173,173, 0.5)");
    this.renderChart(
      {
        labels: this.label,
        datasets: [
          {
            label: this.title,
            borderColor: "rgba(0, 96, 96,1)",
            pointBackgroundColor: "rgba(0,128,128, 0.9)",
            borderWidth: 2,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: this.chartData,
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