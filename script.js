// --- STATE MANAGEMENT ---
// Retrieve existing habits from LocalStorage, or start with an empty array.
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// DOM Elements
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const emptyState = document.getElementById('empty-state');
const todayDateEl = document.getElementById('today-date');

// Helper function to format today's date as YYYY-MM-DD
function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Display the current date in a friendly format in the header
function displayHeaderDate() {
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  todayDateEl.textContent = today.toLocaleDateString('en-US', options);
}

// --- RENDER FUNCTION ---
// Reads state (habits array) and builds the UI elements
function renderHabits() {
  const todayStr = getTodayString();

  // Clear existing list elements
  habitList.innerHTML = '';

  // Toggle empty state message
  if (habits.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Create list item for each habit
  habits.forEach((habit) => {
    const isCompletedToday = habit.lastCompletedDate === todayStr;

    const li = document.createElement('li');
    li.className = `habit-item ${isCompletedToday ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="habit-content" onclick="toggleHabit(${habit.id})">
        <span class="checkbox-custom"></span>
        <span class="habit-name">${escapeHtml(habit.name)}</span>
      </div>
      <button class="btn-delete" onclick="deleteHabit(${habit.id})" title="Delete habit">
        &times;
      </button>
    `;

    habitList.appendChild(li);
  });
}

// Helper to escape user text safely
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- CORE FEATURES ---

// 1. Add a new habit
function addHabit(name) {
  const newHabit = {
    id: Date.now(), // Unique identifier using current timestamp
    name: name.trim(),
    lastCompletedDate: null
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();
}

// 2. Toggle completion status for today
function toggleHabit(id) {
  const todayStr = getTodayString();

  habits = habits.map((habit) => {
    if (habit.id === id) {
      const isCompletedToday = habit.lastCompletedDate === todayStr;
      return {
        ...habit,
        // If completed today, unmark; otherwise set to today's date
        lastCompletedDate: isCompletedToday ? null : todayStr
      };
    }
    return habit;
  });

  saveHabits();
  renderHabits();
}

// 3. Delete a habit
function deleteHabit(id) {
  habits = habits.filter((habit) => habit.id !== id);
  saveHabits();
  renderHabits();
}

// 4. Save habits array to LocalStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// --- EVENT LISTENERS & INITIALIZATION ---

// Handle new habit submission
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitInput.value;
  if (name.trim()) {
    addHabit(name);
    habitInput.value = ''; // Reset input field
  }
});

// Run setup functions on page load
displayHeaderDate();
renderHabits();
