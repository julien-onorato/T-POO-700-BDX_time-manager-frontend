<template>
  <div>
    <h1>Chart Manager</h1>

    <div class="d-flex justify-content-center chart-buttons">
      <b-button
          :class="{'btn-active': selectedChart === 'bar'}"
          variant="success"
          class="btn-spacing text-white"
          @click="selectedChart = 'bar'"
      >
        Bar Chart
      </b-button>
      <b-button
          :class="{'btn-active': selectedChart === 'line'}"
          variant="success"
          class="btn-spacing text-white"
          @click="selectedChart = 'line'"
      >
        Line Chart
      </b-button>
      <b-button
          :class="{'btn-active': selectedChart === 'radar'}"
          variant="success"
          class="btn-spacing text-white"
          @click="selectedChart = 'radar'"
      >
        Radar Chart
      </b-button>
    </div>

    <BarChart v-if="selectedChart === 'bar'" />
    <LineChart v-if="selectedChart === 'line'" />
    <RadarChart v-if="selectedChart === 'radar'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BarChart from './Charts/BarChart.vue';
import LineChart from './Charts/LineChart.vue';
import RadarChart from './Charts/RadarChart.vue';

export default defineComponent({
  name: 'ChartManager',
  components: {
    BarChart,
    LineChart,
    RadarChart,
  },
  data() {
    return {
      selectedChart: 'bar', // Default selected chart
    };
  },
});
</script>

<style scoped>
.chart-buttons {
  margin-bottom: 20px;
}

.btn-spacing {
  margin-right: 10px;
}

.text-white {
  color: white !important;
}

.btn-active {
  background-color: #155724 !important; /* Darker green for active selection */
  border-color: #155724 !important;
}

h1 {
  margin-bottom: 20px;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}
</style>
