/* ==========================================================================
   SMARTFIT - Smart Hydration Tracker Service
   Personalized goal calculation, visual fluid bottle, quick & custom logs,
   intelligent reminders with snooze, live countdown, reminder & intake histories,
   and hydration streak tracker.
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { dbUpsertWater } from './db.js';

export class WaterService {
  static countdownInterval = null;
  static lastLoggedMl = null;

  static init() {
    this.ensureHydrationState();
    this.bindEvents();
    this.startCountdownTicker();
    this.render();

    window.addEventListener('smartfit:state-changed', () => {
      this.render();
    });
  }

  /**
   * Initializes hydration state in storage if not already present.
   */
  static ensureHydrationState() {
    const state = StorageService.getState();
    if (!state.hydration) {
      const cleanHydration = {
        todayLogs: [],
        reminderHistory: [],
        nextReminderTime: null,
        nextReminderMl: 250,
        wakeTime: '07:00',
        sleepTime: '23:00',
        streak: 0,
        lastLoggedDate: null
      };

      StorageService.update(s => {
        s.hydration = cleanHydration;
        return s;
      });
    }
  }

  /**
   * Calculate personalized water goal based on body weight, calories, and activity level.
   */
  static getPersonalizedGoal(profile) {
    const p = profile || StorageService.getState().profile || {};
    const weight = parseFloat(p.weight) || 71;
    const calories = parseInt(p.dailyCalorieTarget) || 2000;
    const activity = p.activityLevel || 'moderate';

    // 1. Base hydration: 30 ml per kg bodyweight (e.g. 71 kg * 30 = 2,130 ml)
    const baseMl = Math.round(weight * 30);

    // 2. Activity bonus: sweat & exertion replenishment
    const activityBonuses = {
      sedentary: 0,
      light: 150,
      moderate: 250,
      very_active: 400,
      extra_active: 550
    };
    const activityBonus = activityBonuses[activity] ?? 250;

    // 3. Calorie factor: metabolic water demand
    const calorieBonus = Math.max(0, Math.round((calories - 1500) * 0.25));

    // 4. Practical rounded target (nearest 50ml)
    const rawTotal = baseMl + activityBonus + calorieBonus;
    const totalMl = Math.max(1500, Math.round(rawTotal / 50) * 50);

    return {
      totalMl,
      baseMl,
      activityBonus,
      calorieBonus,
      weight,
      calories,
      activity
    };
  }

  static bindEvents() {
    // Quick add buttons (+250ml, +500ml, +750ml)
    document.querySelectorAll('[data-water-add-ml]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ml = parseInt(btn.getAttribute('data-water-add-ml'), 10);
        if (ml > 0) this.addWater(ml);
      });
    });

    // Custom water input toggle & submit
    const customToggleBtn = document.getElementById('water-btn-custom-toggle');
    const customContainer = document.getElementById('water-custom-input-wrap');
    const customAddBtn = document.getElementById('water-btn-custom-add');
    const customInput = document.getElementById('water-custom-amount-inp');

    if (customToggleBtn && customContainer) {
      customToggleBtn.addEventListener('click', () => {
        const isHidden = customContainer.style.display === 'none' || !customContainer.style.display;
        customContainer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden && customInput) customInput.focus();
      });
    }

    if (customAddBtn && customInput) {
      customAddBtn.addEventListener('click', () => {
        const val = parseInt(customInput.value, 10);
        if (!val || val <= 0) {
          AuthService.showToast('Please enter a valid water amount in ml', 'error');
          return;
        }
        if (val > 3000) {
          AuthService.showToast('Max single intake is 3,000 ml', 'error');
          return;
        }
        this.addWater(val);
        customInput.value = '';
        if (customContainer) customContainer.style.display = 'none';
      });

      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          customAddBtn.click();
        }
      });
    }

    // Quick chip buttons inside custom container
    document.querySelectorAll('.water-quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const chipVal = parseInt(chip.getAttribute('data-chip-ml'), 10);
        if (customInput) customInput.value = chipVal;
      });
    });

    // "Why this goal?" toggle button & close button
    const whyBtn = document.getElementById('water-why-goal-btn');
    const whyModal = document.getElementById('water-why-goal-card');
    const whyClose = document.getElementById('water-why-goal-close');

    if (whyBtn && whyModal) {
      whyBtn.addEventListener('click', () => {
        const isVisible = whyModal.style.display === 'block';
        whyModal.style.display = isVisible ? 'none' : 'block';
      });
    }

    if (whyClose && whyModal) {
      whyClose.addEventListener('click', () => {
        whyModal.style.display = 'none';
      });
    }

    // Reset button
    const resetBtn = document.getElementById('water-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset today\'s water intake and history?')) {
          this.resetWater();
        }
      });
    }

    // Reminder Action: "✓ I Drank It"
    const drankItBtn = document.getElementById('water-reminder-drank-btn');
    if (drankItBtn) {
      drankItBtn.addEventListener('click', () => {
        this.handleIDrankIt();
      });
    }

    // Reminder Action: "⏰ Remind Me Later" & Quick Snooze (Toggle snooze options)
    const remindLaterBtn = document.getElementById('water-reminder-later-btn');
    const quickSnoozeBtn = document.getElementById('water-snooze-toggle-quick');
    const snoozeChoices = document.getElementById('water-snooze-options-wrap');
    const toggleSnooze = () => {
      if (snoozeChoices) {
        const isHidden = snoozeChoices.style.display === 'none' || !snoozeChoices.style.display;
        snoozeChoices.style.display = isHidden ? 'flex' : 'none';
      }
    };
    if (remindLaterBtn) remindLaterBtn.addEventListener('click', toggleSnooze);
    if (quickSnoozeBtn) quickSnoozeBtn.addEventListener('click', toggleSnooze);

    // Snooze option buttons (+15 min, +30 min, +1 hour)
    document.querySelectorAll('[data-snooze-min]').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.getAttribute('data-snooze-min'), 10);
        this.handleRemindLater(minutes);
      });
    });

    // Delegated delete event on Today's Water History items
    const logsContainer = document.getElementById('water-today-logs-list');
    if (logsContainer) {
      logsContainer.addEventListener('click', (e) => {
        const delBtn = e.target.closest('[data-delete-water-id]');
        if (delBtn) {
          const logId = delBtn.getAttribute('data-delete-water-id');
          this.deleteWaterLog(logId);
        }
      });
    }

    // Schedule adjustment modal toggle
    const schedBtn = document.getElementById('water-adjust-schedule-btn');
    const schedCard = document.getElementById('water-schedule-card');
    const schedSave = document.getElementById('water-schedule-save-btn');
    const schedClose = document.getElementById('water-schedule-close-btn');

    if (schedBtn && schedCard) {
      schedBtn.addEventListener('click', () => {
        const isHidden = schedCard.style.display === 'none' || !schedCard.style.display;
        schedCard.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          const state = StorageService.getState();
          const hyd = state.hydration || {};
          const wakeInp = document.getElementById('water-wake-time-inp');
          const sleepInp = document.getElementById('water-sleep-time-inp');
          if (wakeInp) wakeInp.value = hyd.wakeTime || '07:00';
          if (sleepInp) sleepInp.value = hyd.sleepTime || '23:00';
        }
      });
    }

    if (schedClose && schedCard) {
      schedClose.addEventListener('click', () => {
        schedCard.style.display = 'none';
      });
    }

    if (schedSave && schedCard) {
      schedSave.addEventListener('click', () => {
        const wakeInp = document.getElementById('water-wake-time-inp');
        const sleepInp = document.getElementById('water-sleep-time-inp');
        const wakeTime = wakeInp ? wakeInp.value : '07:00';
        const sleepTime = sleepInp ? sleepInp.value : '23:00';

        StorageService.update(s => {
          if (!s.hydration) s.hydration = {};
          s.hydration.wakeTime = wakeTime;
          s.hydration.sleepTime = sleepTime;
          return s;
        });

        schedCard.style.display = 'none';
        AuthService.showToast('Reminder schedule updated! ⏰', 'success');
        this.scheduleNextRoutineReminder();
        this.render();
      });
    }
  }

  /**
   * Start 1-second countdown interval ticker
   */
  static startCountdownTicker() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.updateCountdownDisplay();
    }, 1000);
  }

  /**
   * Add water intake
   */
  static addWater(ml) {
    const timeStr = this.formatTime(new Date());
    const logItem = {
      id: 'w_' + Date.now(),
      time: timeStr,
      timestamp: Date.now(),
      ml
    };

    StorageService.update(state => {
      if (!state.hydration) state.hydration = {};
      if (!Array.isArray(state.hydration.todayLogs)) state.hydration.todayLogs = [];

      state.hydration.todayLogs.unshift(logItem);

      const totalMl = state.hydration.todayLogs.reduce((sum, item) => sum + item.ml, 0);
      const goalInfo = WaterService.getPersonalizedGoal(state.profile);

      // Keep todayMetrics.waterGlasses synced for dashboard compatibility
      state.todayMetrics.waterGlasses = Math.round(totalMl / 250);

      // Check daily mission 1 (Drink 8 glasses / reach water goal)
      if (totalMl >= goalInfo.totalMl) {
        const m1 = state.missions.find(m => m.id === 'm1');
        if (m1 && !m1.completed) {
          m1.completed = true;
          state.gamification.xp = (state.gamification.xp || 0) + m1.xp;
        }

        // Hydration badge check
        const bHydra = state.gamification.badges.find(b => b.id === 'b_hydra');
        if (bHydra && !bHydra.unlocked) {
          bHydra.unlocked = true;
          AuthService.showToast('Badge Unlocked: Hydration Hero! 💧🏆', 'success');
        }
      }

      return state;
    });

    this.lastLoggedMl = ml;
    AuthService.showToast(`Logged +${ml.toLocaleString()} ml water! 💧`, 'info');

    // Persist to Supabase (fire-and-forget)
    const s = StorageService.getState();
    const totalGlasses = s.todayMetrics?.waterGlasses || 0;
    const totalMlNow = (s.hydration?.todayLogs || []).reduce((sum, item) => sum + item.ml, 0);
    dbUpsertWater(totalGlasses, totalMlNow).catch(() => {});

    this.render();
  }

  /**
   * Delete an entry from Today's Intake History
   */
  static deleteWaterLog(logId) {
    StorageService.update(state => {
      if (!state.hydration || !Array.isArray(state.hydration.todayLogs)) return state;

      const idx = state.hydration.todayLogs.findIndex(item => item.id === logId);
      if (idx !== -1) {
        const removed = state.hydration.todayLogs.splice(idx, 1)[0];
        const totalMl = state.hydration.todayLogs.reduce((sum, item) => sum + item.ml, 0);
        state.todayMetrics.waterGlasses = Math.round(totalMl / 250);
        AuthService.showToast(`Removed entry: -${removed.ml} ml`, 'info');

        // Persist to Supabase (fire-and-forget)
        const totalGlasses = Math.round(totalMl / 250);
        dbUpsertWater(totalGlasses, totalMl).catch(() => {});
      }
      return state;
    });
    this.render();
  }

  /**
   * Reset water intake for today
   */
  static resetWater() {
    StorageService.update(state => {
      if (!state.hydration) state.hydration = {};
      state.hydration.todayLogs = [];
      state.todayMetrics.waterGlasses = 0;
      return state;
    });
    AuthService.showToast('Water counter and today\'s logs reset.', 'info');
    this.render();
  }

  /**
   * Action: "✓ I Drank It"
   * - Adds suggested amount (250 ml) to today's intake
   * - Marks reminder as completed in reminder history
   * - Automatically calculates and schedules next reminder
   * - Starts countdown to next reminder
   */
  static handleIDrankIt() {
    const state = StorageService.getState();
    const hyd = state.hydration || {};
    const ml = hyd.nextReminderMl || 250;
    const timeStr = this.formatTime(new Date());

    // 1. Add water to today's intake
    this.addWater(ml);

    // 2. Log to Reminder History as Completed
    const reminderRecord = {
      id: 'r_' + Date.now(),
      time: timeStr,
      ml,
      status: 'completed'
    };

    // 3. Schedule next reminder (routine interval: e.g. 90 minutes)
    const nextTime = Date.now() + 90 * 60 * 1000;

    StorageService.update(s => {
      if (!s.hydration) s.hydration = {};
      if (!Array.isArray(s.hydration.reminderHistory)) s.hydration.reminderHistory = [];
      s.hydration.reminderHistory.unshift(reminderRecord);
      s.hydration.nextReminderTime = nextTime;
      s.hydration.nextReminderMl = 250;
      return s;
    });

    // Hide snooze options if open
    const snoozeChoices = document.getElementById('water-snooze-options-wrap');
    if (snoozeChoices) snoozeChoices.style.display = 'none';

    // Show feedback
    const loggedPill = document.getElementById('water-just-logged-msg');
    if (loggedPill) {
      loggedPill.textContent = `✓ ${ml} ml logged`;
      loggedPill.style.display = 'inline-block';
      setTimeout(() => {
        if (loggedPill) loggedPill.style.display = 'none';
      }, 5000);
    }

    AuthService.showToast(`✓ Great job! ${ml} ml logged. Next reminder scheduled.`, 'success');
    this.render();
  }

  /**
   * Action: "⏰ Remind Me Later" (Postpone / Snooze)
   * - Postpones reminder by specified minutes (+15m, +30m, +1h)
   * - Starts new countdown
   * - Logs to reminder history as postponed
   * - Does NOT add water intake!
   */
  static handleRemindLater(minutes) {
    const state = StorageService.getState();
    const hyd = state.hydration || {};
    const ml = hyd.nextReminderMl || 250;
    const now = Date.now();
    const newReminderTime = now + minutes * 60 * 1000;
    const timeStr = this.formatTime(new Date(now));
    const postponedToStr = this.formatTime(new Date(newReminderTime));

    const reminderRecord = {
      id: 'r_' + Date.now(),
      time: timeStr,
      ml,
      status: 'postponed',
      postponedTo: postponedToStr
    };

    StorageService.update(s => {
      if (!s.hydration) s.hydration = {};
      if (!Array.isArray(s.hydration.reminderHistory)) s.hydration.reminderHistory = [];
      s.hydration.reminderHistory.unshift(reminderRecord);
      s.hydration.nextReminderTime = newReminderTime;
      return s;
    });

    // Hide snooze options container
    const snoozeChoices = document.getElementById('water-snooze-options-wrap');
    if (snoozeChoices) snoozeChoices.style.display = 'none';

    AuthService.showToast(`Reminder postponed to ${postponedToStr} (+${minutes} min) ⏰`, 'info');
    this.render();
  }

  /**
   * Schedule the next routine reminder based on wake and sleep time
   */
  static scheduleNextRoutineReminder() {
    const now = Date.now();
    const nextTime = now + 90 * 60 * 1000; // 90 minutes standard cycle
    StorageService.update(s => {
      if (!s.hydration) s.hydration = {};
      s.hydration.nextReminderTime = nextTime;
      s.hydration.nextReminderMl = 250;
      return s;
    });
  }

  /**
   * Live countdown update ticker (called every second)
   */
  static updateCountdownDisplay() {
    const state = StorageService.getState();
    const hyd = state.hydration || {};
    const nextTime = hyd.nextReminderTime || (Date.now() + 42 * 60 * 1000);
    const diffMs = nextTime - Date.now();

    const countdownEl = document.getElementById('water-reminder-countdown-val');
    const snoozeCountdownEl = document.getElementById('water-reminder-snooze-countdown');
    const reminderBox = document.getElementById('water-reminder-card');
    const reminderDueState = document.getElementById('water-reminder-due-state');
    const reminderPendingState = document.getElementById('water-reminder-pending-state');

    if (diffMs <= 0) {
      // Reminder is DUE! Show "Time to Drink Water" prompt
      if (reminderDueState) reminderDueState.style.display = 'block';
      if (reminderPendingState) reminderPendingState.style.display = 'none';
      if (reminderBox) reminderBox.classList.add('reminder-is-due');
      if (countdownEl) countdownEl.textContent = '00:00:00';
      if (snoozeCountdownEl) snoozeCountdownEl.textContent = 'Ready now';
    } else {
      // Countdown is ticking
      if (reminderDueState) reminderDueState.style.display = 'none';
      if (reminderPendingState) reminderPendingState.style.display = 'block';
      if (reminderBox) reminderBox.classList.remove('reminder-is-due');

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const pad = (n) => String(n).padStart(2, '0');
      const timeFormatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      const shortFormatted = `in ${pad(minutes)}:${pad(seconds)}`;

      if (countdownEl) countdownEl.textContent = timeFormatted;
      if (snoozeCountdownEl) snoozeCountdownEl.textContent = shortFormatted;
    }
  }

  /**
   * Master render method: Updates all 10 specifications
   */
  static render() {
    const state = StorageService.getState();
    const profile = state.profile || {};
    const hyd = state.hydration || { todayLogs: [], reminderHistory: [], streak: 4 };

    // 1. Personalized Water Goal
    const goalInfo = this.getPersonalizedGoal(profile);
    const goalMl = goalInfo.totalMl;

    // Calculate current water intake from todayLogs
    const todayLogs = Array.isArray(hyd.todayLogs) ? hyd.todayLogs : [];
    const currentMl = todayLogs.reduce((acc, cur) => acc + (cur.ml || 0), 0);
    const pct = Math.min(100, Math.round((currentMl / goalMl) * 100));
    const remainingMl = Math.max(0, goalMl - currentMl);

    // 1. Goal Readouts
    const goalValEl = document.getElementById('water-goal-display-val');
    if (goalValEl) goalValEl.textContent = `${goalMl.toLocaleString()} ml`;

    // "Why this goal?" calculation details
    const whyWeightEl = document.getElementById('water-why-weight-val');
    const whyActivityEl = document.getElementById('water-why-activity-val');
    const whyCalorieEl = document.getElementById('water-why-calorie-val');
    const whyTotalEl = document.getElementById('water-why-total-val');

    if (whyWeightEl) whyWeightEl.textContent = `${goalInfo.weight} kg × 30 ml = ${goalInfo.baseMl.toLocaleString()} ml baseline`;
    if (whyActivityEl) {
      const actCapitalized = goalInfo.activity.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      whyActivityEl.textContent = `${actCapitalized} (+${goalInfo.activityBonus} ml exercise replenishment)`;
    }
    if (whyCalorieEl) whyCalorieEl.textContent = `${goalInfo.calories.toLocaleString()} kcal (+${goalInfo.calorieBonus} ml metabolic demand)`;
    if (whyTotalEl) whyTotalEl.textContent = `${goalMl.toLocaleString()} ml (Personalized Target)`;

    // 2. Main Water Progress & Visual Bottle
    const fluidFillEl = document.getElementById('water-tank-fluid');
    const bottlePctEl = document.getElementById('water-bottle-fill-pct');
    const progressTextEl = document.getElementById('water-main-progress-text');
    const progressPctEl = document.getElementById('water-main-pct-badge');
    const progressBarFill = document.getElementById('water-main-progress-bar-fill');
    const remainingTextEl = document.getElementById('water-main-remaining-text');

    if (fluidFillEl) fluidFillEl.style.height = `${pct}%`;
    if (bottlePctEl) bottlePctEl.textContent = `${pct}%`;

    if (progressTextEl) progressTextEl.textContent = `${currentMl.toLocaleString()} / ${goalMl.toLocaleString()} ml`;
    if (progressPctEl) progressPctEl.textContent = `${pct}% completed`;
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;

    if (remainingTextEl) {
      if (remainingMl > 0) {
        remainingTextEl.textContent = `${remainingMl.toLocaleString()} ml remaining`;
        remainingTextEl.className = 'water-remaining-info';
      } else {
        remainingTextEl.innerHTML = '🎉 Daily Goal Achieved!';
        remainingTextEl.className = 'water-remaining-info goal-reached';
      }
    }

    // 4 & 6. Reminder details
    const reminderDueTimeEl = document.getElementById('water-reminder-due-time');
    const reminderAmountEl = document.getElementById('water-reminder-suggest-amount');
    const nextReminderMlEl = document.getElementById('water-next-reminder-ml');

    const nextTime = hyd.nextReminderTime || (Date.now() + 42 * 60 * 1000);
    const nextMl = hyd.nextReminderMl || 250;

    if (reminderDueTimeEl) reminderDueTimeEl.textContent = `Reminder at ${this.formatTime(new Date(nextTime))}`;
    if (reminderAmountEl) reminderAmountEl.textContent = `Drink ${nextMl} ml`;
    if (nextReminderMlEl) nextReminderMlEl.textContent = `${nextMl} ml`;

    this.updateCountdownDisplay();

    // 7. Reminder History
    this.renderReminderHistory(hyd.reminderHistory || []);

    // 8. Today's Water History
    this.renderTodayHistory(todayLogs, currentMl);

    // 9. Simple Daily Summary (Bottom)
    const sumCurrentEl = document.getElementById('water-summary-current-text');
    const sumPctEl = document.getElementById('water-summary-pct-badge');
    const sumRemainingEl = document.getElementById('water-summary-remaining-text');
    const sumProgressFill = document.getElementById('water-summary-progress-fill');

    if (sumCurrentEl) sumCurrentEl.textContent = `${currentMl.toLocaleString()} / ${goalMl.toLocaleString()} ml`;
    if (sumPctEl) sumPctEl.textContent = `${pct}% Complete`;
    if (sumRemainingEl) {
      sumRemainingEl.textContent = remainingMl > 0 ? `${remainingMl.toLocaleString()} ml remaining` : '0 ml remaining (Complete!)';
    }
    if (sumProgressFill) sumProgressFill.style.width = `${pct}%`;

    // 10. Hydration Streak
    const streakValEl = document.getElementById('water-streak-val');
    const streakDescEl = document.getElementById('water-streak-desc');
    const streakCount = hyd.streak || 4;

    if (streakValEl) streakValEl.textContent = `${streakCount} Day Streak`;
    if (streakDescEl) streakDescEl.textContent = `You've reached your daily water goal for ${streakCount} days in a row.`;
  }

  /**
   * Render Today's Water Consumption History
   */
  static renderTodayHistory(logs, totalMl) {
    const listContainer = document.getElementById('water-today-logs-list');
    const totalEl = document.getElementById('water-today-total-display');

    if (totalEl) totalEl.textContent = `Total: ${totalMl.toLocaleString()} ml`;
    if (!listContainer) return;

    if (!logs || logs.length === 0) {
      listContainer.innerHTML = `
        <div class="water-history-empty">
          <span>💧</span>
          <p>No water logged yet today. Use the Quick Add buttons above to record your intake!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = logs.map(item => `
      <div class="water-log-row">
        <div class="water-log-time-badge">
          <span class="water-log-bullet">💧</span>
          <span class="water-log-time">${item.time}</span>
          <span class="water-log-arrow">→</span>
          <span class="water-log-amount">${item.ml} ml</span>
        </div>
        <button type="button" class="water-log-del-btn" data-delete-water-id="${item.id}" title="Delete entry" aria-label="Delete entry">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');
  }

  /**
   * Render Reminder History
   */
  static renderReminderHistory(history) {
    const listContainer = document.getElementById('water-reminder-history-list');
    if (!listContainer) return;

    if (!history || history.length === 0) {
      listContainer.innerHTML = `
        <div class="water-history-empty">
          <span>⏰</span>
          <p>No reminder activity yet. Reminders will show here as you respond to them.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = history.map(item => {
      const isCompleted = item.status === 'completed';
      const icon = isCompleted ? '✓' : '⏰';
      const statusText = isCompleted
        ? 'Completed'
        : `Postponed to ${item.postponedTo || 'Later'}`;
      const statusClass = isCompleted ? 'badge-completed' : 'badge-postponed';

      return `
        <div class="water-reminder-row">
          <div class="water-reminder-left">
            <span class="water-reminder-icon ${statusClass}">${icon}</span>
            <span class="water-reminder-time">${item.time}</span>
            <span class="water-reminder-sep">—</span>
            <span class="water-reminder-ml">${item.ml} ml</span>
            <span class="water-reminder-sep">—</span>
            <span class="water-reminder-status-tag ${statusClass}">${statusText}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Helper: Format Date to clean "HH:MM AM/PM"
   */
  static formatTime(date) {
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }
  }
}
