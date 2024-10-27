<template>
  <h2>Le graphique ci-dessous illustre la moyenne des heures travaillées par jour, de tous les employés, pour la semaine précédente ainsi que pour le mois précédent, visualisée à travers deux séries de barres.</h2>
  <Radar :data="chartData" :options="chartOptions" v-if="!loading" />
  <p v-else>Loading data...</p>
</template>

<script>
  import { Radar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, } from 'chart.js';
  import axios from 'axios';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, Filler);

  export default {
    name: 'RadarChart',
    components: { Radar },
    data() {
      return {
        chartData: null, // Data for the chart
        chartOptions: null,
        loading: true,
      };
    },
    methods: {
      async getWorkingTimes() {
        try {
          const response = await axios.get('http://localhost:4000/api/workingtime',{
            withCredentials: true // This allows sending cookies
          });
          const data = response.data.data;

          if (Array.isArray(data)) {
            // Calculate previous week's dates (Monday to Friday)
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay();
            const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const lastMonday = new Date(currentDate);
            lastMonday.setDate(currentDate.getDate() - daysSinceMonday - 7);
            lastMonday.setHours(0, 0, 0, 0);

            const lastFriday = new Date(lastMonday);
            lastFriday.setDate(lastMonday.getDate() + 4);
            lastFriday.setHours(23, 59, 59, 999);

            // Calculate last month's dates
            const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

            // Preparation for daily hours calculation (Monday to Friday)
            const durationInHoursPerDay = [0, 0, 0, 0, 0];
            const durationInHoursPerDayLastMonth = [0, 0, 0, 0, 0];
            const workingDays = [0, 0, 0, 0, 0];
            const workingDaysLastMonth = [0, 0, 0, 0, 0];

            // Filter and calculate averages for the previous week and previous month
            data.forEach((entry) => {
              const entryDate = new Date(entry.start);

              // Calculation for the previous week
              if (entryDate >= lastMonday && entryDate <= lastFriday) {
                const dayIndex = entryDate.getDay();
                if (dayIndex >= 1 && dayIndex <= 5) {
                  const durationInHours = this.calculateDuration(entry.start, entry.end);
                  durationInHoursPerDay[dayIndex - 1] += durationInHours;
                  workingDays[dayIndex - 1]++;
                }
              }

              // Calculation for the previous month
              if (entryDate >= firstDayOfLastMonth && entryDate <= lastDayOfLastMonth) {
                const dayIndex = entryDate.getDay();
                if (dayIndex >= 1 && dayIndex <= 5) {
                  const durationInHours = this.calculateDuration(entry.start, entry.end);
                  durationInHoursPerDayLastMonth[dayIndex - 1] += durationInHours;
                  workingDaysLastMonth[dayIndex - 1]++;
                }
              }
            });

            // Calculate averages per day for the week and month
            const averageDurationPerDay = durationInHoursPerDay.map((totalHours, index) =>
              workingDays[index] > 0 ? totalHours / workingDays[index] : 0
            );

            const averageDurationPerDayLastMonth = durationInHoursPerDayLastMonth.map((totalHours, index) =>
              workingDaysLastMonth[index] > 0 ? totalHours / workingDaysLastMonth[index] : 0
            );

            // Update the chart data with the two datasets
            this.chartData = {
              labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
              datasets: [
                {
                  label: 'Moyenne des heures travaillées par jour (semaine précédente)',
                  backgroundColor: '#42b883',
                  data: averageDurationPerDay, // Average hours per day for the previous week
                },
                {
                  label: 'Moyenne des heures travaillées par jour (mois précédent)',
                  backgroundColor: '#ff6384',
                  data: averageDurationPerDayLastMonth, // Average hours per day for the previous month
                }
              ],
            };
          } else {
            console.error("Erreur: 'data' n'est pas un tableau", data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des heures de travail :", error);
        } finally {
          this.loading = false;
        }
      },

      // Method to calculate the duration in hours
      calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const durationInMilliseconds = end.getTime() - start.getTime();
        return durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
      }
    },
    mounted() {
      this.getWorkingTimes(); // Fetch data when the component is mounted
    }
  };
</script>

<style scoped>
  h2 {
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
</style>
