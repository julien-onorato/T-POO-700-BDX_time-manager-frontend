<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import { BTable } from "bootstrap-vue-3";

interface WorkingTime {
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
            `http://localhost:4000/api/workingtime/${this.userId}`
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
        <h2>Working Times for User <b-badge>{{ userId }}</b-badge> </h2>
        <b-table striped hover :items="workingTimes" :fields="['id', 'date', 'start', 'end', 'duration']">
          <!-- ID column -->
          <template #cell(id)="data">
            {{ data.item.id }}
          </template>
          <!-- Date column: Display the date -->
          <template #cell(date)="data">
            {{ formatDate(data.item.start) }}
          </template>
          <!-- Start Time column: Only display the hour -->
          <template #cell(start)="data">
            {{ formatHour(data.item.start) }}
          </template>
          <!-- End Time column: Only display the hour -->
          <template #cell(end)="data">
            {{ formatHour(data.item.end) }}
          </template>
          <!-- Duration column -->
          <template #cell(duration)="data">
            {{ calculateDuration(data.item.start, data.item.end) }}
          </template>
        </b-table>
        <p v-if="!workingTimes || workingTimes.length == 0">No working times available.</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>

</style>
