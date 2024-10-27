<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface WorkingTime {
  id?: number;
  userId: number;
  startTime: string;
  endTime: string;
}

interface NewWorkingTime {
  date: string;
  startTime: string;
  endTime: string;
  start?: string;
  end?: string;
}

export default defineComponent({
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      workingTimes: [] as WorkingTime[],
      newWorkingTime: {
        startTime: ``,
        endTime: ``,
      } as NewWorkingTime,
      updatedWorkingTime:
      {
        startTime: ``,
        endTime: ``,
      } as NewWorkingTime,
      errorMessage: '',
      editingId: null as number | null,
      isFormVisible: false,
      show: true, // Controls form display state for resetting form validation
    };
  },
  created() {
    this.getWorkingTimes();
  },
  methods: {
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
    },
    onSubmit(event:SubmitEvent) {
      event.preventDefault()
      alert(JSON.stringify(this.newWorkingTime))
    },
    onReset() {
      // Reset our form values
      this.newWorkingTime.date= '';
      this.newWorkingTime.startTime = ''
      this.newWorkingTime.endTime = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
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
    async createWorkingTime(): Promise<void> {
      if (!this.newWorkingTime.startTime || !this.newWorkingTime.endTime) {
        this.errorMessage = "Start time and end time cannot be empty.";
        return;
      }

      const start = new Date(`${this.newWorkingTime.date} ${this.newWorkingTime.startTime}`);
      const end = new Date(`${this.newWorkingTime.date} ${this.newWorkingTime.endTime}`);
      if (end <= start) {
        this.errorMessage = "End time must be after start time.";
        return;
      }

      try {
        await axios.post(`http://localhost:4000/api/workingtime/${this.userId}`, {
          workingtime: {
            start:  new Date(`${this.newWorkingTime.date} ${this.newWorkingTime.startTime}`).toISOString(),
            end:  new Date(`${this.newWorkingTime.date} ${this.newWorkingTime.endTime}`).toISOString(),
          },
        },
            {
              withCredentials: true // This allows sending cookies
            });
        await this.getWorkingTimes(); // Refresh the list after creation
        this.onReset(); // Reset the form after submission
        this.isFormVisible = false; // Hide the form after submission
      } catch (error) {
        console.error('Error creating working time:', error);
        this.errorMessage = "Failed to create working time. Please try again.";
      }
    },
    async updateWorkingTime(workingTimeId: number, startTime: string, endTime: string): Promise<void> {
      try {
        await axios.put(`http://localhost:4000/api/workingtime/${workingTimeId}`, {
          workingtime: {
            start: new Date(`${this.updatedWorkingTime.date} ${this.updatedWorkingTime.startTime}`).toISOString(),
            end:new Date(`${this.updatedWorkingTime.date} ${this.updatedWorkingTime.endTime}`).toISOString(),
          },
        },{
          withCredentials: true // This allows sending cookies
        });
        await this.getWorkingTimes(); // Refresh list after update
        this.editingId = null; // Reset editing state
      } catch (error) {
        console.error('Error updating working time:', error);
      }
    },
    async deleteWorkingTime(workingTimeId: number): Promise<void> {
      try {
        await axios.delete(`http://localhost:4000/api/workingtime/${workingTimeId}`);
        await this.getWorkingTimes(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting working time:', error);
      }
    },
    startEditing(workingTimeId: number) {
      this.editingId = workingTimeId; // Set the ID of the row being edited
    },
    stopEditing(workingTimeId: number, startTime: string, endTime: string) {
      this.updateWorkingTime(workingTimeId, startTime, endTime); // Save the changes
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
  }
});
</script>

