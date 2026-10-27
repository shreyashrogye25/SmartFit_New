/* ==========================================================================
   SMARTFIT - Settings & Profile Manager
   Full control over language, medical conditions, biometric measurements,
   and daily metabolic targets.
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { I18nService } from './i18n.js';
import { PdfExportService } from './pdfExport.js';

export class SettingsService {
  static currentDiseases = ['none'];

  static init() {
    this.populateForm();
    this.bindEvents();

    window.addEventListener('smartfit:state-changed', () => {
      this.populateForm();
    });
  }

  static populateForm() {
    const state = StorageService.getState();
    const p = state.profile || {};

    const nameInp = document.getElementById('settings-name');
    const langInp = document.getElementById('settings-language');
    const ageInp = document.getElementById('settings-age');
    const genderInp = document.getElementById('settings-gender');
    const heightInp = document.getElementById('settings-height');
    const weightInp = document.getElementById('settings-weight');
    const targetWeightInp = document.getElementById('settings-target-weight');
    const bodyFatInp = document.getElementById('settings-bodyfat');
    const goalInp = document.getElementById('settings-goal');
    const activityInp = document.getElementById('settings-activity');
    const calTargetInp = document.getElementById('settings-cal-target');
    const waterTargetInp = document.getElementById('settings-water-target');

    if (nameInp) nameInp.value = p.name || '';
    if (langInp) langInp.value = p.language || 'en';
    if (ageInp) ageInp.value = p.age || 26;
    if (genderInp) genderInp.value = p.gender || 'male';
    if (heightInp) heightInp.value = p.height || 178;
    if (weightInp) weightInp.value = p.weight || 71;
    if (targetWeightInp) targetWeightInp.value = p.targetWeight || 68;
    if (bodyFatInp) bodyFatInp.value = p.bodyFat || 18;
    if (goalInp) goalInp.value = p.goal || 'stay_fit';
    if (activityInp) activityInp.value = p.activityLevel || 'moderate';
    if (calTargetInp) calTargetInp.value = p.dailyCalorieTarget || 2000;
    if (waterTargetInp) waterTargetInp.value = p.dailyWaterTarget || 8;

    // Disease chips
    this.currentDiseases = Array.isArray(p.diseases) && p.diseases.length > 0 ? [...p.diseases] : ['none'];
    this.renderDiseaseChips();
  }

  static renderDiseaseChips() {
    document.querySelectorAll('[data-settings-disease]').forEach(chip => {
      const val = chip.getAttribute('data-settings-disease');
      if (this.currentDiseases.includes(val)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  static bindEvents() {
    // Form submission
    const form = document.getElementById('settings-profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }

    // Disease chip toggle clicks
    document.querySelectorAll('[data-settings-disease]').forEach(chip => {
      chip.addEventListener('click', () => {
        const disease = chip.getAttribute('data-settings-disease');

        if (disease === 'none') {
          this.currentDiseases = ['none'];
        } else {
          this.currentDiseases = this.currentDiseases.filter(d => d !== 'none');
          if (this.currentDiseases.includes(disease)) {
            this.currentDiseases = this.currentDiseases.filter(d => d !== disease);
            if (this.currentDiseases.length === 0) this.currentDiseases = ['none'];
          } else {
            this.currentDiseases.push(disease);
          }
        }
        this.renderDiseaseChips();
      });
    });

    // Reset Data button
    const resetBtn = document.getElementById('settings-btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data back to default values?')) {
          StorageService.resetAll();
          AuthService.showToast('Data reset to defaults.', 'info');
          location.reload();
        }
      });
    }

    // Download JSON button
    const downloadBtn = document.getElementById('settings-btn-download-data');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadUserData();
      });
    }

    // Download PDF button
    const downloadPdfBtn = document.getElementById('settings-btn-download-pdf');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        this.downloadUserPdf();
      });
    }
  }

  static downloadUserData() {
    const state = StorageService.getState();
    const exportData = {
      exportDate: new Date().toISOString(),
      user: state.auth?.user || null,
      profile: state.profile || null,
      todayMetrics: state.todayMetrics || null,
      meals: state.meals || null,
      workouts: state.workouts || [],
      progressHistory: state.progressHistory || [],
      gamification: state.gamification || null,
      weeklyActivity: state.weeklyActivity || []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smartfit_health_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    AuthService.showToast('Your complete health data has been exported as JSON! 📥', 'success');
  }

  static downloadUserPdf() {
    const state = StorageService.getState();
    try {
      AuthService.showToast('Generating your SmartFit PDF Health Report...', 'info');
      const filename = PdfExportService.generateReport(state);
      AuthService.showToast(`Health Report downloaded (${filename})! 📄`, 'success');
    } catch (err) {
      console.error('[SettingsService] PDF generation error:', err);
      AuthService.showToast('Failed to generate PDF. Please try again.', 'warning');
    }
  }

  static saveSettings() {
    const name = document.getElementById('settings-name')?.value.trim();
    const language = document.getElementById('settings-language')?.value || 'en';
    const age = parseInt(document.getElementById('settings-age')?.value) || 26;
    const gender = document.getElementById('settings-gender')?.value || 'male';
    const height = parseFloat(document.getElementById('settings-height')?.value) || 178;
    const weight = parseFloat(document.getElementById('settings-weight')?.value) || 71;
    const targetWeight = parseFloat(document.getElementById('settings-target-weight')?.value) || 68;
    const bodyFat = parseInt(document.getElementById('settings-bodyfat')?.value) || 18;
    const goal = document.getElementById('settings-goal')?.value || 'stay_fit';
    const activityLevel = document.getElementById('settings-activity')?.value || 'moderate';
    const calTarget = parseInt(document.getElementById('settings-cal-target')?.value) || 2000;
    const waterTarget = parseInt(document.getElementById('settings-water-target')?.value) || 8;

    StorageService.update(state => {
      state.profile = {
        ...state.profile,
        name,
        language,
        age,
        gender,
        height,
        weight,
        targetWeight,
        bodyFat,
        goal,
        activityLevel,
        diseases: this.currentDiseases,
        dailyCalorieTarget: calTarget,
        dailyWaterTarget: waterTarget
      };
      if (state.auth.user) {
        state.auth.user.name = name;
      }
      return state;
    });

    // Sync language immediately
    I18nService.setLanguage(language, true);

    AuthService.showToast('Profile & Settings updated successfully! ✨', 'success');
  }
}
