<template>
  <div>
    <h1>Chart Manager</h1>
    <h2>Le graphique suivant montre la moyenne d'heures travaillées (par jour) de tous les employés grâce à trois graphiques différents</h2>

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

    <p v-if="loading">Loading data...</p>

    <BarChart v-if="selectedChart === 'bar' && chartData" :chartData="chartData" :chartOptions="chartOptions" />
    <LineChart v-if="selectedChart === 'line' && chartData" :chartData="chartData" :chartOptions="chartOptions" />
    <RadarChart v-if="selectedChart === 'radar' && chartData" :chartData="chartData" :chartOptions="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BarChart from './Charts/BarChart.vue';
import LineChart from './Charts/LineChart.vue';
import RadarChart from './Charts/RadarChart.vue';
import axios from 'axios';
import type { WorkingTime } from "./WorkingTimes.vue";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    backgroundColor: string;
    data: number[];
  }>;
}

export default defineComponent({
  name: 'ChartManager',
  components: {
    BarChart,
    LineChart,
    RadarChart
  },
  props: {
    userId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      workingTimes: [] as WorkingTime[],
      selectedChart: 'bar',
      chartData: null as ChartData | null,
      loading: true,
      chartOptions: {}, // Add this line to define chartOptions
    };
  },
  methods: {
    async getWorkingTimes() {
      try {
        const response = await axios.get('http://134.209.208.89:4000/api/workingtime');
        const data = response.data.data;

        if (Array.isArray(data)) {
          const durationInHoursPerDay = [0, 0, 0, 0, 0]; // Lundi à Vendredi

          data.forEach((entry) => {
            const dayIndex = new Date(entry.start).getDay(); // getDay() retourne 1 pour lundi
            if (dayIndex >= 1 && dayIndex <= 5) {
              const durationInHours = this.calculateDuration(entry.start, entry.end);
              durationInHoursPerDay[dayIndex - 1] += durationInHours;
            }
          });

          this.chartData = {
            labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
            datasets: [
              {
                label: 'Moyenne des heures travaillées par jour',
                backgroundColor: '#42b883',
                data: durationInHoursPerDay,
              },
            ],
          };

          this.workingTimes = data;
        } else {
          console.error("Erreur: 'data' n'est pas un tableau", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des heures de travail :", error);
      } finally {
        this.loading = false;
      }
    },


    calculateDuration(startTime: string, endTime: string): number {
      const start = new Date(startTime);
      const end = new Date(endTime);

      const durationInMilliseconds = end.getTime() - start.getTime();
      const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

      return durationInHours;
    },
  },
  mounted() {
    this.getWorkingTimes();
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

/* Style par défaut pour les boutons */
.btn-active {
  background-color: #155724 !important; /* Couleur verte plus foncée pour indiquer la sélection */
  border-color: #155724 !important;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

</style>