<template>
  <div class="working-time">
    <!-- Error Message Display -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>

    <!-- Button to Add New Working Time -->
    <b-button variant="primary" @click="toggleForm" class="mt-3">
      {{ isFormVisible ? 'Cancel' : 'Add Working Time' }}
    </b-button>

    <!-- New Working Time Form -->
    <div v-if="isFormVisible" class="mt-3">
      <b-form @submit.prevent="createWorkingTime" @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-1" label="Working Date:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="newWorkingTime.date"
              :date-format="'YYYY-MM-DD'"
              type="date"
              placeholder="Select date"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="Start Hour:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="newWorkingTime.startTime"
              type="time"
              placeholder="Select start time"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label="End Hour:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="newWorkingTime.endTime"
              type="time"
              placeholder="Select end time"
              required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button class="reset-button" type="reset" variant="danger">Reset</b-button>
      </b-form>
    </div>

    <!-- Table Title and Display Existing Working Times -->
    <div v-if="workingTimes" class="mt-3">
      <h3>Existing Working Times for <b-badge>{{ userId }}</b-badge></h3> <!-- Table Title -->

      <b-table striped hover :items="workingTimes" :fields="['date', 'startTime', 'endTime', 'actions']">
        <!-- Date Column -->
        <template #cell(date)="data">
          <div v-if="editingId === data.item.id">
            <b-form-input
                id="input-1"
                v-model="updatedWorkingTime.date"
                :date-format="'YYYY-MM-DD'"
                type="date"
                placeholder="Select date"
                required
            ></b-form-input>
          </div>
          <div v-else>
            {{ formatDate(data.item.start) }}
          </div>
        </template>

        <!-- Start Time Column -->
        <template #cell(startTime)="data">
          <div v-if="editingId === data.item.id">
            <b-form-input
                v-model="updatedWorkingTime.startTime"
                type="time"
            ></b-form-input>
          </div>
          <div v-else>
            {{ formatHour(data.item.start) }}
          </div>
        </template>

        <!-- End Time Column -->
        <template #cell(endTime)="data">
          <div v-if="editingId === data.item.id">
            <b-form-input
                v-model="updatedWorkingTime.endTime"
                type="time"
                @input="stopEditing(data.item.id, data.item.start, data.item.end)"
            ></b-form-input>
          </div>
          <div v-else>
            {{ formatHour(data.item.end) }}
          </div>
        </template>

        <!-- Actions Column with Edit and Delete Buttons -->
        <template #cell(actions)="data">
          <div v-if="editingId === data.item.id">
            <b-button size="sm" variant="success" @click="stopEditing(data.item.id, data.item.start, data.item.end)" title="Save">
              <i class="bi bi-check"></i>
            </b-button>
          </div>
          <div v-else>
            <b-button size="sm" variant="link" @click="startEditing(data.item.id)" title="Edit">
              <i class="bi bi-pencil-square"></i>
            </b-button>
            <b-button size="sm" variant="danger" @click="deleteWorkingTime(data.item.id)" title="Delete">
              <i class="bi bi-trash"></i>
            </b-button>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>



<style scoped>
.working-time {
  max-width: 800px; /* Limit the maximum width of the component */
  margin: auto; /* Center the component horizontally */
  padding: 20px; /* Add padding around the component */
  background-color: #f8f9fa; /* Light background color for contrast */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}
.reset-button{
  margin-right: 50px;
}
.alert {
  margin-bottom: 20px; /* Space below the alert */
}

.b-button {
  margin-right: 10px; /* Space between buttons */
}

.b-form-group {
  margin-bottom: 15px; /* Space below each form group */
}

.b-table {
  width: 100%; /* Ensure the table takes full width */
  margin-top: 20px; /* Space above the table */
  border-collapse: collapse; /* Collapse borders for a cleaner look */
}

.b-table th {
  background-color: #007bff; /* Header background color */
  color: white; /* Header text color */
  padding: 10px; /* Padding around header cells */
}

.b-table td {
  padding: 10px; /* Padding around table data cells */
  border: 1px solid #dee2e6; /* Light border around cells */
}

.b-table tr:hover {
  background-color: #f1f1f1; /* Highlight on row hover */
}

.b-form-input {
  border-radius: 4px; /* Rounded corners for inputs */
  border: 1px solid #ced4da; /* Light border for inputs */
  padding: 5px; /* Padding inside input fields */
  transition: border-color 0.2s; /* Transition effect for focus */
}

.b-form-input:focus {
  border-color: #007bff; /* Change border color on focus */
  outline: none; /* Remove default outline */
}

.b-button.variant-primary {
  background-color: #007bff; /* Primary button background */
  color: white; /* Primary button text color */
}

.b-button.variant-danger {
  background-color: #dc3545; /* Danger button background */
  color: white; /* Danger button text color */
}

@media (max-width: 600px) {
  .working-time {
    padding: 10px; /* Reduce padding on smaller screens */
  }

  .b-button {
    margin-bottom: 10px; /* Space below buttons on small screens */
    width: 100%; /* Full width buttons */
  }

  .b-table {
    font-size: 14px; /* Smaller font size for table on small screens */
  }
}
</style>
