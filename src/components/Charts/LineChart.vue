<template>
    <Line :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);
  
  export default {
    name: 'LineChart',
    components: { Line },
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({
          responsive: true,
        //   maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Jours de la semaine'
              }
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 200,
              title: {
                display: true,
                text: 'Heures travaillées'
              }
            }
          }
        })
      }
    }
  };
  </script>
  