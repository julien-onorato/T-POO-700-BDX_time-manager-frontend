<template>
    <Radar :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { Radar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
  } from 'chart.js';
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
  );
  
  export default {
    name: 'RadarChart',
    components: { Radar },
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
            r: {
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
  