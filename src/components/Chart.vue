<template>
  <div class="main">
    <div id="MyChart" style="height: 600px"></div>
  </div>
</template>

<script>
import { init } from "klinecharts";
import * as signalR from "@microsoft/signalr";
import generatedChartDataList from "../generatedChartDataList";

export default {
  name: "Chart",
  data() {
    return {
      dataset: [],
      timeframediff: null,
      kLineChart: {},
    };
  },

  methods: {
    LoadData: function () {
      fetch("")
        .then((res) => res.json)
        .then((data) => {
          console.log(data);
        })
        .catch(console.log);
    },
    SubscribeToDataChanges: function () {
      console.log("Hello SignalR");
      var connection = new signalR.HubConnectionBuilder()
        .withUrl("https://192.168.10.111:5001/hub")
        .withAutomaticReconnect([0, 0, 10000])
        .build();

      connection.on("ProductsChanged", this.UpdateData);
      connection.onreconnecting((error) =>
        console.log(`Connection lost due to error "${error}". Reconnecting.`)
      );
      connection.onreconnected((connectionId) =>
        console.log(
          `Connection reestablished. Connected with connectionId "${connectionId}".`
        )
      );
      connection
        .start()
        .then(() => console.log("Connection started"))
        .catch((err) => console.log("Error while starting connection: " + err));
    },
    UpdateData: function () {},
    AddNewBar: function () {
      let last = this.dataset[this.dataset.length - 1];
      console.log(last);
      let newbar = {
        open: last.close,
        low: last.low * 1.001,
        high: last.high * 1.001,
        close: last.close * 1.001,
        timestamp: last.timestamp + this.timeframediff,
        volume: last.volume + 1,
      };
      this.dataset.push(newbar);
      this.kLineChart.applyNewData(this.dataset);
    },
    UpdateCurrentBar: function () {
      let current = this.dataset[this.dataset.length - 1];
      current.close = current.close * 1.001;
      this.kLineChart.applyNewData(this.dataset);
    },
  },

  mounted() {
    // Initialize the chart
    this.kLineChart = init("MyChart");
    this.dataset = generatedChartDataList();
    this.timeframediff = Math.abs(
      this.dataset[0].timestamp - this.dataset[1].timestamp
    );
    this.kLineChart.applyNewData(this.dataset);
    this.LoadData();
    this.SubscribeToDataChanges();
    window.add = this.AddNewBar;
    window.up = this.UpdateCurrentBar;

    let light = false;
    let T = light ? "#76808F" : "#929AA5";
    let Z = light ? "#ededed" : "#292929";
    let a = light ? "#686d76" : "#373a40";
    let i = light ? "#DDDDDD" : "#333333";
    let n = light ? "#76808F" : "#929AA5";
    let r = {
      grid: {
        horizontal: {
          color: Z,
        },
        vertical: {
          display: !0,
          color: Z,
        },
      },
      candle: {
        bar: {
          noChangeColor: "#26A69A",
        },
        priceMark: {
          high: {
            color: T,
            textFamily: "Roboto",
          },
          low: {
            color: T,
            textFamily: "Roboto",
          },
          last: {
            display: !1,
          },
        },
        tooltip: {
          labels: ["T: ", "O: ", "C: ", "H: ", "L: ", "V: "],
          text: {
            color: T,
            family: "Roboto",
          },
        },
      },
      technicalIndicator: {
        bar: {
          upColor: "rgba(38, 166, 154, .6)",
          downColor: "rgba(239, 83, 80, .6)",
          noChangeColor: "rgba(38, 166, 154, .6)",
        },
        circle: {
          upColor: "rgba(38, 166, 154, .6)",
          downColor: "rgba(239, 83, 80, .6)",
          noChangeColor: "rgba(38, 166, 154, .6)",
        },
        lastValueMark: {
          show: !0,
          text: {
            show: !0,
          },
        },
        tooltip: {
          text: {
            color: T,
            family: "Roboto",
          },
        },
      },
      xAxis: {
        minHeight: 26,
        axisLine: {
          color: i,
        },
        tickText: {
          color: n,
          family: "Roboto",
        },
        tickLine: {
          color: i,
        },
      },
      yAxis: {
        axisLine: {
          color: i,
        },
        tickText: {
          color: n,
          family: "Roboto",
        },
        tickLine: {
          color: i,
        },
      },
      separator: {
        color: i,
      },
      crosshair: {
        horizontal: {
          line: {
            color: T,
          },
          text: {
            color: "#FFFFFF",
            borderColor: a,
            backgroundColor: a,
            family: "Roboto",
          },
        },
        vertical: {
          line: {
            color: T,
          },
          text: {
            color: "#FFFFFF",
            borderColor: a,
            backgroundColor: a,
            family: "Roboto",
          },
        },
      },
    };
    this.kLineChart.setStyleOptions(r);
  },
};
</script>



<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #191919;
}

div,
p {
  box-sizing: border-box;
}

p {
  margin: 0;
}

.app {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
}
.k-line-chart-container {
  display: flex;
  flex-direction: column;
  margin: 15px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #1f2126;
  width: 620px;
  height: 440px;
  padding: 16px 6px 16px 16px;
}

.k-line-chart-title {
  margin: 0;
  color: #E6E8EA;
  padding-bottom: 10px;
}

.k-line-chart {
  display: flex;
  flex: 1;
}
.k-line-chart-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #929AA5;
}
.k-line-chart-menu-container button {
  cursor: pointer;
  background-color: #2196F3;
  border-radius: 2px;
  margin-right: 8px;
  height: 24px;
  line-height: 26px;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  border: none;
  outline: none;
}
</style>
 //this.kLineChart.setStyleOptions(this.options);