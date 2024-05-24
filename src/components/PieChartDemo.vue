<template>
  <highcharts :options="getChartData()"></highcharts>
</template>

<script>
import Highcharts from "highcharts";

export default {
  data() {
    return {
      total: 0,
      dataMerch: [],
      dataAPI: [
                {
                    "total_money": 106774737,
                    "merchant_type": "000000",
                    "name": "Kiosk Apple",
                    "payment_count": 5090
                },
                {
                    "total_money": 27300,
                    "merchant_type": "30199",
                    "name": "Kiosk GUCCI",
                    "payment_count": 1131
                },
                {
                    "total_money": 2137435724,
                    "merchant_type": "2010",
                    "name": "Shoes Store",
                    "payment_count": 2689
                },
                {
                    "total_money": 2051999929,
                    "merchant_type": "60111",
                    "name": "All You Want Grocery",
                    "payment_count": 2619
                },
                {
                    "total_money": 2091309860,
                    "merchant_type": "12",
                    "name": "Bright Sun Nails",
                    "payment_count": 2684
                },
                {
                    "total_money": 1976932050,
                    "merchant_type": "44231",
                    "name": "Plumb Services",
                    "payment_count": 2608
                },
                {
                    "total_money": 1995108131,
                    "merchant_type": "399102",
                    "name": "Tim Bakery",
                    "payment_count": 2616
                },
                {
                    "total_money": 2065427854,
                    "merchant_type": "12311",
                    "name": "Low 'n Candles",
                    "payment_count": 2630
                },
                {
                    "total_money": 2047833393,
                    "merchant_type": "6016",
                    "name": "Kim's Dumplings",
                    "payment_count": 2642
                }
            ]
          }
  },
  methods: {
    getChartData() {
      this.getDataFromAPI()
      // console.log(this.total)
      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "<p style='font-size:40pt;'> total <br>" +this.total + "</p>",
          align: 'center',
          verticalAlign: 'middle',
       
        },
        tooltip: {
          // /pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
          useHTML: true,
            formatter: function () {
                //console.log(this); // just to see , what data you can access
                return this.key + '<br>' 
                    + '</b> Persentase: <b>' + this.percentage.toFixed(2) + '% </b>('+ this.point.y + ' Transaction)<br>'
                    + 'Rp.' + this.point.money;
            }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              //format: "<b>{point.name}</b>: {point.percentage:.1f} %",
              formatter: function() {
                return this.key + '<br>' + this.percentage.toFixed(2) + '%'
              },
              style: {
                color:
                  (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                  "black"
              }
            }
          }
        },
        series: 
        [
          {
            name: "Prosentase",
            colorByPoint: true,
            innerSize: '50%',
            data: this.dataMerch,
          }
        ]
      }
    },
    getDataFromAPI() {
      this.dataMerch = []
      this.total = 0
      this.dataAPI.forEach(element => {
        this.total = this.total + element.payment_count
      })
      this.total = this.formatNumber(this.total)
      this.dataAPI.forEach(element => {
        this.dataMerch.push({
          name: ((element.name !== null) ? element.name + ' - ' : '' ) + element.merchant_type,
          y: element.payment_count,
          money: this.formatNumber(element.total_money)
        })
      })
    },
    formatNumber(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);
      } catch (e) {
        console.log(e)
      }
    }
  }
};
</script>
