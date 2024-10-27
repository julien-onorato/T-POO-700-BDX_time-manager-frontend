<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import { BTable } from "bootstrap-vue-3";

export interface WorkingTime {
  id: number; // Assuming ID is a number, adjust as necessary
  start: string;
  end: string;
}

export default defineComponent({
  components: {
    BTable, // Register BootstrapVue table component
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      workingTimes: [] as WorkingTime[],
      errorMessage: '',
    };
  },
  methods: {
    async getWorkingTimes(): Promise<void> {
      try {
        const response = await axios.get(
            `http://localhost:4000/api/workingtime/${this.userId}`,{
              withCredentials: true // This allows sending cookies
            }
        ).then(({data}) => data.data)
            .then(data => {
              console.log("Data:", data)
              this.workingTimes = data
            })
        console.log("Working times loaded:", this.workingTimes)
      } catch (error) {
        console.error("Error fetching working times:", error);
        this.errorMessage = "Failed to load working times. Please try again later.";
      }
    },
    formatDate(dateTime: string): string {
      const date = new Date(dateTime);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }); // Format: MM/DD/YYYY
    },
    formatHour(dateTime: string): string {
      const date = new Date(dateTime);
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); // Hour:Minute format
    },
    calculateDuration(startTime: string, endTime: string): string {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end < start) return 'End time is before start time';

      const diffHrs = end.getHours() - start.getHours();
      const diffMins = end.getMinutes() - start.getMinutes();
      return `${diffHrs} H : ${diffMins} m`;
    },
  },
  mounted() {
    this.getWorkingTimes();
  },
});
</script>

<template>
  <b-container>
    <b-row>
      <b-col>
        <h2>Working Times for User <b-badge>{{ userId }}</b-badge></h2>
        <!-- Scrollable container for working times -->
        <div class="scrollable-container">
          <b-row v-if="workingTimes.length">
            <b-col cols="12" v-for="(time, index) in workingTimes" :key="time.id" class="mb-3">
              <b-card class="text-center" border-variant="light">
                <b-card-text>
                  <!-- Display Date -->
                  <div class="date"> <strong>Date:</strong> {{ formatDate(time.start) }}</div>

                  <!-- Display Start and End Time Side by Side -->
                  <div class="time-container">
                    <div class="startTime"><strong>Start:</strong> {{ formatHour(time.start) }}</div>
                    <div class="endTime"><strong>End:</strong> {{ formatHour(time.end) }}</div>
                  </div>

                  <!-- Duration -->
                  <div class="duration"><strong>Duration:</strong> {{ calculateDuration(time.start, time.end) }}</div>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </div>

        <!-- Show message if no working times are available -->
        <p v-if="!workingTimes || workingTimes.length == 0">No working times available.</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>


<style scoped>
.scrollable-container {
  max-height: 400px; /* Adjust this value as needed */
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #dee2e6; /* Optional border for better visual */
  border-radius: 5px;
  background-color: #f9f9f9;
}

.date {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.time-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.startTime {
  padding-right: 10px;
  color: green;
}

.endTime {
  padding-left: 10px;
  color: red;
}

.duration {
  font-size: 1.1rem;
  margin-top: 10px;
}
</style>
