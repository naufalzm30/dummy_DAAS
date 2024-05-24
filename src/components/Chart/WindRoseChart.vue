<template>
  <div>
    <figure class="highcharts-figure">
      <div id="container"></div>
    </figure>
    <table class="d-none" id="freq" border="0" cellspacing="0" cellpadding="0">
      <tr nowrap bgcolor="#CCCCFF">
        <th colspan="9" class="hdr">Table of Frequencies (percent)</th>
      </tr>
      <tr
        v-for="(row, index) in sampleData"
        :key="index"
        :class="row.bgcolor"
        nowrap
      >
        <td
          v-for="(cell, cellIndex) in row.cells"
          :key="cellIndex"
          :class="cell.class"
        >
          {{ cell.value }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import Data from "highcharts/modules/data";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Accessibility from "highcharts/modules/accessibility";

HighchartsMore(Highcharts);
Data(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

export default {
  props: ["sampleData", "stations", "startDate", "endDate"],
  data() {
    return {
      wind_directions: [
        {
          direction: "N",
          degrees: "348.75° - 11.25°",
        },
        {
          direction: "NNE",
          degrees: "11.25° - 33.75°",
        },
        {
          direction: "NE",
          degrees: "33.75° - 56.25°",
        },
        {
          direction: "ENE",
          degrees: "56.25° - 7/8.75°",
        },
        {
          direction: "E",
          degrees: "78.75° - 101.25°",
        },
        {
          direction: "ESE",
          degrees: "101.25° - 123.75°",
        },
        {
          direction: "SE",
          degrees: "123.75° - 146.25°",
        },
        {
          direction: "SSE",
          degrees: "146.25° - 168.75°",
        },
        {
          direction: "S",
          degrees: "168.75° - 191.25°",
        },
        {
          direction: "SSW",
          degrees: "191.25° - 213.75°",
        },
        {
          direction: "SW",
          degrees: "213.75° - 236.25°",
        },
        {
          direction: "WSW",
          degrees: "236.25° - 258.75°",
        },
        {
          direction: "W",
          degrees: "258.75° - 281.25°",
        },
        {
          direction: "WNW",
          degrees: "281.25° - 303.75°",
        },
        {
          direction: "NW",
          degrees: "303.75° - 326.25°",
        },
        {
          direction: "NNW",
          degrees: "326.25° - 348.75°",
        },
      ],
      isTableVisible: false,
      chartInstance: null,
      st_name: "",
      sta_date: "",
      end_date: "",
    };
  },
  methods: {
    createChart() {
      this.stations.forEach((e) => {
        if (e.id == this.$route.params.id) {
          this.st_name = e.station_name;
        }
      });
      if (this.startDate && this.endDate != null) {
        // Input dates in YYYY-MM-DD format
        const inputDate1 = this.startDate;
        const inputDate2 = this.endDate;

        // Convert the input dates to Date objects
        const date1 = new Date(inputDate1);
        const date2 = new Date(inputDate2);

        // Define the options for the date formatting
        const options = { day: "numeric", month: "long", year: "numeric" };

        // Format the first date using Intl.DateTimeFormat
        const formattedDate1 = new Intl.DateTimeFormat("id-ID", options).format(
          date1
        );

        // Format the second date using Intl.DateTimeFormat
        const formattedDate2 = new Intl.DateTimeFormat("id-ID", options).format(
          date2
        );

        this.sta_date = formattedDate1;
        this.end_date = formattedDate2;
      }

      this.chartInstance = Highcharts.chart("container", {
        data: {
          table: "freq",
          startRow: 1,
          endRow: 17,
          endColumn: 7,
        },

        chart: {
          polar: true,
          type: "column",
        },
        title: {
          text: `Wind Rose ${this.st_name}`,
          align: "left",
          style: {
            fontSize: "14px",
          },
        },

        subtitle: {
          text:
            this.sta_date && this.end_date
              ? `Tanggal ${this.sta_date} s/d ${this.end_date}`
              : "",
          align: "left",
           style: {
            fontSize: "11px",
          },
        },

        pane: {
          size: "85%",
        },

        legend: {
          align: "right",
          verticalAlign: "top",
          y: 100,
          layout: "vertical",
          itemStyle: {
            fontSize: "11px", // Adjust the font size for the legend items
          },
        },

        xAxis: {
          tickmarkPlacement: "on",
          labels: {
            style: {
              fontSize: "11px",
            },
          },
        },

        yAxis: {
          min: 0,
          endOnTick: false,
          showLastLabel: true,
          title: {
            text: "Frequency (%)",
          },
          labels: {
            format: "{value}%",
            style: {
              fontSize: "11px",
            },
          },
          reversedStacks: false,
        },

        tooltip: {
          valueSuffix: "%",
        },

        plotOptions: {
          series: {
            stacking: "normal",
            shadow: false,
            groupPadding: 0,
            pointPlacement: "on",
          },
        },
        credits: {
          enabled: false,
        },
      });
    },
  },
  watch: {
    sampleData() {
      this.createChart();
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style>
.highcharts-figure {
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

#container {
  height: 260px;
  margin-top: -10px;
}
</style>
