<template>
  <div class="container" style="height: 600px">
    <!-- Test Component -->
    <AnotherComp></AnotherComp>
    <!-- Chart -->
    <div class="main">
      <Chart></Chart>
    </div>
  </div>
</template>

<script>
import AnotherComp from "./components/AnotherComp";
import Chart from "./components/Chart";

export default {
  name: "App",
  components: {
    AnotherComp,
    Chart,
  },
};
</script>
