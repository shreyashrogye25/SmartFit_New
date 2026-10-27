/* ==========================================================================
   SMARTFIT - Workout Controller
   Interactive Workout Studio, Gym/Home Toggle, Muscle Categories,
   Humanoid Illustrations, Live Workout Sessions, Rest Timers & Celebrations
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { WORKOUT_DATABASE, SVG_ILLUSTRATIONS } from './workout-data.js';
import { dbInsertWorkout } from './db.js';

export class WorkoutService {
  // Navigation & Filtering State
  static currentMode = 'gym'; // 'gym' | 'home'
  static currentMuscleGroup = 'all'; // 'all' | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'abs'
  static selectedExerciseForDetail = null;

  // Active Session State
  static sessionExercises = [];
  static currentExerciseIdx = 0;
  static currentSet = 1;
  static totalSetsForExercise = 3;

  // Timers
  static totalSessionSeconds = 0;
  static sessionTickerInterval = null;

  static setTimerSeconds = 45;
  static defaultSetTimerSeconds = 45;
  static isSetTimerRunning = false;
  static setTimerInterval = null;

  static restTimerSeconds = 60;
  static isResting = false;
  static isRestPaused = false;
  static restTimerInterval = null;

  // Session Accumulators
  static totalCompletedSets = 0;
  static totalRepsCompleted = 0;
  static estimatedCaloriesBurned = 0;

  static init() {
    this.bindEvents();
    this.render();

    // Re-render when storage state changes
    window.addEventListener('smartfit:state-changed', () => {
      this.updateBannerMetrics();
    });
  }

  static bindEvents() {
    // 1. Gym / Home Toggle Switch
    const modeToggle = document.getElementById('workout-mode-toggle');
    if (modeToggle) {
      modeToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-workout-mode]');
        if (btn) {
          const mode = btn.getAttribute('data-workout-mode');
          this.setWorkoutMode(mode);
        }
      });
    }

    // 2. Muscle Group Categories Navigation
    const categoriesBar = document.getElementById('workout-categories-bar');
    if (categoriesBar) {
      categoriesBar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-muscle-group]');
        if (btn) {
          const group = btn.getAttribute('data-muscle-group');
          this.setMuscleGroup(group);
        }
      });
    }

    // 5. Two Main Buttons (Action Bar)
    const browseBtn = document.getElementById('btn-browse-exercises');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        const container = document.getElementById('workout-cards-container');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const startSessionBtn = document.getElementById('btn-start-group-session');
    if (startSessionBtn) {
      startSessionBtn.addEventListener('click', () => {
        this.startCategorySession();
      });
    }

    // 3. Exercise Cards Delegation: View Details & Quick Start
    const cardsContainer = document.getElementById('workout-cards-container');
    if (cardsContainer) {
      cardsContainer.addEventListener('click', (e) => {
        const detailBtn = e.target.closest('[data-view-exercise-id]');
        if (detailBtn) {
          const id = detailBtn.getAttribute('data-view-exercise-id');
          this.openExerciseDetails(id);
          return;
        }

        const startBtn = e.target.closest('[data-quick-start-id]');
        if (startBtn) {
          const id = startBtn.getAttribute('data-quick-start-id');
          this.startSingleExerciseSession(id);
          return;
        }

        // Clicking the thumbnail or title also opens details
        const cardItem = e.target.closest('.exercise-card-item');
        if (cardItem && !e.target.closest('button')) {
          const id = cardItem.getAttribute('data-exercise-id');
          if (id) this.openExerciseDetails(id);
        }
      });
    }

    // 4. Exercise Detail Modal Controls
    const detailClose = document.getElementById('modal-exercise-detail-close');
    const detailCloseBtn = document.getElementById('btn-detail-close');
    if (detailClose) detailClose.addEventListener('click', () => this.closeExerciseDetails());
    if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => this.closeExerciseDetails());

    const detailStartBtn = document.getElementById('btn-detail-start-now');
    if (detailStartBtn) {
      detailStartBtn.addEventListener('click', () => {
        if (this.selectedExerciseForDetail) {
          const id = this.selectedExerciseForDetail.id;
          this.closeExerciseDetails();
          this.startSingleExerciseSession(id);
        }
      });
    }

    // 6, 7 & 8. Workout Session Modal Controls
    const sessionClose = document.getElementById('modal-session-close');
    if (sessionClose) {
      sessionClose.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit this active workout session?')) {
          this.terminateSessionEarly();
        }
      });
    }

    const timerToggleBtn = document.getElementById('btn-session-timer-toggle');
    if (timerToggleBtn) {
      timerToggleBtn.addEventListener('click', () => this.toggleSetTimer());
    }

    const timerResetBtn = document.getElementById('btn-session-timer-reset');
    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', () => this.resetSetTimer());
    }

    const completeSetBtn = document.getElementById('btn-session-complete-set');
    if (completeSetBtn) {
      completeSetBtn.addEventListener('click', () => this.completeCurrentSet());
    }

    // Rest Screen Controls
    const restPauseBtn = document.getElementById('btn-rest-pause');
    if (restPauseBtn) {
      restPauseBtn.addEventListener('click', () => this.toggleRestTimer());
    }

    const restPlusBtn = document.getElementById('btn-rest-plus-15');
    if (restPlusBtn) {
      restPlusBtn.addEventListener('click', () => {
        this.restTimerSeconds += 15;
        this.updateRestDisplay();
      });
    }

    const restMinusBtn = document.getElementById('btn-rest-minus-15');
    if (restMinusBtn) {
      restMinusBtn.addEventListener('click', () => {
        this.restTimerSeconds = Math.max(5, this.restTimerSeconds - 15);
        this.updateRestDisplay();
      });
    }

    const skipRestBtn = document.getElementById('btn-rest-skip');
    if (skipRestBtn) {
      skipRestBtn.addEventListener('click', () => this.advanceFromRest());
    }

    const skipExerciseBtn = document.getElementById('btn-session-skip-exercise');
    if (skipExerciseBtn) {
      skipExerciseBtn.addEventListener('click', () => this.skipCurrentExercise());
    }

    const finishEarlyBtn = document.getElementById('btn-session-finish-early');
    if (finishEarlyBtn) {
      finishEarlyBtn.addEventListener('click', () => {
        if (confirm('Finish and log your workout progress so far?')) {
          this.finishWorkout();
        }
      });
    }

    // 9. Workout Completion Celebration Controls
    const completeBackBtn = document.getElementById('btn-complete-back-workouts');
    if (completeBackBtn) {
      completeBackBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-workout-complete');
        if (modal) modal.classList.remove('active');
      });
    }

    const completeAnotherBtn = document.getElementById('btn-complete-another-workout');
    if (completeAnotherBtn) {
      completeAnotherBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-workout-complete');
        if (modal) modal.classList.remove('active');
        this.startCategorySession();
      });
    }
  }

  // =========================================================================
  // FILTERING & RENDERING
  // =========================================================================

  static setWorkoutMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;

    // Update active button state
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
      if (btn.getAttribute('data-workout-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.render();
  }

  static setMuscleGroup(group) {
    this.currentMuscleGroup = group;

    // Update active pill state
    document.querySelectorAll('.category-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-muscle-group') === group) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.render();
  }

  static getFilteredExercises() {
    return WORKOUT_DATABASE.filter(ex => {
      const matchMode = ex.type === this.currentMode;
      const matchGroup = this.currentMuscleGroup === 'all' || ex.muscleGroup === this.currentMuscleGroup;
      return matchMode && matchGroup;
    });
  }

  static render() {
    this.updateCategoryCounts();
    this.updateBannerMetrics();

    const exercises = this.getFilteredExercises();
    const container = document.getElementById('workout-cards-container');
    const titleEl = document.getElementById('workout-action-title');
    const subTitleEl = document.getElementById('workout-action-subtitle');

    const groupLabel = this.currentMuscleGroup === 'all' 
      ? 'All Muscle Groups' 
      : this.currentMuscleGroup.charAt(0).toUpperCase() + this.currentMuscleGroup.slice(1);

    const modeLabel = this.currentMode === 'gym' ? 'Gym Workout' : 'Home Workout';

    if (titleEl) {
      titleEl.textContent = `${groupLabel} • ${modeLabel}`;
    }
    if (subTitleEl) {
      subTitleEl.textContent = `Showing ${exercises.length} exercise variations ready for interactive training.`;
    }

    if (!container) return;

    if (exercises.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFF; border-radius: var(--radius-md); border: 1px dashed var(--border-hairline);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🏋️</div>
          <h4 style="color: var(--text-heading);">No exercises found for this filter</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Try selecting 'All' or switching between Gym / Home modes.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    exercises.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card-item';
      card.setAttribute('data-exercise-id', ex.id);

      const svgIllustration = SVG_ILLUSTRATIONS[ex.illustrationKey] || `
        <div style="font-size: 3rem;">🏋️</div>
      `;

      const diffClass = ex.difficulty === 'Beginner' ? 'tag-beginner' : ex.difficulty === 'Advanced' ? 'tag-advanced' : 'tag-intermediate';

      card.innerHTML = `
        <div class="exercise-thumb-box">
          <span class="exercise-type-tag">${ex.type}</span>
          <span class="exercise-diff-tag ${diffClass}">${ex.difficulty}</span>
          ${svgIllustration}
        </div>
        <div class="exercise-card-body">
          <div class="exercise-card-title">${ex.name}</div>
          <div class="exercise-target-badge">
            <span>🎯</span>
            <span>${ex.primaryMuscle}</span>
          </div>
          <div class="exercise-equipment-row">
            <span>🔧</span>
            <span>${ex.equipment}</span>
          </div>
          <div class="exercise-desc-clamp">
            ${ex.description}
          </div>
          <div class="exercise-metrics-pill-row">
            <span class="metric-pill">🔢 ${ex.sets} Sets × ${ex.reps}</span>
            <span class="metric-pill">⏱ ${ex.recommendedTime}</span>
            <span class="metric-pill">💤 Rest: ${ex.restSeconds}s</span>
          </div>
        </div>
        <div class="exercise-card-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-view-exercise-id="${ex.id}">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm" data-quick-start-id="${ex.id}">
            ▶ Start
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  static updateCategoryCounts() {
    const groups = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];
    groups.forEach(g => {
      const countEl = document.getElementById(`count-${g}`);
      if (countEl) {
        const count = WORKOUT_DATABASE.filter(ex => {
          const matchMode = ex.type === this.currentMode;
          const matchGroup = g === 'all' || ex.muscleGroup === g;
          return matchMode && matchGroup;
        }).length;
        countEl.textContent = count;
      }
    });
  }

  static updateBannerMetrics() {
    const state = StorageService.getState();
    const totalBurned = state.todayMetrics?.caloriesBurned || 0;
    const completedCount = state.todayMetrics?.exercisesCompleted || 0;

    const bannerBurned = document.getElementById('workout-banner-burned');
    const bannerCount = document.getElementById('workout-banner-completed');

    if (bannerBurned) bannerBurned.textContent = totalBurned;
    if (bannerCount) bannerCount.textContent = completedCount;
  }

  // =========================================================================
  // 4. EXERCISE DETAILS MODAL
  // =========================================================================

  static openExerciseDetails(exerciseId) {
    const exercise = WORKOUT_DATABASE.find(e => e.id === exerciseId);
    if (!exercise) return;

    this.selectedExerciseForDetail = exercise;

    const modal = document.getElementById('modal-exercise-detail');
    const nameEl = document.getElementById('detail-exercise-name');
    const diffEl = document.getElementById('detail-exercise-diff');
    const thumbWrap = document.getElementById('detail-illustration-wrap');
    const targetPill = document.getElementById('detail-target-pill');
    const descEl = document.getElementById('detail-desc');
    const equipEl = document.getElementById('detail-equipment');
    const setsRepsEl = document.getElementById('detail-sets-reps');
    const timeEl = document.getElementById('detail-time');
    const restEl = document.getElementById('detail-rest');
    const instructionsList = document.getElementById('detail-instructions-list');

    if (nameEl) nameEl.textContent = exercise.name;
    if (diffEl) {
      diffEl.textContent = exercise.difficulty;
      diffEl.className = `exercise-diff-tag ${exercise.difficulty === 'Beginner' ? 'tag-beginner' : exercise.difficulty === 'Advanced' ? 'tag-advanced' : 'tag-intermediate'}`;
    }

    if (thumbWrap) {
      thumbWrap.innerHTML = SVG_ILLUSTRATIONS[exercise.illustrationKey] || '';
    }

    if (targetPill) {
      targetPill.textContent = `Primary Target: ${exercise.primaryMuscle}`;
    }

    if (descEl) {
      descEl.textContent = exercise.description;
    }

    if (equipEl) equipEl.textContent = exercise.equipment;
    if (setsRepsEl) setsRepsEl.textContent = `${exercise.sets} Sets × ${exercise.reps}`;
    if (timeEl) timeEl.textContent = `⏱ ${exercise.recommendedTime}`;
    if (restEl) restEl.textContent = `Rest: ${exercise.restSeconds} sec`;

    if (instructionsList) {
      instructionsList.innerHTML = '';
      (exercise.instructions || []).forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        instructionsList.appendChild(li);
      });
    }

    if (modal) modal.classList.add('active');
  }

  static closeExerciseDetails() {
    const modal = document.getElementById('modal-exercise-detail');
    if (modal) modal.classList.remove('active');
  }

  // =========================================================================
  // 6, 7, 8. LIVE WORKOUT SESSION ENGINE
  // =========================================================================

  static startCategorySession() {
    const exercises = this.getFilteredExercises();
    if (exercises.length === 0) {
      AuthService.showToast('No exercises available to start for this filter.', 'error');
      return;
    }
    const groupName = this.currentMuscleGroup === 'all' ? 'FULL BODY' : this.currentMuscleGroup.toUpperCase();
    const modeName = this.currentMode.toUpperCase();
    this.launchSession(exercises, `${groupName} WORKOUT • ${modeName}`);
  }

  static startSingleExerciseSession(exerciseId) {
    const exercise = WORKOUT_DATABASE.find(e => e.id === exerciseId);
    if (!exercise) return;
    this.launchSession([exercise], `${exercise.name.toUpperCase()} • ${exercise.type.toUpperCase()}`);
  }

  static launchSession(exercises, routineTitle) {
    this.sessionExercises = exercises;
    this.currentExerciseIdx = 0;
    this.totalCompletedSets = 0;
    this.totalRepsCompleted = 0;
    this.estimatedCaloriesBurned = 0;

    // Reset session timer
    this.totalSessionSeconds = 0;
    if (this.sessionTickerInterval) clearInterval(this.sessionTickerInterval);
    this.sessionTickerInterval = setInterval(() => {
      this.totalSessionSeconds++;
    }, 1000);

    const badgeEl = document.getElementById('session-routine-badge');
    if (badgeEl) badgeEl.textContent = routineTitle;

    const modal = document.getElementById('modal-workout-session');
    if (modal) modal.classList.add('active');

    this.loadExerciseIntoSession(0);
  }

  static loadExerciseIntoSession(index) {
    if (index >= this.sessionExercises.length) {
      this.finishWorkout();
      return;
    }

    this.currentExerciseIdx = index;
    const exercise = this.sessionExercises[index];
    this.currentSet = 1;
    this.totalSetsForExercise = exercise.sets || 3;

    // Parse recommended seconds or default to 45
    let targetSecs = 45;
    if (exercise.recommendedTime) {
      const match = exercise.recommendedTime.match(/(\d+)/);
      if (match) targetSecs = parseInt(match[1], 10);
    }
    this.defaultSetTimerSeconds = targetSecs;
    this.setTimerSeconds = targetSecs;
    this.isSetTimerRunning = false;

    // Update Progress Bar
    const totalExercises = this.sessionExercises.length;
    const progressPct = Math.round(((index) / totalExercises) * 100);
    const counterEl = document.getElementById('session-exercise-counter');
    const progText = document.getElementById('session-progress-text');
    const progPct = document.getElementById('session-progress-pct');
    const progFill = document.getElementById('session-progress-fill');

    if (counterEl) counterEl.textContent = `Exercise ${index + 1} of ${totalExercises}`;
    if (progText) progText.textContent = `Exercise ${index + 1} / ${totalExercises}`;
    if (progPct) progPct.textContent = `${progressPct}%`;
    if (progFill) progFill.style.width = `${progressPct}%`;

    // Populate Exercise Card
    const nameEl = document.getElementById('session-curr-name');
    const targetEl = document.getElementById('session-curr-target');
    const illBox = document.getElementById('session-curr-illustration');
    const targetDisp = document.getElementById('session-sets-target-display');

    if (nameEl) nameEl.textContent = exercise.name;
    if (targetEl) targetEl.textContent = `Target: ${exercise.primaryMuscle} • ${exercise.equipment}`;
    if (illBox) illBox.innerHTML = SVG_ILLUSTRATIONS[exercise.illustrationKey] || '';
    if (targetDisp) targetDisp.textContent = `${exercise.sets} Sets × ${exercise.reps}`;

    // Render Set Indicator Bubbles
    this.renderSetBubbles();

    // Reset UI to Work view
    this.hideRestOverlay();
    this.updateSetTimerDisplay();
  }

  static renderSetBubbles() {
    const container = document.getElementById('session-sets-bubbles');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 1; i <= this.totalSetsForExercise; i++) {
      const bubble = document.createElement('span');
      bubble.className = 'set-bubble';
      if (i < this.currentSet) {
        bubble.classList.add('completed');
        bubble.textContent = `✓ Set ${i}`;
      } else if (i === this.currentSet) {
        bubble.classList.add('active');
        bubble.textContent = `Set ${i} (Active)`;
      } else {
        bubble.textContent = `Set ${i}`;
      }
      container.appendChild(bubble);
    }
  }

  static updateSetTimerDisplay() {
    const timerVal = document.getElementById('session-timer-val');
    const toggleBtn = document.getElementById('btn-session-timer-toggle');

    if (timerVal) {
      const mins = String(Math.floor(this.setTimerSeconds / 60)).padStart(2, '0');
      const secs = String(this.setTimerSeconds % 60).padStart(2, '0');
      timerVal.textContent = `${mins}:${secs}`;
    }

    if (toggleBtn) {
      toggleBtn.textContent = this.isSetTimerRunning ? '⏸ Pause' : '▶ Start Set';
    }
  }

  static toggleSetTimer() {
    if (this.isSetTimerRunning) {
      clearInterval(this.setTimerInterval);
      this.isSetTimerRunning = false;
      this.updateSetTimerDisplay();
    } else {
      this.isSetTimerRunning = true;
      this.updateSetTimerDisplay();
      this.setTimerInterval = setInterval(() => {
        if (this.setTimerSeconds > 0) {
          this.setTimerSeconds--;
          this.updateSetTimerDisplay();
        } else {
          // Timer finished set
          clearInterval(this.setTimerInterval);
          this.isSetTimerRunning = false;
          this.playBeep(440, 0.2);
          this.updateSetTimerDisplay();
        }
      }, 1000);
    }
  }

  static resetSetTimer() {
    if (this.setTimerInterval) clearInterval(this.setTimerInterval);
    this.isSetTimerRunning = false;
    this.setTimerSeconds = this.defaultSetTimerSeconds;
    this.updateSetTimerDisplay();
  }

  static completeCurrentSet() {
    if (this.setTimerInterval) clearInterval(this.setTimerInterval);
    this.isSetTimerRunning = false;

    const currExercise = this.sessionExercises[this.currentExerciseIdx];
    this.totalCompletedSets++;
    this.totalRepsCompleted += 10;
    this.estimatedCaloriesBurned += Math.round((currExercise.calories || 70) / (currExercise.sets || 3));

    // Play subtle achievement sound
    this.playBeep(587, 0.15);

    // Check if this was the last set of the exercise
    const isLastSet = this.currentSet >= this.totalSetsForExercise;
    const isLastExercise = this.currentExerciseIdx >= this.sessionExercises.length - 1;

    if (isLastSet && isLastExercise) {
      // Workout is finished!
      this.finishWorkout();
      return;
    }

    // Launch Rest Timer screen
    this.triggerRestTimer(currExercise.restSeconds || 60, isLastSet);
  }

  // =========================================================================
  // 7. REST TIMER SCREEN
  // =========================================================================

  static triggerRestTimer(seconds, willTransitionExercise) {
    this.isResting = true;
    this.isRestPaused = false;
    this.restTimerSeconds = seconds;

    const workView = document.getElementById('session-set-work-view');
    const restView = document.getElementById('session-rest-view');
    const nextPreview = document.getElementById('rest-next-preview');

    if (workView) workView.style.display = 'none';
    if (restView) restView.style.display = 'flex';

    if (nextPreview) {
      if (willTransitionExercise) {
        const nextEx = this.sessionExercises[this.currentExerciseIdx + 1];
        nextPreview.textContent = `Next Exercise: ${nextEx?.name || 'Complete'}`;
      } else {
        const currEx = this.sessionExercises[this.currentExerciseIdx];
        nextPreview.textContent = `Next: Set ${this.currentSet + 1} of ${this.totalSetsForExercise} • ${currEx.name}`;
      }
    }

    this.updateRestDisplay();

    if (this.restTimerInterval) clearInterval(this.restTimerInterval);
    this.restTimerInterval = setInterval(() => {
      if (!this.isRestPaused) {
        if (this.restTimerSeconds > 0) {
          this.restTimerSeconds--;
          this.updateRestDisplay();
        } else {
          // Rest timer reached 0: advance to next set
          clearInterval(this.restTimerInterval);
          this.playBeep(880, 0.3);
          this.advanceFromRest();
        }
      }
    }, 1000);
  }

  static updateRestDisplay() {
    const timerEl = document.getElementById('session-rest-timer-val');
    const pauseBtn = document.getElementById('btn-rest-pause');

    if (timerEl) {
      const mins = String(Math.floor(this.restTimerSeconds / 60)).padStart(2, '0');
      const secs = String(this.restTimerSeconds % 60).padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }

    if (pauseBtn) {
      pauseBtn.textContent = this.isRestPaused ? 'Resume' : 'Pause';
    }
  }

  static toggleRestTimer() {
    this.isRestPaused = !this.isRestPaused;
    this.updateRestDisplay();
  }

  static advanceFromRest() {
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);
    this.isResting = false;
    this.hideRestOverlay();

    if (this.currentSet >= this.totalSetsForExercise) {
      // Advance to next exercise
      this.loadExerciseIntoSession(this.currentExerciseIdx + 1);
    } else {
      // Advance to next set of same exercise
      this.currentSet++;
      this.renderSetBubbles();
      this.resetSetTimer();
    }
  }

  static hideRestOverlay() {
    const workView = document.getElementById('session-set-work-view');
    const restView = document.getElementById('session-rest-view');

    if (workView) workView.style.display = 'flex';
    if (restView) restView.style.display = 'none';
  }

  static skipCurrentExercise() {
    if (this.setTimerInterval) clearInterval(this.setTimerInterval);
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);
    this.isSetTimerRunning = false;
    this.isResting = false;

    if (this.currentExerciseIdx < this.sessionExercises.length - 1) {
      this.loadExerciseIntoSession(this.currentExerciseIdx + 1);
      AuthService.showToast('Skipped to next exercise', 'info');
    } else {
      this.finishWorkout();
    }
  }

  static terminateSessionEarly() {
    if (this.sessionTickerInterval) clearInterval(this.sessionTickerInterval);
    if (this.setTimerInterval) clearInterval(this.setTimerInterval);
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);

    const modal = document.getElementById('modal-workout-session');
    if (modal) modal.classList.remove('active');
  }

  // =========================================================================
  // 9. WORKOUT COMPLETION CELEBRATION
  // =========================================================================

  static finishWorkout() {
    if (this.sessionTickerInterval) clearInterval(this.sessionTickerInterval);
    if (this.setTimerInterval) clearInterval(this.setTimerInterval);
    if (this.restTimerInterval) clearInterval(this.restTimerInterval);

    const sessionDurationMins = Math.max(1, Math.round(this.totalSessionSeconds / 60));
    const finalCalories = Math.max(25, this.estimatedCaloriesBurned);
    const exercisesDone = Math.min(this.sessionExercises.length, this.currentExerciseIdx + 1);
    const earnedXp = 40 + (exercisesDone * 10);

    const groupTitle = this.currentMuscleGroup === 'all' ? 'Full Body' : this.currentMuscleGroup.charAt(0).toUpperCase() + this.currentMuscleGroup.slice(1);
    const modeTitle = this.currentMode === 'gym' ? 'Gym' : 'Home';

    const workoutEntry = {
      id: 'wk_' + Date.now(),
      name: `${groupTitle} Workout (${modeTitle})`,
      category: this.currentMuscleGroup,
      duration: sessionDurationMins,
      caloriesBurned: finalCalories,
      sets: Math.max(1, this.totalCompletedSets),
      reps: Math.max(10, this.totalRepsCompleted),
      date: new Date().toISOString().slice(0, 10)
    };

    // Persist to StorageService
    StorageService.update(state => {
      state.todayMetrics.caloriesBurned = (state.todayMetrics.caloriesBurned || 0) + finalCalories;
      state.todayMetrics.exercisesCompleted = (state.todayMetrics.exercisesCompleted || 0) + 1;

      if (!Array.isArray(state.workouts)) state.workouts = [];
      state.workouts.unshift(workoutEntry);

      // Update today's weekly activity
      const todayCol = state.weeklyActivity.find(d => d.isToday);
      if (todayCol) todayCol.calories += finalCalories;

      // Complete daily mission 2 if present
      const m2 = state.missions.find(m => m.id === 'm2');
      if (m2 && !m2.completed) {
        m2.completed = true;
        state.gamification.xp += m2.xp;
      }

      // Add gamification XP
      state.gamification.xp = (state.gamification.xp || 0) + earnedXp;

      return state;
    });

    // Close session modal
    const sessionModal = document.getElementById('modal-workout-session');
    if (sessionModal) sessionModal.classList.remove('active');

    // Populate and open Workout Complete Modal
    const completeModal = document.getElementById('modal-workout-complete');
    const subSummary = document.getElementById('complete-sub-summary');
    const durEl = document.getElementById('stat-complete-duration');
    const exCountEl = document.getElementById('stat-complete-exercises');
    const setsEl = document.getElementById('stat-complete-sets');
    const repsEl = document.getElementById('stat-complete-reps');
    const calsEl = document.getElementById('stat-complete-cals');
    const xpEl = document.getElementById('stat-complete-xp');

    const minsStr = String(Math.floor(this.totalSessionSeconds / 60)).padStart(2, '0');
    const secsStr = String(this.totalSessionSeconds % 60).padStart(2, '0');

    if (durEl) durEl.textContent = `${minsStr}:${secsStr}`;
    if (exCountEl) exCountEl.textContent = `${exercisesDone} / ${this.sessionExercises.length}`;
    if (setsEl) setsEl.textContent = String(Math.max(1, this.totalCompletedSets));
    if (repsEl) repsEl.textContent = String(Math.max(10, this.totalRepsCompleted));
    if (calsEl) calsEl.textContent = `${finalCalories} kcal`;
    if (xpEl) xpEl.textContent = `+${earnedXp} XP`;

    if (subSummary) subSummary.textContent = `${groupTitle} Workout (${modeTitle}) finished with excellent intensity!`;

    if (completeModal) completeModal.classList.add('active');

    // Persist workout to Supabase (fire-and-forget)
    dbInsertWorkout(workoutEntry).catch(() => {});

    AuthService.showToast(`Workout Complete! Burned ${finalCalories} kcal 🔥 (+${earnedXp} XP)`, 'success');
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================

  static playBeep(freq = 440, duration = 0.2) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }
}
