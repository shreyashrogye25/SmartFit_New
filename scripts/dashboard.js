/* ==========================================================================
   SMARTFIT - Dashboard Service
   Personalized Suggested Daily Plan, Missions Sync, Circular Daily Completion Gauge,
   and Daily Plan Adherence Activity Chart
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { dbUpsertWater } from './db.js';

export class DashboardService {
  static init() {
    this.syncMissionsWithPlan();
    this.render();
    this.bindEvents();

    // Listen to global state changes
    window.addEventListener('smartfit:state-changed', () => {
      this.syncMissionsWithPlan();
      this.render();
    });
  }

  static bindEvents() {
    // Quick Add Glass button on water metric card
    const addGlassBtn = document.getElementById('dash-btn-add-glass');
    if (addGlassBtn) {
      addGlassBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.incrementWater();
      });
    }

    // Daily Mission checkboxes
    const missionContainer = document.getElementById('dash-mission-list');
    if (missionContainer) {
      missionContainer.addEventListener('change', (e) => {
        if (e.target.matches('.mission-checkbox')) {
          const missionId = e.target.getAttribute('data-mission-id');
          this.toggleMission(missionId, e.target.checked);
        }
      });
    }

    // Chart timeframe dropdown
    const chartFilter = document.getElementById('dash-chart-filter');
    if (chartFilter) {
      chartFilter.addEventListener('change', () => {
        this.renderWeeklyChart();
      });
    }

    // Smart recommendation button
    const recBtn = document.getElementById('dash-rec-action-btn');
    if (recBtn) {
      recBtn.addEventListener('click', () => {
        this.handleRecommendationAction();
      });
    }
  }

  /**
   * Syncs state.missions with real user actions and targets
   */
  static syncMissionsWithPlan() {
    StorageService.update(state => {
      const profile = state.profile || {};
      const today = state.todayMetrics || {};

      const targetCalories = profile.dailyCalorieTarget || 2000;
      const burnTarget = this.calculateBurnTarget(profile);
      const waterMl = profile.weight ? Math.round(profile.weight * 35) : (profile.dailyWaterTarget ? profile.dailyWaterTarget * 250 : 2500);
      const targetGlasses = Math.max(6, Math.round(waterMl / 250));

      const existingMissions = state.missions || [];
      const wasCompleted = (id) => existingMissions.find(m => m.id === id)?.completed || false;

      // 1. Water mission: Drink X glasses of water (connected to real water logged)
      const isWaterDone = ((today.waterGlasses || 0) >= targetGlasses) ||
        ((state.hydration?.todayLogs?.reduce((sum, l) => sum + (l.ml || 0), 0) || 0) >= waterMl);

      // 2. Workout mission: Complete 30-min workout training session (connected to real workout completed)
      const isWorkoutDone = (today.exercisesCompleted || 0) >= 1;

      // 3. Calories burned: Burn X kcal through workout & active movement (connected to real burn recorded)
      const isBurnDone = (today.caloriesBurned || 0) >= burnTarget && burnTarget > 0;

      // 4. Calories consumed: Meet daily caloric intake target (connected to real food intake logged)
      const isCalDone = (today.caloriesConsumed || 0) >= targetCalories && targetCalories > 0;

      const planMissions = [
        {
          id: 'm_water',
          title: `Drink ${targetGlasses} glasses of water (${waterMl.toLocaleString()} ml)`,
          completed: isWaterDone,
          xp: 20
        },
        {
          id: 'm_workout',
          title: 'Complete 30-min workout training session',
          completed: isWorkoutDone,
          xp: 25
        },
        {
          id: 'm_burn',
          title: `Burn ${burnTarget} kcal through workout & active movement`,
          completed: isBurnDone,
          xp: 25
        },
        {
          id: 'm_cal',
          title: `Meet daily caloric intake target (${targetCalories.toLocaleString()} kcal)`,
          completed: isCalDone,
          xp: 20
        }
      ];

      // Update XP if gamification is active and a mission just completed
      state.gamification = state.gamification || { xp: 0, level: 1 };
      planMissions.forEach(m => {
        if (m.completed && !wasCompleted(m.id)) {
          state.gamification.xp = (state.gamification.xp || 0) + m.xp;
        }
      });

      state.missions = planMissions;
      return state;
    });
  }

  static calculateBurnTarget(profile) {
    if (profile.goal === 'lose_weight') return 500;
    if (profile.goal === 'build_muscle') return 400;
    if (profile.goal === 'stamina') return 450;
    if (profile.activityLevel === 'very_active' || profile.activityLevel === 'extra_active') return 500;
    return 400;
  }

  static render() {
    const state = StorageService.getState();
    const profile = state.profile || {};
    const today = state.todayMetrics || {};

    // 1. Header User Profile Initials & Name
    const headerProfileName = document.getElementById('dash-header-user-name');
    const headerAvatar = document.getElementById('dash-header-avatar');

    const displayName = profile.name || state.auth.user?.name || 'User';
    if (headerProfileName) headerProfileName.textContent = displayName;
    if (headerAvatar) {
      const avatarUrl = state.auth.user?.avatar;
      const initials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'SF';
      if (avatarUrl) {
        headerAvatar.innerHTML = `<img src="${avatarUrl}" alt="${displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;" onerror="this.onerror=null;this.parentElement.textContent='${initials}'">`;
      } else {
        headerAvatar.textContent = initials;
      }
    }

    // 2. BMI Calculation & Metric Card
    const targetCalories = profile.dailyCalorieTarget || 2000;
    const burnTarget = this.calculateBurnTarget(profile);
    const waterMl = profile.weight ? Math.round(profile.weight * 35) : (profile.dailyWaterTarget ? profile.dailyWaterTarget * 250 : 2500);
    const targetGlasses = Math.max(6, Math.round(waterMl / 250));

    const heightM = (profile.height || 175) / 100;
    const weightKg = profile.weight || 70;
    const bmiVal = (weightKg / (heightM * heightM)).toFixed(1);

    const bmiValEl = document.getElementById('dash-bmi-val');
    const bmiBadgeEl = document.getElementById('dash-bmi-badge');
    const bmiProgressEl = document.getElementById('dash-bmi-progress');

    if (bmiValEl) bmiValEl.textContent = bmiVal;

    let bmiStatus = 'Normal';
    let bmiClass = 'badge-normal';
    if (bmiVal < 18.5) {
      bmiStatus = 'Underweight';
      bmiClass = 'badge-info';
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      bmiStatus = 'Normal';
      bmiClass = 'badge-normal';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      bmiStatus = 'Overweight';
      bmiClass = 'badge-warning';
    } else {
      bmiStatus = 'Obese';
      bmiClass = 'badge-rose';
    }

    if (bmiBadgeEl) {
      bmiBadgeEl.className = `status-badge ${bmiClass}`;
      bmiBadgeEl.innerHTML = `<span class="dot"></span> ${bmiStatus}`;
    }
    if (bmiProgressEl) {
      const pct = Math.min(100, Math.max(0, ((bmiVal - 15) / 20) * 100));
      bmiProgressEl.style.width = `${pct}%`;
    }

    // 3. Calories Metric Card
    const consumed = today.caloriesConsumed || 0;
    const remaining = Math.max(0, targetCalories - consumed);
    const calPct = Math.min(100, Math.round((consumed / targetCalories) * 100));

    const calConsumedEl = document.getElementById('dash-cal-consumed');
    const calTargetEl = document.getElementById('dash-cal-target');
    const calPctBadge = document.getElementById('dash-cal-pct-badge');
    const calProgress = document.getElementById('dash-cal-progress');
    const calRemainingEl = document.getElementById('dash-cal-remaining');

    if (calConsumedEl) calConsumedEl.textContent = consumed.toLocaleString();
    if (calTargetEl) calTargetEl.textContent = targetCalories.toLocaleString();
    if (calPctBadge) calPctBadge.textContent = `${calPct}%`;
    if (calProgress) calProgress.style.width = `${calPct}%`;
    if (calRemainingEl) calRemainingEl.textContent = `${remaining.toLocaleString()} kcal remaining`;

    // 4. Water Intake Metric Card
    const currentGlasses = today.waterGlasses || 0;
    const waterPct = Math.min(100, Math.round((currentGlasses / targetGlasses) * 100));

    const waterGlassesEl = document.getElementById('dash-water-glasses');
    const waterTargetEl = document.getElementById('dash-water-target');
    const waterPctBadge = document.getElementById('dash-water-pct-badge');
    const waterProgress = document.getElementById('dash-water-progress');

    if (waterGlassesEl) waterGlassesEl.textContent = currentGlasses;
    if (waterTargetEl) waterTargetEl.textContent = targetGlasses;
    if (waterPctBadge) waterPctBadge.textContent = `${waterPct}%`;
    if (waterProgress) waterProgress.style.width = `${waterPct}%`;

    // 5. Workout Metric Card
    const burned = today.caloriesBurned || 0;
    const exercisesCount = today.exercisesCompleted || 0;

    const workoutBurnedEl = document.getElementById('dash-workout-burned');
    const workoutCountEl = document.getElementById('dash-workout-count');

    if (workoutBurnedEl) workoutBurnedEl.textContent = burned;
    if (workoutCountEl) workoutCountEl.textContent = `${exercisesCount} exercises completed`;

    // 6. Calculate Daily Plan Progress % (Linked directly to real actions & completed missions)
    const missions = state.missions || [];
    const completedMissions = missions.filter(m => m.completed).length;
    const missionPct = missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0;

    const burnPct = Math.min(100, Math.round((burned / burnTarget) * 100));
    const workoutPct = exercisesCount >= 1 ? 100 : 0;
    const metricsAvgPct = Math.round((waterPct + burnPct + calPct + workoutPct) / 4);

    const dailyPlanPct = Math.max(missionPct, metricsAvgPct);

    // 7. Render Circular Daily Plan Completion Gauge
    this.renderDailyPlanGauge(dailyPlanPct, waterPct, burnPct, calPct);

    // 8. Render Weekly Plan Adherence Bar Chart
    this.renderWeeklyChart(dailyPlanPct);

    // 9. Smart Recommendation Engine
    this.renderSmartRecommendation(currentGlasses, targetGlasses, consumed, targetCalories, burned, burnTarget);

    // 10. Today's Challenges (Missions) with Progress Bar
    this.renderMissions(missions);
  }

  static renderDailyPlanGauge(dailyPlanPct, waterPct, burnPct, calPct) {
    const scoreNumEl = document.getElementById('dash-health-score-val');
    const gaugeCircle = document.getElementById('dash-gauge-progress-circle');
    const statusPill = document.getElementById('dash-score-status-pill');
    const guidanceText = document.getElementById('dash-score-guidance');

    if (scoreNumEl) scoreNumEl.textContent = `${dailyPlanPct}%`;

    if (gaugeCircle) {
      const radius = 60;
      const circumference = 2 * Math.PI * radius; // ~376.99
      const offset = circumference - (dailyPlanPct / 100) * circumference;
      gaugeCircle.style.strokeDashoffset = offset;
    }

    if (statusPill && guidanceText) {
      if (dailyPlanPct >= 100) {
        statusPill.innerHTML = '<span class="score-status-dot" style="background:#10B981"></span> Plan Completed! 🎉';
        guidanceText.textContent = 'Phenomenal dedication! All daily plan targets achieved for today.';
      } else if (dailyPlanPct >= 75) {
        statusPill.innerHTML = '<span class="score-status-dot" style="background:#2563EB"></span> Almost There!';
        guidanceText.textContent = 'Great momentum! Complete your final mission to reach 100% adherence.';
      } else if (dailyPlanPct >= 40) {
        statusPill.innerHTML = '<span class="score-status-dot" style="background:#0284C7"></span> On Track';
        guidanceText.textContent = 'Good progress! Complete your remaining daily missions to hit full targets.';
      } else {
        statusPill.innerHTML = '<span class="score-status-dot" style="background:#F59E0B"></span> Starting Day';
        guidanceText.textContent = 'Log water, workouts, or meals to increase your daily completion.';
      }
    }

    // Sub-pills: Hydration, Burn, Nutrition
    const hydraScoreEl = document.getElementById('dash-score-hydra-val');
    const actScoreEl = document.getElementById('dash-score-act-val');
    const nutScoreEl = document.getElementById('dash-score-nut-val');

    if (hydraScoreEl) hydraScoreEl.textContent = `${waterPct}%`;
    if (actScoreEl) actScoreEl.textContent = `${burnPct}%`;
    if (nutScoreEl) nutScoreEl.textContent = `${calPct}%`;
  }

  static renderWeeklyChart(todayPlanPct = null) {
    const container = document.getElementById('dash-activity-chart');
    if (!container) return;

    const state = StorageService.getState();
    const rawWeekly = state.weeklyActivity || [
      { day: 'Mon', calories: 0, adherence: 0, isToday: false },
      { day: 'Tue', calories: 0, adherence: 0, isToday: false },
      { day: 'Wed', calories: 0, adherence: 0, isToday: false },
      { day: 'Thu', calories: 0, adherence: 0, isToday: false },
      { day: 'Fri', calories: 0, adherence: 0, isToday: false },
      { day: 'Sat', calories: 0, adherence: 0, isToday: false },
      { day: 'Sun', calories: 0, adherence: 0, isToday: false }
    ];

    const data = rawWeekly.map(item => {
      let adherence = item.adherence || 0;
      if (item.isToday && todayPlanPct !== null) {
        adherence = todayPlanPct;
      }
      return {
        day: item.day,
        adherence: Math.min(100, Math.max(0, adherence)),
        isToday: item.isToday
      };
    });

    container.innerHTML = '';

    data.forEach(item => {
      const heightPct = item.adherence > 0 ? Math.max(8, item.adherence) : 4;

      const col = document.createElement('div');
      col.className = `chart-bar-column ${item.isToday ? 'active' : ''}`;
      col.innerHTML = `
        <div class="tooltip">${item.adherence}% Plan Achieved</div>
        <div class="chart-bar-bg" style="display:flex; flex-direction:column; justify-content:flex-end;">
          <div class="chart-bar-core" style="height: ${heightPct}%; background:${item.adherence > 0 ? 'var(--primary)' : 'var(--border-hairline)'};"></div>
        </div>
        <div class="chart-day-label">${item.day}</div>
      `;
      container.appendChild(col);
    });
  }

  static renderSmartRecommendation(waterGlasses, targetWater, consumed, targetCalories, burned, burnTarget) {
    const titleEl = document.getElementById('dash-rec-title');
    const descEl = document.getElementById('dash-rec-desc');
    const actionBtn = document.getElementById('dash-rec-action-btn');

    if (waterGlasses < Math.round(targetWater / 2)) {
      if (titleEl) titleEl.textContent = 'Hydration Boost Suggested';
      if (descEl) descEl.textContent = `You have logged ${waterGlasses} of ${targetWater} recommended glasses today. Staying hydrated fuels lean muscle recovery and keeps metabolic rate high.`;
      if (actionBtn) {
        actionBtn.innerHTML = '💧 Log Glass of Water';
        actionBtn.onclick = () => this.incrementWater();
      }
    } else if (burned < Math.round(burnTarget / 2)) {
      if (titleEl) titleEl.textContent = 'Active Energy Opportunity';
      if (descEl) descEl.textContent = `You have burned ${burned} / ${burnTarget} kcal today. A brisk 20-minute workout or cardio walk will complete your daily energy target.`;
      if (actionBtn) {
        actionBtn.innerHTML = '⚡ Go to Workout Session';
        actionBtn.onclick = () => window.dispatchEvent(new CustomEvent('smartfit:navigate', { detail: 'tab-workout' }));
      }
    } else if (consumed < Math.round(targetCalories * 0.6)) {
      if (titleEl) titleEl.textContent = 'Caloric & Protein Balance';
      if (descEl) descEl.textContent = `You have logged ${consumed} kcal of your ${targetCalories} kcal goal. Fuel your body with balanced whole foods to sustain workout recovery.`;
      if (actionBtn) {
        actionBtn.innerHTML = '🥗 Log Meals in Diet Tracker';
        actionBtn.onclick = () => window.dispatchEvent(new CustomEvent('smartfit:navigate', { detail: 'tab-diet' }));
      }
    } else {
      if (titleEl) titleEl.textContent = 'Peak Consistency Maintained';
      if (descEl) descEl.textContent = 'Outstanding discipline today! Your hydration, calorie burn, and workout metrics are aligning perfectly with your fitness objective.';
      if (actionBtn) {
        actionBtn.innerHTML = '📈 View Weight & Body Progress';
        actionBtn.onclick = () => window.dispatchEvent(new CustomEvent('smartfit:navigate', { detail: 'tab-progress' }));
      }
    }
  }

  static renderMissions(missions) {
    const listEl = document.getElementById('dash-mission-list');
    const countEl = document.getElementById('dash-mission-count');
    const progressBar = document.getElementById('dash-missions-progress-bar');
    const pctEl = document.getElementById('dash-missions-pct');
    const allCompletedBanner = document.getElementById('dash-missions-completed-banner');

    if (!listEl) return;

    const total = missions.length || 4;
    const completedCount = missions.filter(m => m.completed).length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    if (countEl) countEl.textContent = `${completedCount}/${total} Completed`;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;

    if (allCompletedBanner) {
      allCompletedBanner.style.display = (completedCount === total && total > 0) ? 'block' : 'none';
    }

    listEl.innerHTML = '';
    missions.forEach(m => {
      const item = document.createElement('div');
      item.className = `mission-item ${m.completed ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="mission-left" style="display:flex; align-items:center; gap:10px;">
          <input type="checkbox" class="mission-checkbox" data-mission-id="${m.id}" ${m.completed ? 'checked' : ''} disabled id="chk-${m.id}" style="cursor:default; width:16px; height:16px; accent-color:var(--primary);">
          <label for="chk-${m.id}" class="mission-text" style="cursor:default; font-size:0.875rem; font-weight:600; color:${m.completed ? 'var(--text-muted)' : 'var(--text-heading)'}; text-decoration:${m.completed ? 'line-through' : 'none'};">${m.title}</label>
        </div>
        <span class="mission-xp-tag" style="font-size:0.75rem; font-weight:700; color:${m.completed ? '#059669' : 'var(--primary)'}; background:${m.completed ? 'rgba(16,185,129,0.1)' : 'rgba(37,99,235,0.08)'}; padding:3px 8px; border-radius:12px;">${m.completed ? '✓ Met' : `+${m.xp} XP`}</span>
      `;
      listEl.appendChild(item);
    });
  }

  static incrementWater() {
    StorageService.update(state => {
      state.todayMetrics = state.todayMetrics || {};
      state.todayMetrics.waterGlasses = (state.todayMetrics.waterGlasses || 0) + 1;

      // Sync with water hydration service logs if active
      if (!state.hydration) state.hydration = { todayLogs: [] };
      if (!Array.isArray(state.hydration.todayLogs)) state.hydration.todayLogs = [];
      state.hydration.todayLogs.push({
        id: 'w_' + Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        ml: 250
      });

      return state;
    });

    const state = StorageService.getState();
    const glasses = state.todayMetrics?.waterGlasses || 0;
    const totalMl = (state.hydration?.todayLogs || []).reduce((sum, item) => sum + item.ml, 0);
    dbUpsertWater(glasses, totalMl).catch(() => {});

    AuthService.showToast(`Water logged: ${glasses} glasses! 💧`, 'info');
  }

  static toggleMission(missionId, isCompleted) {
    // Missions are strictly automatically calculated from real actions - no manual override
    this.syncMissionsWithPlan();
    this.render();
  }

  static handleRecommendationAction() {
    const state = StorageService.getState();
    const today = state.todayMetrics || {};
    if ((today.waterGlasses || 0) < 4) {
      this.incrementWater();
    } else {
      window.dispatchEvent(new CustomEvent('smartfit:navigate', { detail: 'tab-workout' }));
    }
  }
}
