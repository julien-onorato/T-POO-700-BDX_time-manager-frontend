<template>
  <h2>Le graphique ci-dessous illustre la moyenne des heures d'arrivée et de départ par jour de tous les employés</h2>
  <Line :data="chartData" :options="chartOptions" v-if="!loading" />
  <p v-else>Loading data...</p>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  name: 'LineChart',
  components: { Line },
  data() {
    return {
      chartData: null, // Data for the chart
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Jours de la semaine'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Heures'
            },
            min: 0,
            max: 25,
          }
        }
      },
      loading: true,
    };
  },
  methods: {
    async getArrivalAndDepartureTimes() {
      try {
        const response = await axios.get('http://localhost:4000/api/workingtime',
            {
              withCredentials: true // This allows sending cookies
            });
        const data = response.data.data;

        if (Array.isArray(data)) {
          // Initialize variables for calculating average arrival and departure times per day
          const arrivalTimesPerDay = [[], [], [], [], []]; // Arrays for each weekday (Monday to Friday)
          const departureTimesPerDay = [[], [], [], [], []]; // Arrays for each weekday (Monday to Friday)
          const currentDate = new Date();
          const dayOfWeek = currentDate.getDay();
          const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          const lastMonday = new Date(currentDate);
          lastMonday.setDate(currentDate.getDate() - daysSinceMonday - 7);
          lastMonday.setHours(0, 0, 0, 0);

          const lastFriday = new Date(lastMonday);
          lastFriday.setDate(lastMonday.getDate() + 4);
          lastFriday.setHours(23, 59, 59, 999);

          // Filter data for the previous week and store arrival and departure times
          data.forEach((entry) => {
            const entryDate = new Date(entry.start);
            const departureDate = new Date(entry.end);

            // Check if the entry is within the previous week (Monday to Friday)
            if (entryDate >= lastMonday && entryDate <= lastFriday) {
              const dayIndex = entryDate.getDay();
              if (dayIndex >= 1 && dayIndex <= 5) {
                const arrivalHour = entryDate.getHours() + entryDate.getMinutes() / 60; // Convert to decimal hours
                const departureHour = departureDate.getHours() + departureDate.getMinutes() / 60;
                arrivalTimesPerDay[dayIndex - 1].push(arrivalHour); // Store arrival hour for each day
                departureTimesPerDay[dayIndex - 1].push(departureHour);
              }
            }
          });

          // Calculate average arrival and departure times per day
          const averageArrivalPerDay = arrivalTimesPerDay.map((times) =>
            times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
          );

          const averageDeparturePerDay = departureTimesPerDay.map((times) =>
            times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
          );

          // Update the chart data with two datasets (arrival and departure)
          this.chartData = {
            labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
            datasets: [
              {
                label: 'Heures moyennes d\'arrivée (semaine précédente)',
                backgroundColor: '#42b883',
                borderColor: '#42b883',
                fill: false,
                data: averageArrivalPerDay, // Average arrival time per day
              },
              {
                label: 'Heures moyennes de départ (semaine précédente)',
                backgroundColor: '#ff6384',
                borderColor: '#ff6384',
                fill: false,
                data: averageDeparturePerDay, // Average departure time per day
              }
            ],
          };
        } else {
          console.error("Erreur: 'data' n'est pas un tableau", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des heures d'arrivée et de départ :", error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getArrivalAndDepartureTimes(); // Fetch data when the component is mounted
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  font-size: 1.1rem;
}
</style>
