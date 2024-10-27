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
        <button class="btn btn-success btn-md btn-spacing text-white clock-btn" v-if="isClockedIn" @click="clockOutHandler">Clock Out</button>
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
        <button class="btn btn-success btn-md btn-spacing text-white clock-btn" @click="toggleClocks">
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
import { useToast } from 'vue-toastification';
import { ClockManagerService } from '@/services/ClockManagerService';

const toast = useToast();
const clockManagerService = new ClockManagerService();

const startDateTime = ref<string | null>(null);
const isClockedIn = ref(false);
const allClocks = ref<Array<{ clockIn: string | null; clockOut: string | null }>>([]);
const currentClockPeriod = ref<{ clockIn: string; clockOut?: string } | null>(null);
const userID = 8; // Set this as a number to match your service parameter type

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
    const clocksData = await clockManagerService.getAllClocks(userID);

    allClocks.value = clocksData.map(clock => ({
      clockIn: clock.clockIn,
      clockOut: clock.clockOut
    })).reverse();
    
    toast.success('All clocks loaded successfully!');
  } catch (error) {
    console.error('Error fetching all clocks:', error);
    toast.error('Error loading clocks. Please try again.');
  }
};

const clockInHandler = async () => {
  try {
    const response = await clockManagerService.clockIn(userID);
    startDateTime.value = response.clockIn;
    isClockedIn.value = true;
    currentClockPeriod.value = { clockIn: response.clockIn };

    toast.success("Clocked in successfully!");
  } catch (error) {
    console.error('Error during clock in:', error);
    toast.error('Clock in failed. Please try again.');
  }
};

const clockOutHandler = async () => {
  try {
    const response = await clockManagerService.clockOut(userID);
    const clockOutTime = new Date().toISOString();

    startDateTime.value = null;
    isClockedIn.value = false;

    if (currentClockPeriod.value) {
      currentClockPeriod.value.clockOut = clockOutTime;
    }

    toast.success("Clocked out successfully!");
  } catch (error) {
    console.error('Error during clock out:', error);
    toast.error('Clock out failed. Please try again.');
  }
};
</script>

<style scoped>
/* Styling remains unchanged */
.clock-manager {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
}

.left {
  width: 40%;
}

.right {
  width: 55%;
}

/* Remaining styles */
</style>
