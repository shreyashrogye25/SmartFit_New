/* ==========================================================================
   SMARTFIT - Achievements & Gamification Service
   XP level progression, badges gallery, and milestone unlocked states
   ========================================================================== */

import { StorageService } from './storage.js';

export class AchievementsService {
  static init() {
    this.render();
    window.addEventListener('smartfit:state-changed', () => {
      this.render();
    });
  }

  static render() {
    const state = StorageService.getState();
    const g = state.gamification;

    // Check automatic badge unlock triggers
    this.evaluateBadges(state);

    const xp = g.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const xpInCurrentLevel = xp % 100;

    const levelEl = document.getElementById('achieve-level-val');
    const xpTextEl = document.getElementById('achieve-xp-text');
    const xpFillEl = document.getElementById('achieve-xp-fill');
    const badgesGrid = document.getElementById('achieve-badges-grid');

    if (levelEl) levelEl.textContent = level;
    if (xpTextEl) xpTextEl.textContent = `${xpInCurrentLevel} / 100 XP to Level ${level + 1} (${xp} Total XP)`;
    if (xpFillEl) xpFillEl.style.width = `${xpInCurrentLevel}%`;

    if (!badgesGrid) return;
    badgesGrid.innerHTML = '';

    g.badges.forEach(b => {
      const card = document.createElement('div');
      card.className = `badge-card ${b.unlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-medal-icon">${b.icon}</div>
        <h4 class="badge-medal-title">${b.title}</h4>
        <p class="badge-medal-desc">${b.desc}</p>
        <span class="badge ${b.unlocked ? 'badge-green' : 'badge-blue'}">
          ${b.unlocked ? 'Unlocked' : 'In Progress'}
        </span>
      `;
      badgesGrid.appendChild(card);
    });
  }

  static evaluateBadges(state) {
    let changed = false;

    // 1. Water badge: 8 glasses
    const hydraBadge = state.gamification.badges.find(b => b.id === 'b_hydra');
    if (hydraBadge && !hydraBadge.unlocked && state.todayMetrics.waterGlasses >= 8) {
      hydraBadge.unlocked = true;
      changed = true;
    }

    // 2. Calorie burner: 400 kcal
    const calBadge = state.gamification.badges.find(b => b.id === 'b_cal');
    if (calBadge && !calBadge.unlocked && state.todayMetrics.caloriesBurned >= 400) {
      calBadge.unlocked = true;
      changed = true;
    }

    // 3. Fit Master: 500 XP
    const masterBadge = state.gamification.badges.find(b => b.id === 'b_master');
    if (masterBadge && !masterBadge.unlocked && state.gamification.xp >= 500) {
      masterBadge.unlocked = true;
      changed = true;
    }

    if (changed) {
      StorageService.saveState(state);
    }
  }
}
