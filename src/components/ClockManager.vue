<template>
  <div>
    <h2>Clock Manager</h2>
    <div>
      <p v-if="isClockedIn">Working since: {{ formatDateTime(startDateTime) }}</p>
      <p v-else>No work period in progress.</p>
    </div>
    
    <button class="btn" v-if="!isClockedIn" @click="clockInHandler">Clock In</button>

    <button class="btn" v-if="isClockedIn" @click="clockOutHandler">Clock Out</button>

    <button class="btn" @click="getAllClocks">Show All Clocks</button>

    <h3>Current Clock Period:</h3>
    <table v-if="currentClockPeriod" class="clock-table">
      <thead>
        <tr>
          <th class="stubborn">Clock In</th>
          <th class="stubborn">Clock Out</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ formatDateTime(currentClockPeriod.clockIn) }}</td>
          <td>{{ currentClockPeriod.clockOut ? formatDateTime(currentClockPeriod.clockOut) : 'In progress' }}</td>
        </tr>
      </tbody>
    </table>
    
    <h3>All User Clocks:</h3>
    <table v-if="allClocks.length" class="clock-table">
      <thead>
        <tr>
          <th class="stubborn">Clock In</th>
          <th class="stubborn">Clock Out</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(period, index) in allClocks" :key="index">
          <td>{{ period.clockIn ? formatDateTime(period.clockIn) : 'N/A' }}</td>
          <td>{{ period.clockOut ? formatDateTime(period.clockOut) : 'In progress' }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No clocks found.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const startDateTime = ref<string | null>(null);
const isClockedIn = ref(false);
const allClocks = ref<Array<{ clockIn: string | null; clockOut: string | null }>>([]);
const currentClockPeriod = ref<{ clockIn: string; clockOut?: string } | null>(null);

const userID = '8';

const formatDateTime = (dateString: string | null) => {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A';
};

const getAllClocks = async () => {
  try {
    const response = await axios.get(`http://134.209.208.89:4000/api/clocks/${userID}`);
    
    const clocksData = response.data.clock_periods;

    if (!Array.isArray(clocksData)) {
      throw new TypeError('clock_periods is not an array');
    }

    allClocks.value = [];
    let currentClockIn: string | null = null;

    for (const clock of clocksData) {
      if (clock.clock_out === null) {
        currentClockIn = clock.clock_in;
      } else {
        allClocks.value.push({
          clockIn: clock.clock_in,
          clockOut: clock.clock_out,
        });
        currentClockIn = null;
      }
    }

    if (currentClockIn) {
      allClocks.value.push({
        clockIn: currentClockIn,
        clockOut: null,
      });
    }

    toast.success('All clocks loaded successfully!');
  } catch (error) {
    console.error('Error fetching all clocks:', error);
    toast.error('Error loading clocks. Please try again.');
  }
};

const clockInHandler = async () => {
  try {
    const clockInTime = new Date().toISOString();
    const response = await axios.post(`http://134.209.208.89:4000/api/clocks/${userID}`, {
      userID,
      clock_in: clockInTime,
    });

    console.log('Clock In Response:', response.data);

    if (!response.data || !response.data.clock_period || !response.data.clock_period.clock_in) {
      throw new Error('Invalid response structure');
    }

    startDateTime.value = response.data.clock_period.clock_in;
    isClockedIn.value = true;
    currentClockPeriod.value = { clockIn: response.data.clock_period.clock_in, clockOut: undefined };

    toast.success(response.data.message);
  } catch (error) {
    console.error('Error during clock in:', error);
    toast.error('Clock in failed. Please try again.');
  }
};


const clockOutHandler = async () => {
  try {
    const response = await axios.post(`http://134.209.208.89:4000/api/clocks/${userID}/out`);
    
    const clockOutTime = new Date().toISOString();
    
    console.log('Clock Out Response:', response.data);

    startDateTime.value = null;
    isClockedIn.value = false;

    if (currentClockPeriod.value) {
      currentClockPeriod.value.clockOut = clockOutTime;
    }
    
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error during clock out:', error);
    toast.error('Clock out failed. Please try again.');
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.btn {
  padding: 10px 20px;
  margin: 0.5rem 0;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}

.stubborn {
  color: black;
}

.clock-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.clock-table th, .clock-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.clock-table th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
