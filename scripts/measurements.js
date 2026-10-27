/* ==========================================================================
   SMARTFIT - Measurements & Body Health Profile Service
   Dedicated tab for interactive biometric sliders, activity levels,
   pre-existing diseases, and clinical metabolic analytics.
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { I18nService } from './i18n.js';

export class MeasurementsService {
  static currentProfile = {};

  static init() {
    this.syncFromState();
    this.bindEvents();

    window.addEventListener('smartfit:state-changed', () => {
      this.syncFromState();
    });

    window.addEventListener('smartfit:lang-changed', () => {
      this.updateDiseaseAdvisory();
    });
  }

  static syncFromState() {
    const state = StorageService.getState();
    this.currentProfile = { ...state.profile };

    this.setSliderVal('meas-slider-age', 'meas-val-age', this.currentProfile.age || 26, ' yrs');
    this.setSliderVal('meas-slider-height', 'meas-val-height', this.currentProfile.height || 178, ' cm');
    this.setSliderVal('meas-slider-weight', 'meas-val-weight', this.currentProfile.weight || 71, ' kg');

    // Update converted labels (ft'in and lbs)
    this.updateHeightSecondary(this.currentProfile.height || 178);
    this.updateWeightSecondary('meas-sub-weight', this.currentProfile.weight || 71);

    // Activity level selection
    this.selectActivityCard(this.currentProfile.activityLevel || 'moderate');

    // Disease chips selection
    this.selectDiseaseChips(this.currentProfile.diseases || ['none']);

    // Language selection
    this.selectLanguageChip(this.currentProfile.language || 'en');

    // Gender selection
    this.selectGenderOption(this.currentProfile.gender || 'male');

    // Compute live metrics
    this.recalculateAll();
  }

  static setSliderVal(sliderId, labelId, val, unitSuffix = '') {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (slider) slider.value = val;
    if (label) label.textContent = `${val}${unitSuffix}`;
  }

  static updateHeightSecondary(cm) {
    const el = document.getElementById('meas-sub-height');
    if (!el) return;
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    el.textContent = `≈ ${feet}' ${inches}"`;
  }

  static updateWeightSecondary(elementId, kg) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const lbs = (kg * 2.20462).toFixed(1);
    el.textContent = `≈ ${lbs} lbs`;
  }

  static selectActivityCard(actVal) {
    document.querySelectorAll('[data-meas-activity]').forEach(card => {
      if (card.getAttribute('data-meas-activity') === actVal) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
    this.currentProfile.activityLevel = actVal;
  }

  static selectDiseaseChips(diseasesList) {
    if (!Array.isArray(diseasesList) || diseasesList.length === 0) {
      diseasesList = ['none'];
    }
    document.querySelectorAll('[data-meas-disease]').forEach(chip => {
      const val = chip.getAttribute('data-meas-disease');
      if (diseasesList.includes(val)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    this.currentProfile.diseases = diseasesList;
    this.updateDiseaseAdvisory();
  }

  static selectLanguageChip(lang) {
    document.querySelectorAll('[data-meas-lang]').forEach(btn => {
      if (btn.getAttribute('data-meas-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  static selectGenderOption(gender) {
    document.querySelectorAll('[data-meas-gender]').forEach(btn => {
      if (btn.getAttribute('data-meas-gender') === gender) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    this.currentProfile.gender = gender;
  }

  static bindEvents() {
    // 1. Age Slider
    const ageSlider = document.getElementById('meas-slider-age');
    if (ageSlider) {
      ageSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.currentProfile.age = val;
        const label = document.getElementById('meas-val-age');
        if (label) label.textContent = `${val} yrs`;
        this.recalculateAll();
      });
    }

    // 2. Height Slider
    const heightSlider = document.getElementById('meas-slider-height');
    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.currentProfile.height = val;
        const label = document.getElementById('meas-val-height');
        if (label) label.textContent = `${val} cm`;
        this.updateHeightSecondary(val);
        this.recalculateAll();
      });
    }

    // 3. Weight Slider
    const weightSlider = document.getElementById('meas-slider-weight');
    if (weightSlider) {
      weightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.currentProfile.weight = val;
        const label = document.getElementById('meas-val-weight');
        if (label) label.textContent = `${val} kg`;
        this.updateWeightSecondary('meas-sub-weight', val);
        this.recalculateAll();
      });
    }



    // Gender Selection
    document.querySelectorAll('[data-meas-gender]').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = btn.getAttribute('data-meas-gender');
        this.selectGenderOption(g);
        this.recalculateAll();
      });
    });

    // Activity level cards
    document.querySelectorAll('[data-meas-activity]').forEach(card => {
      card.addEventListener('click', () => {
        const act = card.getAttribute('data-meas-activity');
        this.selectActivityCard(act);
        this.recalculateAll();
      });
    });

    // Disease chips
    document.querySelectorAll('[data-meas-disease]').forEach(chip => {
      chip.addEventListener('click', () => {
        const disease = chip.getAttribute('data-meas-disease');
        let current = this.currentProfile.diseases || ['none'];

        if (disease === 'none') {
          // Exclusive: only none
          current = ['none'];
        } else {
          // Remove 'none' if selecting a disease
          current = current.filter(d => d !== 'none');
          if (current.includes(disease)) {
            current = current.filter(d => d !== disease);
            if (current.length === 0) current = ['none'];
          } else {
            current.push(disease);
          }
        }
        this.selectDiseaseChips(current);
      });
    });

    // Language pills inside measurements tab
    document.querySelectorAll('[data-meas-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-meas-lang');
        this.selectLanguageChip(lang);
        I18nService.setLanguage(lang, true);
      });
    });

    // Save Profile Buttons across all separate tabs
    document.querySelectorAll('.btn-save-profile-action, #meas-btn-save-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        this.saveProfile();
      });
    });
  }

  static recalculateAll() {
    const p = this.currentProfile;
    const h = p.height || 178;
    const w = p.weight || 71;
    const age = p.age || 26;
    const isMale = p.gender !== 'female';
    const hM = h / 100;

    // 1. BMI
    const bmi = (w / (hM * hM)).toFixed(1);
    const bmiValEl = document.getElementById('meas-calc-bmi-val');
    const bmiBadgeEl = document.getElementById('meas-calc-bmi-badge');

    if (bmiValEl) bmiValEl.textContent = bmi;

    let cat = 'Normal';
    let badgeClass = 'badge-green';
    if (bmi < 18.5) {
      cat = 'Underweight';
      badgeClass = 'badge-cyan';
    } else if (bmi < 25) {
      cat = 'Normal';
      badgeClass = 'badge-green';
    } else if (bmi < 30) {
      cat = 'Overweight';
      badgeClass = 'badge-orange';
    } else {
      cat = 'Obese';
      badgeClass = 'badge-orange';
    }

    if (bmiBadgeEl) {
      bmiBadgeEl.className = `status-badge ${badgeClass}`;
      bmiBadgeEl.textContent = cat;
    }

    // 2. BMR (Mifflin-St Jeor formula)
    let bmr = Math.round(
      isMale
        ? 10 * w + 6.25 * h - 5 * age + 5
        : 10 * w + 6.25 * h - 5 * age - 161
    );

    // 3. TDEE (Total Daily Energy Expenditure) based on activity
    let multiplier = 1.375;
    if (p.activityLevel === 'sedentary') multiplier = 1.2;
    if (p.activityLevel === 'light') multiplier = 1.375;
    if (p.activityLevel === 'moderate') multiplier = 1.55;
    if (p.activityLevel === 'very_active') multiplier = 1.725;
    if (p.activityLevel === 'extra_active') multiplier = 1.9;

    const tdee = Math.round(bmr * multiplier);

    // Target Calorie calculation based on Goal
    let targetCal = tdee;
    if (p.goal === 'lose_weight') targetCal = Math.max(1350, tdee - 450);
    if (p.goal === 'build_muscle') targetCal = tdee + 350;

    // Water target (approx 35ml per kg + activity bonus)
    let waterLiters = ((w * 0.033) + (multiplier > 1.5 ? 0.6 : 0.2)).toFixed(1);
    let waterGlasses = Math.max(6, Math.round((waterLiters * 1000) / 250));

    // Update DOM readout
    const bmrEl = document.getElementById('meas-calc-bmr');
    const tdeeEl = document.getElementById('meas-calc-tdee');
    const calTargetEl = document.getElementById('meas-calc-cals');
    const waterEl = document.getElementById('meas-calc-water');
    const healthyRangeEl = document.getElementById('meas-calc-healthy-range');

    if (bmrEl) bmrEl.textContent = `${bmr} kcal`;
    if (tdeeEl) tdeeEl.textContent = `${tdee} kcal`;
    const actTdeeEl = document.getElementById('activity-tab-tdee-val');
    if (actTdeeEl) actTdeeEl.textContent = `${tdee} kcal/day`;
    if (calTargetEl) calTargetEl.textContent = `${targetCal} kcal/day`;
    if (waterEl) waterEl.textContent = `${waterGlasses} glasses (${waterLiters}L)`;

    const minW = Math.round(18.5 * hM * hM);
    const maxW = Math.round(24.9 * hM * hM);
    if (healthyRangeEl) healthyRangeEl.textContent = `${minW} - ${maxW} kg`;

    // Cache calculated targets for save
    this.calculatedCalTarget = targetCal;
    this.calculatedWaterTarget = waterGlasses;
  }

  static updateDiseaseAdvisory() {
    const panel = document.getElementById('meas-disease-advisory-box');
    if (!panel) return;

    const diseases = this.currentProfile.diseases || ['none'];
    const tipsList = [];

    if (diseases.includes('none') || diseases.length === 0) {
      panel.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.5rem;">✨</span>
          <div>
            <div style="font-weight:700;color:var(--emerald);font-size:0.875rem;">Clear Health Status</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);">No chronic conditions recorded. Standard balanced fitness training and optimal nutrition recommended!</div>
          </div>
        </div>
      `;
      return;
    }

    if (diseases.includes('diabetes')) {
      tipsList.push({
        icon: '🩸',
        title: 'Diabetes Management',
        tip: 'Prioritize low-glycemic carbs (oats, brown rice, pulses). Schedule post-meal walks (15-20 min) to stabilize blood glucose and keep emergency glucose handy during workouts.'
      });
    }
    if (diseases.includes('hypertension')) {
      tipsList.push({
        icon: '❤️',
        title: 'Hypertension (High BP)',
        tip: 'Keep sodium under 2,000 mg/day. Emphasize steady-state aerobic cardio (brisk walk, cycling) and avoid heavy isometric breath-holding (Valsalva maneuver).'
      });
    }
    if (diseases.includes('asthma')) {
      tipsList.push({
        icon: '🫁',
        title: 'Respiratory & Asthma Care',
        tip: 'Always do a gradual 8-10 min warm-up. Keep your prescribed rescue inhaler accessible. Prefer temperature-regulated indoor exercise during cold or pollen peaks.'
      });
    }
    if (diseases.includes('thyroid')) {
      tipsList.push({
        icon: '🦋',
        title: 'Thyroid Care',
        tip: 'Combine moderate resistance training with consistent lean protein intake. Regulate circadian sleep patterns to support endocrine and metabolic balance.'
      });
    }
    if (diseases.includes('heart')) {
      tipsList.push({
        icon: '🫀',
        title: 'Cardiovascular Care',
        tip: 'Maintain target heart rate within moderate aerobic zones (50-70% HR max). Always consult your cardiologist before testing high-intensity intervals (HIIT).'
      });
    }
    if (diseases.includes('arthritis')) {
      tipsList.push({
        icon: '🦴',
        title: 'Joint & Arthritis Protection',
        tip: 'Choose low-impact activities like swimming, cycling, and resistance bands to preserve joint cartilage while strengthening stabilizer muscles.'
      });
    }
    if (diseases.includes('cholesterol')) {
      tipsList.push({
        icon: '🥑',
        title: 'Lipid & Cholesterol Optimization',
        tip: 'Increase soluble fiber (oats, legumes, chia seeds) and healthy omega-3 fatty acids. Limit trans and saturated fats to boost protective HDL levels.'
      });
    }

    let html = `
      <div style="font-size:0.8125rem;font-weight:700;color:var(--text-heading);margin-bottom:10px;display:flex;align-items:center;gap:8px;">
        <span style="color:var(--primary);">🩺</span> Clinical Health & Fitness Guidelines:
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
    `;

    tipsList.forEach(t => {
      html += `
        <div style="display:flex;align-items:flex-start;gap:10px;background:var(--bg-card);border:1px solid var(--border-hairline);border-radius:var(--radius-sm);padding:10px 12px;">
          <span style="font-size:1.25rem;">${t.icon}</span>
          <div>
            <strong style="font-size:0.8125rem;color:var(--text-heading);">${t.title}:</strong>
            <span style="font-size:0.8125rem;color:var(--text-muted);display:block;margin-top:2px;">${t.tip}</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    panel.innerHTML = html;
  }

  static saveProfile() {
    this.recalculateAll();

    StorageService.update(state => {
      state.profile = {
        ...state.profile,
        ...this.currentProfile,
        dailyCalorieTarget: this.calculatedCalTarget || state.profile.dailyCalorieTarget || 2000,
        dailyWaterTarget: this.calculatedWaterTarget || state.profile.dailyWaterTarget || 8
      };
      return state;
    });

    AuthService.showToast(I18nService.t('profileSaved'), 'success');
  }
}
