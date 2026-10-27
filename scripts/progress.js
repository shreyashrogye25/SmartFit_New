/* ==========================================================================
   SMARTFIT - Weight & Body Progress Service
   Accurate, real-time weight tracking with weekly timeline, goal progress,
   side-by-side photo comparison, and zero fake demo data.
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { dbInsertProgress, dbDeleteProgress, dbUpdateProgress } from './db.js';

export class ProgressService {
  static currentPhotoDataUrl = null;
  static editingEntryId = null;

  static init() {
    this.cleanLegacyDemoData();
    this.render();
    this.bindEvents();

    window.addEventListener('smartfit:state-changed', () => {
      this.render();
    });
  }

  /**
   * Remove any legacy demo seeds from earlier sessions to guarantee zero fake data.
   */
  static cleanLegacyDemoData() {
    // Retain all legitimate user data; only strip explicit legacy mock seeds
    const state = StorageService.getState();
    const history = state.progressHistory || [];
    const filtered = history.filter(item => item && item.id !== 'legacy_fake_seed');
    if (filtered.length !== history.length) {
      StorageService.update(s => {
        s.progressHistory = filtered;
        return s;
      });
    }
  }

  static bindEvents() {
    // 1. Add Weight / Weekly Progress Buttons
    const btnAddStart = document.getElementById('prog-btn-add-start-weight');
    const btnAddWeekTop = document.getElementById('prog-btn-add-week-top');
    const btnAddWeekBottom = document.getElementById('prog-btn-add-week-bottom');
    const addBox = document.getElementById('prog-timeline-add-box');

    [btnAddStart, btnAddWeekTop, btnAddWeekBottom, addBox].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openWeeklyEntryModal();
        });
      }
    });

    // 2. Weekly Entry Modal: Close, Cancel, Submit
    const modalEntry = document.getElementById('prog-modal-entry');
    const btnCloseEntry = document.getElementById('prog-modal-entry-close');
    const btnCancelEntry = document.getElementById('prog-modal-entry-cancel');
    const formEntry = document.getElementById('prog-modal-entry-form');

    [btnCloseEntry, btnCancelEntry].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.closeWeeklyEntryModal();
        });
      }
    });

    if (modalEntry) {
      modalEntry.addEventListener('click', (e) => {
        if (e.target === modalEntry) this.closeWeeklyEntryModal();
      });
    }

    if (formEntry) {
      formEntry.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleWeeklyEntrySubmit();
      });
    }

    // 3. Photo Upload Handling
    const photoUploadZone = document.getElementById('prog-photo-upload-zone');
    const photoFileInput = document.getElementById('prog-photo-file-input');
    const photoBtnReplace = document.getElementById('prog-photo-btn-replace');
    const photoBtnRemove = document.getElementById('prog-photo-btn-remove');

    if (photoUploadZone && photoFileInput) {
      photoUploadZone.addEventListener('click', () => {
        photoFileInput.click();
      });
    }

    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            AuthService.showToast('Please upload an image file (JPG, PNG, WebP)', 'warning');
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            AuthService.showToast('Photo is too large (max 5MB)', 'warning');
            return;
          }
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.setModalPhotoPreview(evt.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (photoBtnReplace && photoFileInput) {
      photoBtnReplace.addEventListener('click', () => {
        photoFileInput.click();
      });
    }

    if (photoBtnRemove) {
      photoBtnRemove.addEventListener('click', () => {
        this.setModalPhotoPreview(null);
        if (photoFileInput) photoFileInput.value = '';
      });
    }

    // 4. Edit Goal Modal
    const btnEditGoal = document.getElementById('prog-btn-edit-goal');
    const modalGoal = document.getElementById('prog-modal-goal');
    const btnCloseGoal = document.getElementById('prog-modal-goal-close');
    const btnCancelGoal = document.getElementById('prog-modal-goal-cancel');
    const formGoal = document.getElementById('prog-modal-goal-form');

    if (btnEditGoal) {
      btnEditGoal.addEventListener('click', () => {
        this.openEditGoalModal();
      });
    }

    [btnCloseGoal, btnCancelGoal].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.closeEditGoalModal();
        });
      }
    });

    if (modalGoal) {
      modalGoal.addEventListener('click', (e) => {
        if (e.target === modalGoal) this.closeEditGoalModal();
      });
    }

    if (formGoal) {
      formGoal.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleGoalSubmit();
      });
    }

    // 5. Photo Lightbox Modal
    const modalLightbox = document.getElementById('prog-modal-lightbox');
    const btnCloseLightbox = document.getElementById('prog-lightbox-close');

    if (btnCloseLightbox) {
      btnCloseLightbox.addEventListener('click', () => {
        if (modalLightbox) modalLightbox.style.display = 'none';
      });
    }

    if (modalLightbox) {
      modalLightbox.addEventListener('click', (e) => {
        if (e.target === modalLightbox) modalLightbox.style.display = 'none';
      });
    }

    // 6. Photo Comparison Dropdown Change Events
    const selectA = document.getElementById('prog-compare-select-a');
    const selectB = document.getElementById('prog-compare-select-b');

    if (selectA) {
      selectA.addEventListener('change', () => {
        this.renderPhotoComparisonBoxes();
      });
    }

    if (selectB) {
      selectB.addEventListener('change', () => {
        this.renderPhotoComparisonBoxes();
      });
    }
  }

  /* --------------------------------------------------------------------------
     MODAL CONTROLS: Weekly Entry
     -------------------------------------------------------------------------- */
  static openWeeklyEntryModal(entryId = null) {
    const modal = document.getElementById('prog-modal-entry');
    const titleEl = document.getElementById('prog-modal-entry-title');
    const weightInp = document.getElementById('prog-entry-weight');
    const dateInp = document.getElementById('prog-entry-date');
    const notesInp = document.getElementById('prog-entry-notes');
    const idInp = document.getElementById('prog-entry-id');
    const photoFileInput = document.getElementById('prog-photo-file-input');

    if (!modal) return;

    if (photoFileInput) photoFileInput.value = '';
    this.editingEntryId = entryId;

    const state = StorageService.getState();
    const history = state.progressHistory || [];

    if (entryId) {
      const existing = history.find(h => h.id === entryId);
      if (existing) {
        if (titleEl) titleEl.textContent = `Edit Week ${existing.weekNumber} Progress`;
        if (idInp) idInp.value = existing.id;
        if (weightInp) weightInp.value = existing.weight;
        if (dateInp) dateInp.value = existing.rawDate || new Date().toISOString().split('T')[0];
        if (notesInp) notesInp.value = existing.notes || '';
        this.setModalPhotoPreview(existing.photoDataUrl || null);
      }
    } else {
      const nextWeek = history.length + 1;
      if (titleEl) titleEl.textContent = `Week ${nextWeek} Progress`;
      if (idInp) idInp.value = '';
      if (weightInp) {
        weightInp.value = '';
        weightInp.placeholder = 'e.g. 62.5';
      }
      if (dateInp) dateInp.value = new Date().toISOString().split('T')[0];
      if (notesInp) notesInp.value = '';
      this.setModalPhotoPreview(null);
    }

    modal.style.display = 'flex';
    if (weightInp) weightInp.focus();
  }

  static closeWeeklyEntryModal() {
    const modal = document.getElementById('prog-modal-entry');
    if (modal) modal.style.display = 'none';
    this.editingEntryId = null;
    this.setModalPhotoPreview(null);
  }

  static setModalPhotoPreview(dataUrl) {
    this.currentPhotoDataUrl = dataUrl;
    const uploadZone = document.getElementById('prog-photo-upload-zone');
    const previewBox = document.getElementById('prog-photo-preview-box');
    const previewImg = document.getElementById('prog-photo-preview-img');

    if (dataUrl) {
      if (uploadZone) uploadZone.style.display = 'none';
      if (previewBox) previewBox.style.display = 'flex';
      if (previewImg) previewImg.src = dataUrl;
    } else {
      if (uploadZone) uploadZone.style.display = 'block';
      if (previewBox) previewBox.style.display = 'none';
      if (previewImg) previewImg.src = '';
    }
  }

  static handleWeeklyEntrySubmit() {
    const weightInp = document.getElementById('prog-entry-weight');
    const dateInp = document.getElementById('prog-entry-date');
    const notesInp = document.getElementById('prog-entry-notes');
    const idInp = document.getElementById('prog-entry-id');

    const weight = parseFloat(weightInp?.value);
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      AuthService.showToast('Please enter a realistic weight value (20 - 300 kg)', 'warning');
      return;
    }

    const rawDate = dateInp?.value || new Date().toISOString().split('T')[0];
    const dateObj = new Date(rawDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const notes = notesInp?.value.trim() || '';
    const entryId = idInp?.value || null;

    const generatedId = entryId || ('prog_' + Date.now());

    StorageService.update(state => {
      if (!state.progressHistory) state.progressHistory = [];

      if (entryId) {
        // Edit existing
        const idx = state.progressHistory.findIndex(h => h.id === entryId);
        if (idx !== -1) {
          state.progressHistory[idx].weight = weight;
          state.progressHistory[idx].rawDate = rawDate;
          state.progressHistory[idx].date = formattedDate;
          state.progressHistory[idx].notes = notes;
          state.progressHistory[idx].note = notes;
          if (this.currentPhotoDataUrl !== undefined) {
            state.progressHistory[idx].photoDataUrl = this.currentPhotoDataUrl;
          }
        }
      } else {
        // Add new weekly entry
        const nextWeekNum = state.progressHistory.length + 1;
        const newEntry = {
          id: generatedId,
          weekNumber: nextWeekNum,
          rawDate: rawDate,
          date: formattedDate,
          weight: weight,
          notes: notes,
          note: notes,
          photoDataUrl: this.currentPhotoDataUrl || null
        };
        state.progressHistory.push(newEntry);
      }

      // If starting weight is not established yet, set it
      if (!state.profile.startingWeight && state.progressHistory.length > 0) {
        state.profile.startingWeight = state.progressHistory[0].weight;
      }

      // Update ONE source of truth: latest recorded weight updates profile.weight
      const latestEntry = state.progressHistory[state.progressHistory.length - 1];
      if (latestEntry) {
        state.profile.weight = latestEntry.weight;
      }

      return state;
    });

    // Persist to Supabase (fire-and-forget)
    if (entryId) {
      dbUpdateProgress(entryId, { weight, note: notes, date: rawDate }).catch(() => {});
    } else {
      dbInsertProgress({ id: generatedId, weight, note: notes, date: rawDate }).catch(() => {});
    }

    this.closeWeeklyEntryModal();
    AuthService.showToast(`Saved progress for ${weight} kg! 🎯`, 'success');
  }

  static deleteWeeklyEntry(entryId) {
    if (!confirm('Are you sure you want to delete this weekly progress record?')) return;

    StorageService.update(state => {
      if (!state.progressHistory) return state;

      state.progressHistory = state.progressHistory.filter(h => h.id !== entryId);

      // Re-index week numbers sequentially
      state.progressHistory.forEach((h, i) => {
        h.weekNumber = i + 1;
      });

      // Update profile weight to latest remaining or reset
      if (state.progressHistory.length > 0) {
        const latest = state.progressHistory[state.progressHistory.length - 1];
        state.profile.weight = latest.weight;
        state.profile.startingWeight = state.progressHistory[0].weight;
      }

      return state;
    });

    // Persist to Supabase (fire-and-forget)
    dbDeleteProgress(entryId).catch(() => {});

    AuthService.showToast('Weekly record removed.', 'info');
  }

  /* --------------------------------------------------------------------------
     MODAL CONTROLS: Edit Goal
     -------------------------------------------------------------------------- */
  static openEditGoalModal() {
    const modal = document.getElementById('prog-modal-goal');
    const goalSelect = document.getElementById('prog-goal-select');
    const targetInp = document.getElementById('prog-goal-target-weight');
    const startInp = document.getElementById('prog-goal-start-weight');

    if (!modal) return;

    const state = StorageService.getState();
    const p = state.profile || {};

    let goalVal = p.goal || 'lose_weight';
    if (goalVal === 'build_muscle') goalVal = 'build_muscle';
    else if (goalVal === 'stay_fit' || goalVal === 'stamina') goalVal = 'stay_fit';
    else goalVal = 'lose_weight';

    if (goalSelect) goalSelect.value = goalVal;
    if (targetInp) targetInp.value = p.targetWeight || (goalVal === 'build_muscle' ? 75 : 65);
    if (startInp) {
      const history = state.progressHistory || [];
      const startW = p.startingWeight || (history.length > 0 ? history[0].weight : p.weight || '');
      startInp.value = startW;
    }

    modal.style.display = 'flex';
  }

  static closeEditGoalModal() {
    const modal = document.getElementById('prog-modal-goal');
    if (modal) modal.style.display = 'none';
  }

  static handleGoalSubmit() {
    const goalSelect = document.getElementById('prog-goal-select');
    const targetInp = document.getElementById('prog-goal-target-weight');
    const startInp = document.getElementById('prog-goal-start-weight');

    const goal = goalSelect?.value || 'lose_weight';
    const targetWeight = parseFloat(targetInp?.value);
    const startingWeight = parseFloat(startInp?.value);

    if (!targetWeight || isNaN(targetWeight) || targetWeight < 20 || targetWeight > 300) {
      AuthService.showToast('Please enter a valid target weight (20 - 300 kg)', 'warning');
      return;
    }

    StorageService.update(state => {
      state.profile.goal = goal;
      state.profile.targetWeight = targetWeight;
      if (!isNaN(startingWeight) && startingWeight > 0) {
        state.profile.startingWeight = startingWeight;
        // If there are records and the first record matches starting baseline, update it too
        if (state.progressHistory && state.progressHistory.length > 0) {
          state.progressHistory[0].weight = startingWeight;
        }
      }
      return state;
    });

    this.closeEditGoalModal();
    AuthService.showToast('Goal target updated successfully! 🎯', 'success');
  }

  /* --------------------------------------------------------------------------
     PHOTO LIGHTBOX
     -------------------------------------------------------------------------- */
  static openLightbox(dataUrl, title, meta) {
    const modal = document.getElementById('prog-modal-lightbox');
    const imgEl = document.getElementById('prog-lightbox-img');
    const titleEl = document.getElementById('prog-lightbox-title');
    const metaEl = document.getElementById('prog-lightbox-meta');

    if (!modal || !dataUrl) return;

    if (imgEl) imgEl.src = dataUrl;
    if (titleEl) titleEl.textContent = title || 'Progress Photo';
    if (metaEl) metaEl.textContent = meta || '';

    modal.style.display = 'flex';
  }

  /* --------------------------------------------------------------------------
     MAIN RENDER CONTROLLER
     -------------------------------------------------------------------------- */
  static render() {
    const state = StorageService.getState();
    const p = state.profile || {};
    let history = state.progressHistory || [];

    // Derive Goal Type: 'gain', 'lose', or 'maintain'
    const goal = p.goal || 'lose_weight';
    let goalType = 'lose';
    if (goal === 'build_muscle' || goal === 'gain_weight') goalType = 'gain';
    else if (goal === 'stay_fit' || goal === 'maintain_weight') goalType = 'maintain';
    else goalType = 'lose';

    const hasEntries = history.length > 0;
    const startWeight = p.startingWeight || (hasEntries ? history[0].weight : p.weight || 0);
    const currentWeight = hasEntries ? history[history.length - 1].weight : (p.weight || 0);
    const targetWeight = p.targetWeight || (goalType === 'gain' ? startWeight + 5 : startWeight - 5);

    // Toggle Empty State UI vs Active Progress UI
    const emptyStateEl = document.getElementById('prog-empty-state');
    const timelineAddBox = document.getElementById('prog-timeline-add-box');
    const addTopBtn = document.getElementById('prog-btn-add-week-top');

    if (emptyStateEl) {
      emptyStateEl.style.display = hasEntries ? 'none' : 'block';
    }
    if (timelineAddBox) {
      timelineAddBox.style.display = hasEntries ? 'flex' : 'none';
    }
    if (addTopBtn) {
      addTopBtn.textContent = hasEntries ? `+ Add Week ${history.length + 1} Progress` : `+ Add This Week's Progress`;
    }

    // 1. Render Main Goal Card & Progress Bar
    this.renderMainGoalCard(goalType, startWeight, currentWeight, targetWeight, hasEntries);

    // 2. Render 5-Box Summary Grid
    this.renderSummaryGrid(goalType, startWeight, currentWeight, targetWeight, hasEntries);

    // 3. Render Weekly Timeline
    this.renderWeeklyTimeline(history, goalType);

    // 4. Render Photo Comparison Controls & Boxes
    this.renderPhotoComparison(history);
  }

  /* --------------------------------------------------------------------------
     1. MAIN GOAL & PROGRESS BAR RENDERING
     -------------------------------------------------------------------------- */
  static renderMainGoalCard(goalType, startWeight, currentWeight, targetWeight, hasEntries) {
    const badgeEl = document.getElementById('prog-goal-type-badge');
    const headingEl = document.getElementById('prog-goal-heading-text');
    const descEl = document.getElementById('prog-goal-desc-text');
    const startDisplayEl = document.getElementById('prog-display-start-weight');
    const currentDisplayEl = document.getElementById('prog-display-current-weight');
    const targetDisplayEl = document.getElementById('prog-display-target-weight');
    const barFillEl = document.getElementById('prog-main-bar-fill');
    const pctTextEl = document.getElementById('prog-main-pct-text');
    const remTextEl = document.getElementById('prog-main-rem-text');

    // Display weights from setup / live data
    if (startDisplayEl) startDisplayEl.textContent = startWeight > 0 ? `${startWeight.toFixed(1)} kg` : '-- kg';
    if (currentDisplayEl) currentDisplayEl.textContent = currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : '-- kg';
    if (targetDisplayEl) targetDisplayEl.textContent = targetWeight > 0 ? `${targetWeight.toFixed(1)} kg` : '-- kg';

    if (barFillEl) barFillEl.classList.remove('maintain');

    // Case A: Empty state / No records
    if (!hasEntries || !startWeight || !targetWeight) {
      if (badgeEl) {
        badgeEl.className = 'progress-status-badge on-track';
        badgeEl.textContent = goalType === 'gain' ? 'Gain Weight' : (goalType === 'maintain' ? 'Maintain Weight' : 'Lose Weight');
      }
      if (headingEl) headingEl.textContent = 'Your Weight Goal';
      if (descEl) descEl.textContent = 'Start by logging your initial weight to calibrate your goal.';
      if (pctTextEl) pctTextEl.textContent = '0% Complete';
      if (remTextEl) remTextEl.textContent = 'No weight entries yet';
      if (barFillEl) barFillEl.style.width = '0%';
      return;
    }

    // Case B: GAIN WEIGHT
    if (goalType === 'gain') {
      if (badgeEl) {
        badgeEl.className = 'progress-status-badge ahead';
        badgeEl.textContent = 'Build Muscle / Gain 📈';
      }
      if (headingEl) headingEl.textContent = 'Muscle Building & Weight Gain Progress';

      const totalRequired = targetWeight - startWeight;
      const gained = currentWeight - startWeight;
      const remaining = Math.max(0, targetWeight - currentWeight);

      let pct = 0;
      if (totalRequired > 0) {
        pct = Math.round((gained / totalRequired) * 100);
      }
      const clampedPct = Math.max(0, Math.min(100, pct));

      if (barFillEl) barFillEl.style.width = `${clampedPct}%`;

      if (currentWeight >= targetWeight && totalRequired > 0) {
        if (pctTextEl) pctTextEl.innerHTML = `100% Complete 🎉`;
        if (remTextEl) remTextEl.textContent = `Goal Achieved! You reached ${targetWeight} kg (+${(currentWeight - startWeight).toFixed(1)} kg gained total).`;
        if (descEl) descEl.textContent = 'Outstanding work! You have reached your weight gain milestone.';
      } else {
        if (pctTextEl) pctTextEl.textContent = `${clampedPct}% Complete`;
        const gainedText = gained >= 0 ? `${gained.toFixed(1)} kg gained` : `${Math.abs(gained).toFixed(1)} kg below start`;
        if (remTextEl) remTextEl.textContent = `${gainedText} · ${remaining.toFixed(1)} kg remaining`;
        if (descEl) descEl.textContent = `Target: ${targetWeight} kg (${Math.max(0, gained).toFixed(1)} kg gained out of ${totalRequired.toFixed(1)} kg required).`;
      }
    }

    // Case C: LOSE WEIGHT
    else if (goalType === 'lose') {
      if (badgeEl) {
        badgeEl.className = 'progress-status-badge on-track';
        badgeEl.textContent = 'Weight Loss 📉';
      }
      if (headingEl) headingEl.textContent = 'Weight Loss Progress';

      const totalRequired = startWeight - targetWeight;
      const lost = startWeight - currentWeight;
      const remaining = Math.max(0, currentWeight - targetWeight);

      let pct = 0;
      if (totalRequired > 0) {
        pct = Math.round((lost / totalRequired) * 100);
      }
      const clampedPct = Math.max(0, Math.min(100, pct));

      if (barFillEl) barFillEl.style.width = `${clampedPct}%`;

      if (currentWeight <= targetWeight && totalRequired > 0) {
        if (pctTextEl) pctTextEl.innerHTML = `100% Complete 🎉`;
        if (remTextEl) remTextEl.textContent = `Goal Achieved! You reached ${targetWeight} kg (-${(startWeight - currentWeight).toFixed(1)} kg lost total).`;
        if (descEl) descEl.textContent = 'Phenomenal dedication! You reached your target weight objective.';
      } else {
        if (pctTextEl) pctTextEl.textContent = `${clampedPct}% Complete`;
        const lostText = lost >= 0 ? `${lost.toFixed(1)} kg lost` : `+${Math.abs(lost).toFixed(1)} kg over start`;
        if (remTextEl) remTextEl.textContent = `${lostText} · ${remaining.toFixed(1)} kg remaining`;
        if (descEl) descEl.textContent = `Target: ${targetWeight} kg (${Math.max(0, lost).toFixed(1)} kg lost out of ${totalRequired.toFixed(1)} kg required).`;
      }
    }

    // Case D: MAINTAIN WEIGHT
    else {
      if (badgeEl) {
        badgeEl.className = 'progress-status-badge attention';
        badgeEl.textContent = 'Weight Maintenance ⚖️';
      }
      if (headingEl) headingEl.textContent = 'Weight Maintenance';

      const rangeLow = (targetWeight - 1.0).toFixed(1);
      const rangeHigh = (targetWeight + 1.0).toFixed(1);
      const inRange = currentWeight >= (targetWeight - 1.0) && currentWeight <= (targetWeight + 1.0);

      if (barFillEl) {
        barFillEl.classList.add('maintain');
        barFillEl.style.width = inRange ? '100%' : '75%';
      }

      if (pctTextEl) pctTextEl.textContent = `${currentWeight.toFixed(1)} kg`;
      if (remTextEl) {
        remTextEl.textContent = `Target Range: ${rangeLow}–${rangeHigh} kg · ${inRange ? 'Within target range' : (currentWeight > targetWeight + 1 ? 'Above target range' : 'Below target range')}`;
      }
      if (descEl) {
        descEl.textContent = inRange 
          ? `Peak conditioning: Your current weight is successfully sustained within your optimal target boundary.` 
          : `Calibration needed: Keep daily calories balanced with energy expenditure to stay in your ${rangeLow}–${rangeHigh} kg range.`;
      }
    }
  }

  /* --------------------------------------------------------------------------
     2. SUMMARY GRID RENDERING (5 boxes)
     -------------------------------------------------------------------------- */
  static renderSummaryGrid(goalType, startWeight, currentWeight, targetWeight, hasEntries) {
    const startEl = document.getElementById('prog-stat-start-weight');
    const currentEl = document.getElementById('prog-stat-current-weight');
    const deltaEl = document.getElementById('prog-stat-change-delta');
    const targetEl = document.getElementById('prog-stat-target-weight');
    const remEl = document.getElementById('prog-stat-remaining-val');

    if (!hasEntries || !startWeight) {
      if (startEl) startEl.textContent = '-- kg';
      if (currentEl) currentEl.textContent = '-- kg';
      if (deltaEl) {
        deltaEl.textContent = '0.0 kg';
        deltaEl.style.color = 'var(--text-heading)';
      }
      if (targetEl) targetEl.textContent = targetWeight > 0 ? `${targetWeight.toFixed(1)} kg` : '-- kg';
      if (remEl) remEl.textContent = '-- kg';
      return;
    }

    if (startEl) startEl.textContent = `${startWeight.toFixed(1)} kg`;
    if (currentEl) currentEl.textContent = `${currentWeight.toFixed(1)} kg`;
    if (targetEl) targetEl.textContent = `${targetWeight.toFixed(1)} kg`;

    const diff = parseFloat((currentWeight - startWeight).toFixed(1));
    const sign = diff > 0 ? `+${diff}` : `${diff}`;

    if (deltaEl) {
      deltaEl.textContent = `${sign} kg`;
      // Positive color feedback based on goal
      if (goalType === 'gain') {
        deltaEl.style.color = diff >= 0 ? 'var(--emerald)' : 'var(--amber)';
      } else if (goalType === 'lose') {
        deltaEl.style.color = diff <= 0 ? 'var(--emerald)' : 'var(--amber)';
      } else {
        deltaEl.style.color = 'var(--primary)';
      }
    }

    if (remEl) {
      if (goalType === 'gain') {
        const rem = Math.max(0, targetWeight - currentWeight);
        remEl.textContent = `${rem.toFixed(1)} kg`;
      } else if (goalType === 'lose') {
        const rem = Math.max(0, currentWeight - targetWeight);
        remEl.textContent = `${rem.toFixed(1)} kg`;
      } else {
        const dist = Math.abs(currentWeight - targetWeight);
        remEl.textContent = `±${dist.toFixed(1)} kg`;
      }
    }
  }

  /* --------------------------------------------------------------------------
     3. WEEKLY TIMELINE RENDERING
     -------------------------------------------------------------------------- */
  static renderWeeklyTimeline(history, goalType) {
    const list = document.getElementById('prog-timeline-list');
    if (!list) return;

    list.innerHTML = '';

    if (!history || history.length === 0) {
      return;
    }

    history.forEach((entry, idx) => {
      const prevEntry = idx > 0 ? history[idx - 1] : null;
      let statusHtml = '';

      if (!prevEntry) {
        statusHtml = `<span class="prog-status-chip neutral">⚖️ Baseline</span>`;
      } else {
        const diff = parseFloat((entry.weight - prevEntry.weight).toFixed(1));
        if (Math.abs(diff) < 0.1) {
          statusHtml = `<span class="prog-status-chip neutral">➖ No significant change this week</span>`;
        } else if (diff > 0) {
          const chipClass = goalType === 'gain' ? 'loss' : 'gain'; // green if gain goal
          statusHtml = `<span class="prog-status-chip ${chipClass}">📈 +${diff} kg this week</span>`;
        } else {
          const chipClass = goalType === 'lose' ? 'loss' : 'gain'; // green if loss goal
          statusHtml = `<span class="prog-status-chip ${chipClass}">📉 ${diff} kg this week</span>`;
        }
      }

      // Photo thumbnail or badge
      let photoHtml = '';
      if (entry.photoDataUrl) {
        photoHtml = `
          <div class="prog-photo-thumb-wrap" data-prog-zoom-id="${entry.id}" title="Click to view full photo">
            <img src="${entry.photoDataUrl}" alt="Week ${entry.weekNumber} Photo" class="prog-photo-thumb-img">
            <div class="prog-photo-thumb-badge">📷 Photo</div>
          </div>
        `;
      } else {
        photoHtml = `
          <span style="font-size:0.75rem; color:var(--text-subtle); display:flex; align-items:center; gap:4px;">
            📷 No photo
          </span>
        `;
      }

      const weekNum = entry.weekNumber || (idx + 1);
      const noteText = entry.notes || entry.note || '';

      const row = document.createElement('div');
      row.className = 'prog-timeline-row';
      row.innerHTML = `
        <div class="prog-timeline-bullet">${weekNum}</div>
        <div class="prog-timeline-card">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div class="prog-week-title">
              <span>Week ${weekNum}</span>
              ${statusHtml}
            </div>
            <div class="prog-week-weight">${Number(entry.weight).toFixed(1)} kg</div>
            <div class="prog-week-meta">
              <span>📅 ${entry.date || 'Weigh-in'}</span>
              ${noteText ? `<span>• ${noteText}</span>` : ''}
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:16px;">
            ${photoHtml}
            <div class="prog-timeline-actions">
              <button type="button" class="prog-btn-action-icon" data-prog-edit-id="${entry.id}" title="Edit Week ${weekNum}">
                ✏️
              </button>
              <button type="button" class="prog-btn-action-icon delete" data-prog-delete-id="${entry.id}" title="Delete Week ${weekNum}">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;

      list.appendChild(row);
    });

    // Attach row events (Edit, Delete, Photo Zoom)
    list.querySelectorAll('[data-prog-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-prog-edit-id');
        this.openWeeklyEntryModal(id);
      });
    });

    list.querySelectorAll('[data-prog-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-prog-delete-id');
        this.deleteWeeklyEntry(id);
      });
    });

    list.querySelectorAll('[data-prog-zoom-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-prog-zoom-id');
        const item = history.find(h => h.id === id);
        if (item && item.photoDataUrl) {
          this.openLightbox(
            item.photoDataUrl,
            `Week ${item.weekNumber} Progress Photo`,
            `${item.weight} kg • ${item.date} ${item.notes ? '• ' + item.notes : ''}`
          );
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. SIDE-BY-SIDE PHOTO COMPARISON SECTION
     -------------------------------------------------------------------------- */
  static renderPhotoComparison(history) {
    const photoEntries = history.filter(h => !!h.photoDataUrl);
    const countBadge = document.getElementById('prog-photo-count-badge');
    const selectA = document.getElementById('prog-compare-select-a');
    const selectB = document.getElementById('prog-compare-select-b');

    if (countBadge) {
      countBadge.textContent = `${photoEntries.length} Photo${photoEntries.length === 1 ? '' : 's'}`;
    }

    if (!selectA || !selectB) return;

    // Cache current selections if any
    const prevValA = selectA.value;
    const prevValB = selectB.value;

    selectA.innerHTML = '';
    selectB.innerHTML = '';

    if (photoEntries.length === 0) {
      selectA.innerHTML = '<option value="">No photos logged</option>';
      selectB.innerHTML = '<option value="">No photos logged</option>';
      selectA.disabled = true;
      selectB.disabled = true;
      this.renderPhotoComparisonBoxes();
      return;
    }

    selectA.disabled = false;
    selectB.disabled = false;

    photoEntries.forEach(entry => {
      const optA = document.createElement('option');
      optA.value = entry.id;
      optA.textContent = `Week ${entry.weekNumber} (${entry.weight} kg • ${entry.date})`;
      selectA.appendChild(optA);

      const optB = document.createElement('option');
      optB.value = entry.id;
      optB.textContent = `Week ${entry.weekNumber} (${entry.weight} kg • ${entry.date})`;
      selectB.appendChild(optB);
    });

    // Default selectA to first entry and selectB to latest entry
    if (prevValA && photoEntries.some(p => p.id === prevValA)) {
      selectA.value = prevValA;
    } else {
      selectA.value = photoEntries[0].id;
    }

    if (prevValB && photoEntries.some(p => p.id === prevValB)) {
      selectB.value = prevValB;
    } else {
      selectB.value = photoEntries[photoEntries.length - 1].id;
    }

    this.renderPhotoComparisonBoxes();
  }

  static renderPhotoComparisonBoxes() {
    const state = StorageService.getState();
    const history = state.progressHistory || [];

    const selectA = document.getElementById('prog-compare-select-a');
    const selectB = document.getElementById('prog-compare-select-b');

    const idA = selectA?.value;
    const idB = selectB?.value;

    const entryA = history.find(h => h.id === idA);
    const entryB = history.find(h => h.id === idB);

    // Box A
    const titleA = document.getElementById('prog-compare-title-a');
    const weightA = document.getElementById('prog-compare-weight-a');
    const wrapA = document.getElementById('prog-compare-img-wrap-a');

    if (entryA) {
      if (titleA) titleA.textContent = `Week ${entryA.weekNumber} (${entryA.date})`;
      if (weightA) weightA.textContent = `${entryA.weight} kg`;
      if (wrapA) {
        if (entryA.photoDataUrl) {
          wrapA.innerHTML = `<img src="${entryA.photoDataUrl}" alt="Week ${entryA.weekNumber}">`;
          wrapA.querySelector('img').addEventListener('click', () => {
            this.openLightbox(entryA.photoDataUrl, `Week ${entryA.weekNumber} Photo`, `${entryA.weight} kg • ${entryA.date}`);
          });
        } else {
          wrapA.innerHTML = '<div class="prog-compare-placeholder">No photo uploaded</div>';
        }
      }
    } else {
      if (titleA) titleA.textContent = 'Week 1';
      if (weightA) weightA.textContent = '-- kg';
      if (wrapA) wrapA.innerHTML = '<div class="prog-compare-placeholder">No progress photos yet</div>';
    }

    // Box B
    const titleB = document.getElementById('prog-compare-title-b');
    const weightB = document.getElementById('prog-compare-weight-b');
    const wrapB = document.getElementById('prog-compare-img-wrap-b');

    if (entryB) {
      if (titleB) titleB.textContent = `Week ${entryB.weekNumber} (${entryB.date})`;
      if (weightB) weightB.textContent = `${entryB.weight} kg`;
      if (wrapB) {
        if (entryB.photoDataUrl) {
          wrapB.innerHTML = `<img src="${entryB.photoDataUrl}" alt="Week ${entryB.weekNumber}">`;
          wrapB.querySelector('img').addEventListener('click', () => {
            this.openLightbox(entryB.photoDataUrl, `Week ${entryB.weekNumber} Photo`, `${entryB.weight} kg • ${entryB.date}`);
          });
        } else {
          wrapB.innerHTML = '<div class="prog-compare-placeholder">No photo uploaded</div>';
        }
      }
    } else {
      if (titleB) titleB.textContent = 'Latest Week';
      if (weightB) weightB.textContent = '-- kg';
      if (wrapB) wrapB.innerHTML = '<div class="prog-compare-placeholder">No progress photos yet</div>';
    }
  }
}
