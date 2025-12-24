// MetaMind - Metacognition Development App
// Data Storage & State Management

const MetaMindApp = {
  // Data structures
  data: {
    journalEntries: [],
    exercisesCompleted: [],
    streak: 0,
    lastActiveDate: null,
    daysActive: new Set(),
    achievements: []
  },

  // Journal Prompts (Research-backed)
  prompts: {
    learning: [
      "What is one idea from today you fully understand and one idea you don't yet understand?",
      "How do the ideas you learned today connect to what you already knew?",
      "What was the most challenging part of learning today? What might help you overcome this challenge?",
      "What study strategies did you implement today and how effective were they?",
      "Describe your experience as a learner today. What went well? What could improve?"
    ],
    growth: [
      "What have you learned about your strengths and areas in need of improvement?",
      "How am I progressing as a learner? What evidence supports this?",
      "What steps should I take or resources should I use to meet my challenges?",
      "Before today, I thought _______. Now I understand _______.",
      "What new insights did you develop about yourself today?"
    ],
    reflection: [
      "What were some of my most challenging moments today and what made them so?",
      "What were some of my most powerful learning moments and what made them so?",
      "How did my mindset affect how I approached my work today?",
      "What patterns do I notice in how I think and learn?",
      "If I could give advice to myself yesterday, what would it be?"
    ],
    planning: [
      "What are my main goals for tomorrow? Why are these important?",
      "What obstacles might I face and how can I prepare for them?",
      "How can I best use my strengths to achieve my goals?",
      "What resources or support do I need to be successful?",
      "How will I know if I've been successful?"
    ]
  },

  // Exercise templates for each phase
  exercises: {
    planning: {
      title: "Planning Phase: Set Your Course",
      questions: [
        {
          id: "goal",
          question: "What is your specific learning or task goal?",
          type: "textarea",
          placeholder: "Be as specific as possible..."
        },
        {
          id: "breakdown",
          question: "Break this goal into 3-5 smaller, manageable steps:",
          type: "textarea",
          placeholder: "1. ...\n2. ...\n3. ..."
        },
        {
          id: "prior",
          question: "What do you already know about this topic that will help you?",
          type: "textarea",
          placeholder: "List relevant prior knowledge..."
        },
        {
          id: "strategy",
          question: "What strategies or methods will you use to achieve this goal?",
          type: "textarea",
          placeholder: "E.g., active reading, practice problems, teaching others..."
        },
        {
          id: "timeline",
          question: "How much time will you allocate to this task?",
          type: "text",
          placeholder: "E.g., 2 hours, 30 minutes..."
        }
      ]
    },
    monitoring: {
      title: "Monitoring Phase: Check Your Understanding",
      questions: [
        {
          id: "comprehension",
          question: "On a scale of 1-10, how well do you understand the material so far?",
          type: "number",
          placeholder: "1-10"
        },
        {
          id: "muddy",
          question: "What's the 'muddiest point' - the most confusing aspect right now?",
          type: "textarea",
          placeholder: "Describe what's unclear..."
        },
        {
          id: "selfcheck",
          question: "Ask yourself: Can I explain this concept to someone else? Try it here:",
          type: "textarea",
          placeholder: "Explain in your own words..."
        },
        {
          id: "progress",
          question: "How are you progressing toward your goal? What's working?",
          type: "textarea",
          placeholder: "Reflect on your progress..."
        },
        {
          id: "adjustment",
          question: "Do you need to adjust your approach? If so, how?",
          type: "textarea",
          placeholder: "What changes might help..."
        }
      ]
    },
    evaluating: {
      title: "Evaluating Phase: Reflect & Improve",
      questions: [
        {
          id: "success",
          question: "Did you achieve your learning goal? Why or why not?",
          type: "textarea",
          placeholder: "Be honest with yourself..."
        },
        {
          id: "strategies",
          question: "Which strategies were most effective? Which weren't?",
          type: "textarea",
          placeholder: "Evaluate each strategy you used..."
        },
        {
          id: "strengths",
          question: "What did you do particularly well?",
          type: "textarea",
          placeholder: "Acknowledge your successes..."
        },
        {
          id: "improve",
          question: "What would you do differently next time?",
          type: "textarea",
          placeholder: "Specific improvements..."
        },
        {
          id: "next",
          question: "What's your next step for continued learning?",
          type: "textarea",
          placeholder: "Your action plan..."
        }
      ]
    }
  },

  // Initialize app
  init() {
    this.loadData();
    this.updateUI();
    this.refreshPrompt();
    this.displayJournalHistory();
    this.setupEventListeners();
    this.checkStreak();
  },

  // Local Storage Management
  loadData() {
    const saved = localStorage.getItem('metaMindData');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.data = {
        ...this.data,
        ...parsed,
        daysActive: new Set(parsed.daysActive || [])
      };
    }
  },

  saveData() {
    const toSave = {
      ...this.data,
      daysActive: Array.from(this.data.daysActive)
    };
    localStorage.setItem('metaMindData', JSON.stringify(toSave));
  },

  // Streak Management
  checkStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (this.data.lastActiveDate === today) {
      // Already active today
      return;
    } else if (this.data.lastActiveDate === yesterday) {
      // Consecutive day
      this.data.streak++;
    } else if (this.data.lastActiveDate !== null) {
      // Streak broken
      this.data.streak = 1;
    } else {
      // First day
      this.data.streak = 1;
    }
    
    this.data.lastActiveDate = today;
    this.data.daysActive.add(today);
    this.saveData();
    this.updateUI();
  },

  // UI Updates
  updateUI() {
    document.getElementById('streak-count').textContent = this.data.streak;
    document.getElementById('journal-count').textContent = this.data.journalEntries.length;
    document.getElementById('exercise-count').textContent = this.data.exercisesCompleted.length;
    document.getElementById('days-active').textContent = this.data.daysActive.size;
    
    this.updateAchievements();
  },

  updateAchievements() {
    const achievements = [];
    
    if (this.data.streak >= 3) achievements.push({ name: "3-Day Streak", emoji: "🔥" });
    if (this.data.streak >= 7) achievements.push({ name: "Week Warrior", emoji: "⭐" });
    if (this.data.streak >= 30) achievements.push({ name: "Month Master", emoji: "🏆" });
    if (this.data.journalEntries.length >= 10) achievements.push({ name: "Reflective Thinker", emoji: "📝" });
    if (this.data.exercisesCompleted.length >= 5) achievements.push({ name: "Exercise Enthusiast", emoji: "💪" });
    if (this.data.exercisesCompleted.length >= 20) achievements.push({ name: "Metacognition Pro", emoji: "🧠" });
    
    const container = document.getElementById('achievements-list');
    if (achievements.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted);">Complete exercises and journal entries to unlock achievements!</p>';
    } else {
      container.innerHTML = achievements.map(a => 
        `<span class="badge success">${a.emoji} ${a.name}</span>`
      ).join(' ');
    }
  },

  // Journal Functions
  refreshPrompt() {
    const categories = Object.keys(this.prompts);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const prompts = this.prompts[randomCategory];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    document.getElementById('current-prompt').textContent = randomPrompt;
  },

  saveJournalEntry() {
    const text = document.getElementById('journal-text').value.trim();
    
    if (!text) {
      this.showToast('Please write something before saving!');
      return;
    }
    
    const entry = {
      id: Date.now(),
      content: text,
      prompt: document.getElementById('current-prompt').textContent,
      date: new Date().toISOString()
    };
    
    this.data.journalEntries.unshift(entry);
    this.checkStreak();
    this.saveData();
    this.displayJournalHistory();
    this.updateUI();
    
    document.getElementById('journal-text').value = '';
    this.showToast('Journal entry saved! 📝');
    this.refreshPrompt();
  },

  clearJournal() {
    document.getElementById('journal-text').value = '';
  },

  displayJournalHistory() {
    const container = document.getElementById('journal-history');
    const recent = this.data.journalEntries.slice(0, 5);
    
    if (recent.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No entries yet. Start journaling!</p>';
      return;
    }
    
    container.innerHTML = recent.map(entry => `
      <div class="journal-entry">
        <div class="entry-header">
          <div class="entry-date">${new Date(entry.date).toLocaleDateString()} at ${new Date(entry.date).toLocaleTimeString()}</div>
        </div>
        <div style="margin-bottom: 0.5rem; color: var(--accent-primary); font-style: italic; font-size: 0.9rem;">
          "${entry.prompt}"
        </div>
        <div class="entry-content">${entry.content}</div>
      </div>
    `).join('');
  },

  // Exercise Functions
  openExercise(phase) {
    const exercise = this.exercises[phase];
    const modal = document.getElementById('exercise-modal');
    const title = document.getElementById('exercise-title');
    const content = document.getElementById('exercise-content');
    
    title.textContent = exercise.title;
    
    content.innerHTML = exercise.questions.map(q => `
      <div class="exercise-question">
        <h4>${q.question}</h4>
        ${q.type === 'textarea' ? 
          `<textarea id="${q.id}" placeholder="${q.placeholder}" style="min-height: 100px;"></textarea>` :
          `<input type="${q.type}" id="${q.id}" placeholder="${q.placeholder}" ${q.type === 'number' ? 'min="1" max="10"' : ''}>`
        }
      </div>
    `).join('');
    
    modal.classList.add('active');
    modal.dataset.phase = phase;
  },

  closeExerciseModal() {
    document.getElementById('exercise-modal').classList.remove('active');
  },

  completeExercise() {
    const modal = document.getElementById('exercise-modal');
    const phase = modal.dataset.phase;
    const exercise = this.exercises[phase];
    
    // Collect responses
    const responses = {};
    exercise.questions.forEach(q => {
      const element = document.getElementById(q.id);
      responses[q.id] = element.value;
    });
    
    // Save exercise
    const completed = {
      id: Date.now(),
      phase: phase,
      responses: responses,
      date: new Date().toISOString()
    };
    
    this.data.exercisesCompleted.push(completed);
    this.checkStreak();
    this.saveData();
    this.updateUI();
    
    this.closeExerciseModal();
    this.showToast(`${exercise.title} completed! 🎉`);
  },

  // Utility Functions
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const target = link.getAttribute('href').substring(1);
        scrollToSection(target);
      });
    });
  }
};

// Global Functions (called from HTML)
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function refreshPrompt() {
  MetaMindApp.refreshPrompt();
}

function saveJournalEntry() {
  MetaMindApp.saveJournalEntry();
}

function clearJournal() {
  MetaMindApp.clearJournal();
}

function openExercise(phase) {
  MetaMindApp.openExercise(phase);
}

function closeExerciseModal() {
  MetaMindApp.closeExerciseModal();
}

function completeExercise() {
  MetaMindApp.completeExercise();
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MetaMindApp.init());
} else {
  MetaMindApp.init();
}
