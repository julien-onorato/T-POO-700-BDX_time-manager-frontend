<template>
  <div class="clock-manager">
    <div class="left">
      <h3>Pointer</h3>
      <div class="status-container">
        <p v-if="isClockedIn">Working since: <strong>{{ formatDateTime(startDateTime) }}</strong></p>
        <p v-else>No work period in progress.</p>
      </div>
      <a href="#" class="absence-link">Declare an absence</a>
      <div class="buttons-container">
        <button class="btn btn-success btn-md btn-spacing text-white clock-btn" v-if="!isClockedIn" @click="clockInHandler">Clock In</button>
        <button class="btn btn-success btn-md btn-spacing text-white clock-btn clock-btn" v-if="isClockedIn" @click="clockOutHandler">Clock Out</button>
      </div>
    </div>
    <div class="right">
      <h3>Current Clock Period</h3>
      <table v-if="currentClockPeriod" class="clock-table">
        <thead>
          <tr>
            <th>Clock In</th>
            <th>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ formatDateTime(currentClockPeriod.clockIn) }}</td>
            <td>{{ currentClockPeriod.clockOut ? formatDateTime(currentClockPeriod.clockOut) : 'In progress' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="buttons-container">
        <button class="btn btn-success btn-md btn-spacing text-white clock-btn clock-btn show-all-btn" @click="toggleClocks">
          {{ showClocks ? 'Hide All Clocks' : 'Show All Clocks' }}
        </button>
      </div>
      <div v-if="showClocks" class="scrollable-table">
        <table v-if="allClocks.length" class="clock-table">
          <thead>
            <tr>
              <th>Clock In</th>
              <th>Clock Out</th>
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
    </div>
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

const showClocks = ref(false);

const toggleClocks = () => {
  showClocks.value = !showClocks.value;
  if (showClocks.value && allClocks.value.length === 0) {
    getAllClocks();
  }
};

const getAllClocks = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/api/clocks/${userID}`,{
      withCredentials: true // This allows sending cookies
    });

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

    allClocks.value.reverse();
    toast.success('All clocks loaded successfully!');
  } catch (error) {
    console.error('Error fetching all clocks:', error);
    toast.error('Error loading clocks. Please try again.');
  }
};

const clockInHandler = async () => {
  try {
    const clockInTime = new Date().toISOString();
    const response = await axios.post(`http://localhost:4000/api/clocks/${userID}`, {
      userID,
      clock_in: clockInTime,
    },{
      withCredentials: true // This allows sending cookies
    });

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
    const response = await axios.post(`http://localhost:4000/api/clocks/${userID}/out`,{
      withCredentials: true // This allows sending cookies
    });
    const clockOutTime = new Date().toISOString();

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
.clock-manager {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
}

.left {
  width: 40%; /* Left section will take 40% of the container */
}

.right {
  width: 55%; /* Right section will take 55% of the container */
}

h3 {
  font-family: 'Arial', sans-serif;
  color: #333;
  margin-bottom: 1.5rem;
}

.status-container {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.absence-link {
  color: #4CAF50;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
  margin-top: 20px;
  text-decoration: underline;
}

.absence-link:hover {
  color: #155724;
}

.buttons-container {
  display: flex;
  gap: 10px;
  margin-bottom: 0px;
  margin-top: 4px;
}

.btn:hover {
  background-color: #155724 !important; /* Darker green for active selection */
  border-color: #155724 !important;
}

.clock-section {
  margin-top: 1.5rem;
}

.clock-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.clock-table th, .clock-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.clock-table th {
  background-color: #f2f2f2;
}

.clock-table td {
  font-size: 0.9rem;
}

.scrollable-table {
  max-height: 274px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .clock-manager {
    flex-direction: column;
  }

  .left, .right {
    width: 100%;
  }

  .buttons-container {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    margin-bottom: 1rem;
  }
}
</style>
