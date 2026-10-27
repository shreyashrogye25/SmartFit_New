/* ==========================================================================
   SMARTFIT - Onboarding Service
   Interactive 6-Step Progressive Setup (Step-by-Step, One Topic per Slide)
   Next -> Next -> Next flow
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { I18nService } from './i18n.js';

export class OnboardingService {
  static currentStep = 1;
  static totalSteps = 6;
  static stepTitles = {
    1: 'Language Preference',
    2: 'Personal Details & Age',
    3: 'Physical Measurements (Sliders)',
    4: 'Daily Activity Level',
    5: 'Health History & Conditions',
    6: 'Fitness Goal & Baseline'
  };

  static tempProfile = {
    language: 'en',
    name: '',
    age: 26,
    height: 175,
    weight: 70,
    targetWeight: 68,
    bodyFat: 18,
    gender: 'male',
    goal: 'stay_fit',
    activityLevel: 'moderate',
    diseases: ['none']
  };

  static init() {
    this.bindEvents();
    this.resetFormFromState();
    this.goToStep(1);

    window.addEventListener('smartfit:state-changed', () => {
      this.resetFormFromState();
    });
  }

  static resetFormFromState() {
    const state = StorageService.getState();
    const defaults = {
      language: 'en',
      name: (state.auth?.user ? state.auth.user.name : ''),
      age: 26,
      height: 175,
      weight: 70,
      targetWeight: 68,
      bodyFat: 18,
      gender: 'male',
      goal: 'stay_fit',
      activityLevel: 'moderate',
      diseases: ['none']
    };
    this.tempProfile = {
      ...defaults,
      ...(state.profile || {})
    };

    // Step 1: Language
    this.selectLanguage(this.tempProfile.language || 'en');

    // Step 2: Name, Gender, Age Slider
    const nameInput = document.getElementById('onboard-name');
    const ageSlider = document.getElementById('onboard-slider-age');
    const ageVal = document.getElementById('onboard-val-age');

    if (nameInput) nameInput.value = this.tempProfile.name || (state.auth.user ? state.auth.user.name : '');
    if (ageSlider) ageSlider.value = this.tempProfile.age || 26;
    if (ageVal) ageVal.textContent = `${this.tempProfile.age || 26} yrs`;
    this.selectOptionCard('gender', this.tempProfile.gender || 'male');

    // Step 3: Measurement Sliders
    const heightSlider = document.getElementById('onboard-slider-height');
    const weightSlider = document.getElementById('onboard-slider-weight');
    const targetWeightSlider = document.getElementById('onboard-slider-target-weight');

    const heightVal = document.getElementById('onboard-val-height');
    const weightVal = document.getElementById('onboard-val-weight');
    const targetWeightVal = document.getElementById('onboard-val-target-weight');

    if (heightSlider) heightSlider.value = this.tempProfile.height || 178;
    if (weightSlider) weightSlider.value = this.tempProfile.weight || 71;
    if (targetWeightSlider) targetWeightSlider.value = this.tempProfile.targetWeight || 68;

    if (heightVal) heightVal.textContent = `${this.tempProfile.height || 178} cm`;
    if (weightVal) weightVal.textContent = `${this.tempProfile.weight || 71} kg`;
    if (targetWeightVal) targetWeightVal.textContent = `${this.tempProfile.targetWeight || 68} kg`;

    this.updateHeightSecondary(this.tempProfile.height || 178);
    this.updateWeightSecondary('onboard-sub-weight', this.tempProfile.weight || 71);
    this.updateWeightSecondary('onboard-sub-target-weight', this.tempProfile.targetWeight || 68);

    // Step 4: Activity Level
    this.selectActivity(this.tempProfile.activityLevel || 'moderate');

    // Step 5: Diseases
    this.selectDiseases(this.tempProfile.diseases || ['none']);

    // Step 6: Goal
    this.selectOptionCard('goal', this.tempProfile.goal || 'stay_fit');

    this.updateLiveBmiPreview();
    this.updatePlanSummary();
  }

  static updateHeightSecondary(cm) {
    const el = document.getElementById('onboard-sub-height');
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

  static bindEvents() {
    // === CLICKABLE TAB NAV BUTTONS ===
    // Each [data-onboard-tab] button directly jumps to that tab
    document.querySelectorAll('[data-onboard-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabNum = parseInt(btn.getAttribute('data-onboard-tab'));
        this.goToStep(tabNum);
      });
    });

    // Step 1 -> 2
    const next1 = document.getElementById('onboard-btn-next-1');
    if (next1) next1.addEventListener('click', () => this.goToStep(2));

    // Step 2 <-> 3
    const back2 = document.getElementById('onboard-btn-back-2');
    const next2 = document.getElementById('onboard-btn-next-2');
    if (back2) back2.addEventListener('click', () => this.goToStep(1));
    if (next2) next2.addEventListener('click', () => this.goToStep(3));

    // Step 3 <-> 4
    const back3 = document.getElementById('onboard-btn-back-3');
    const next3 = document.getElementById('onboard-btn-next-3');
    if (back3) back3.addEventListener('click', () => this.goToStep(2));
    if (next3) next3.addEventListener('click', () => this.goToStep(4));

    // Step 4 <-> 5
    const back4 = document.getElementById('onboard-btn-back-4');
    const next4 = document.getElementById('onboard-btn-next-4');
    if (back4) back4.addEventListener('click', () => this.goToStep(3));
    if (next4) next4.addEventListener('click', () => this.goToStep(5));

    // Step 5 <-> 6
    const back5 = document.getElementById('onboard-btn-back-5');
    const next5 = document.getElementById('onboard-btn-next-5');
    if (back5) back5.addEventListener('click', () => this.goToStep(4));
    if (next5) next5.addEventListener('click', () => this.goToStep(6));

    // Step 6 finish
    const back6 = document.getElementById('onboard-btn-back-6');
    const finishBtn = document.getElementById('onboard-btn-finish');
    if (back6) back6.addEventListener('click', () => this.goToStep(5));
    if (finishBtn) finishBtn.addEventListener('click', () => this.completeOnboarding());

    // Language selection in onboarding
    document.querySelectorAll('[data-onboard-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-onboard-lang');
        this.selectLanguage(lang);
        I18nService.setLanguage(lang, true);
      });
    });

    // Age Slider
    const ageSlider = document.getElementById('onboard-slider-age');
    if (ageSlider) {
      ageSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.tempProfile.age = val;
        const disp = document.getElementById('onboard-val-age');
        if (disp) disp.textContent = `${val} yrs`;
        this.updatePlanSummary();
      });
    }

    // Gender selection
    document.querySelectorAll('[data-gender-val]').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-gender-val');
        this.selectOptionCard('gender', val);
        this.tempProfile.gender = val;
        this.updatePlanSummary();
      });
    });

    // Height Slider
    const heightSlider = document.getElementById('onboard-slider-height');
    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.tempProfile.height = val;
        const disp = document.getElementById('onboard-val-height');
        if (disp) disp.textContent = `${val} cm`;
        this.updateHeightSecondary(val);
        this.updateLiveBmiPreview();
        this.updatePlanSummary();
      });
    }

    // Weight Slider
    const weightSlider = document.getElementById('onboard-slider-weight');
    if (weightSlider) {
      weightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.tempProfile.weight = val;
        const disp = document.getElementById('onboard-val-weight');
        if (disp) disp.textContent = `${val} kg`;
        this.updateWeightSecondary('onboard-sub-weight', val);
        this.updateLiveBmiPreview();
        this.updatePlanSummary();
      });
    }

    // Target Weight Slider
    const targetWeightSlider = document.getElementById('onboard-slider-target-weight');
    if (targetWeightSlider) {
      targetWeightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.tempProfile.targetWeight = val;
        const disp = document.getElementById('onboard-val-target-weight');
        if (disp) disp.textContent = `${val} kg`;
        this.updateWeightSecondary('onboard-sub-target-weight', val);
      });
    }

    // Goal selection
    document.querySelectorAll('[data-goal-val]').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-goal-val');
        this.selectOptionCard('goal', val);
        this.tempProfile.goal = val;
        this.updatePlanSummary();
      });
    });

    // Activity level selection
    document.querySelectorAll('[data-onboard-activity]').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-onboard-activity');
        this.selectActivity(val);
        this.updatePlanSummary();
      });
    });

    // Pre-existing diseases selection
    document.querySelectorAll('[data-onboard-disease]').forEach(chip => {
      chip.addEventListener('click', () => {
        const disease = chip.getAttribute('data-onboard-disease');
        let current = this.tempProfile.diseases || ['none'];

        if (disease === 'none') {
          current = ['none'];
        } else {
          current = current.filter(d => d !== 'none');
          if (current.includes(disease)) {
            current = current.filter(d => d !== disease);
            if (current.length === 0) current = ['none'];
          } else {
            current.push(disease);
          }
        }
        this.selectDiseases(current);
      });
    });
  }

  static selectLanguage(lang) {
    document.querySelectorAll('[data-onboard-lang]').forEach(btn => {
      if (btn.getAttribute('data-onboard-lang') === lang) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    this.tempProfile.language = lang;
  }

  static selectOptionCard(type, value) {
    document.querySelectorAll(`[data-${type}-val]`).forEach(card => {
      if (card.getAttribute(`data-${type}-val`) === value) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  static selectActivity(activityVal) {
    document.querySelectorAll('[data-onboard-activity]').forEach(card => {
      if (card.getAttribute('data-onboard-activity') === activityVal) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
    this.tempProfile.activityLevel = activityVal;
  }

  static selectDiseases(diseasesList) {
    if (!Array.isArray(diseasesList) || diseasesList.length === 0) {
      diseasesList = ['none'];
    }
    document.querySelectorAll('[data-onboard-disease]').forEach(chip => {
      const val = chip.getAttribute('data-onboard-disease');
      if (diseasesList.includes(val)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    this.tempProfile.diseases = diseasesList;
  }

  static updateLiveBmiPreview() {
    const h = parseFloat(this.tempProfile.height) || 178;
    const w = parseFloat(this.tempProfile.weight) || 71;

    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    const bmiValEl = document.getElementById('onboard-live-bmi-val');
    const bmiBadgeEl = document.getElementById('onboard-live-bmi-badge');

    if (bmiValEl) bmiValEl.textContent = bmi;

    let category = 'Normal';
    let badgeClass = 'badge-normal';

    if (bmi < 18.5) {
      category = 'Underweight';
      badgeClass = 'badge-info';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal';
      badgeClass = 'badge-normal';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      badgeClass = 'badge-warning';
    } else {
      category = 'Obese';
      badgeClass = 'badge-warning';
    }

    if (bmiBadgeEl) {
      bmiBadgeEl.className = `status-badge ${badgeClass}`;
      bmiBadgeEl.textContent = category;
    }
  }

  static updatePlanSummary() {
    const p = this.tempProfile;
    const isMale = p.gender === 'male';

    let bmr = isMale
      ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
      : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;

    let multiplier = 1.375;
    if (p.activityLevel === 'sedentary') multiplier = 1.2;
    if (p.activityLevel === 'light') multiplier = 1.375;
    if (p.activityLevel === 'moderate') multiplier = 1.55;
    if (p.activityLevel === 'very_active') multiplier = 1.725;
    if (p.activityLevel === 'extra_active') multiplier = 1.9;

    let targetCalories = Math.round(bmr * multiplier);
    if (p.goal === 'lose_weight') targetCalories = Math.max(1350, targetCalories - 450);
    if (p.goal === 'build_muscle') targetCalories = targetCalories + 350;

    let waterLiters = ((p.weight * 0.033) + (multiplier > 1.5 ? 0.6 : 0.2)).toFixed(1);
    let waterGlasses = Math.max(6, Math.round((waterLiters * 1000) / 250));

    const calsEl = document.getElementById('onboard-summary-cals');
    const waterEl = document.getElementById('onboard-summary-water');

    if (calsEl) calsEl.textContent = `≈ ${targetCalories} kcal`;
    if (waterEl) waterEl.textContent = `${waterGlasses} glasses (${waterLiters}L)`;

    this.calculatedCalories = targetCalories;
    this.calculatedWater = waterGlasses;
  }

  static goToStep(stepNumber) {
    // Validate Step 2 (Name & Age) before moving forward
    if (this.currentStep === 2 && stepNumber > 2) {
      const name = document.getElementById('onboard-name')?.value.trim();
      const age = parseInt(this.tempProfile.age) || 26;
      if (!name) {
        AuthService.showToast('Please enter your full name', 'warning');
        return;
      }
      this.tempProfile.name = name;
      this.tempProfile.age = age;
    }

    this.currentStep = stepNumber;

    // Update progress indicator bar
    const indicator = document.getElementById('onboard-progress-indicator');
    if (indicator) {
      const pct = ((stepNumber - 1) / (this.totalSteps - 1)) * 100;
      indicator.style.width = `${pct}%`;
    }

    // Update step header texts
    const pill = document.getElementById('onboard-step-badge-pill');
    const topic = document.getElementById('onboard-step-topic-name');
    if (pill) pill.textContent = `Tab ${stepNumber} of ${this.totalSteps}`;
    if (topic) topic.textContent = this.stepTitles[stepNumber] || '';

    // Update node states (1 to 6)
    for (let step = 1; step <= this.totalSteps; step++) {
      const node = document.getElementById(`step-node-${step}`);
      const stepView = document.getElementById(`onboarding-step-${step}`);
      if (node) {
        if (step === stepNumber) {
          node.className = 'step-circle active';
          node.textContent = step;
        } else if (step < stepNumber) {
          node.className = 'step-circle completed';
          node.textContent = '✓';
        } else {
          node.className = 'step-circle';
          node.textContent = step;
        }
      }
      if (stepView) {
        if (step === stepNumber) {
          stepView.classList.add('active');
        } else {
          stepView.classList.remove('active');
        }
      }
    }

    // Sync the top tab nav buttons active/completed states
    document.querySelectorAll('[data-onboard-tab]').forEach(btn => {
      const tabNum = parseInt(btn.getAttribute('data-onboard-tab'));
      btn.classList.remove('active', 'completed');
      if (tabNum === stepNumber) {
        btn.classList.add('active');
      } else if (tabNum < stepNumber) {
        btn.classList.add('completed');
      }
    });

    if (stepNumber === 6) {
      this.updatePlanSummary();
    }
  }

  static completeOnboarding() {
    this.updatePlanSummary();
    const p = this.tempProfile;

    const userWeight = parseFloat(p.weight) || 71;
    let targetW = parseFloat(p.targetWeight);
    if (!targetW || isNaN(targetW)) {
      targetW = p.goal === 'build_muscle' ? userWeight + 5 : (p.goal === 'lose_weight' ? userWeight - 5 : userWeight);
    }

    StorageService.update(state => {
      state.profile = {
        ...state.profile,
        ...p,
        weight: userWeight,
        targetWeight: targetW,
        startingWeight: userWeight,
        dailyCalorieTarget: this.calculatedCalories || 2000,
        dailyWaterTarget: this.calculatedWater || 8
      };

      // Keep progress history clean - user records their own weekly progress entries
      state.progressHistory = state.progressHistory || [];

      state.auth.isAuthenticated = true;
      state.auth.hasCompletedOnboarding = true;
      if (!state.auth.user) {
        state.auth.user = {
          id: 'usr_' + Date.now(),
          name: p.name || 'User',
          email: '',
          provider: 'email'
        };
      } else {
        state.auth.user.name = p.name || state.auth.user.name || 'User';
      }

      // Unlock pioneer badge
      const pioneerBadge = state.gamification.badges.find(b => b.id === 'b_onboard');
      if (pioneerBadge) pioneerBadge.unlocked = true;

      return state;
    });

    AuthService.showToast(`Welcome aboard, ${p.name}! Your dashboard is ready.`, 'success');
    AuthService.showView('dashboard-layout-view');
  }
}
