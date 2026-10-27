/* ==========================================================================
   SMARTFIT - Dedicated BMI Calculator Service
   Metric/Imperial units, dynamic spectrum scale, and profile sync
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';

export class BmiService {
  static unit = 'metric'; // 'metric' or 'imperial'

  static init() {
    this.bindEvents();
    this.syncFromProfile();

    window.addEventListener('smartfit:state-changed', () => {
      this.syncFromProfile();
    });
  }

  static syncFromProfile() {
    const state = StorageService.getState();
    const h = state.profile.height || 175;
    const w = state.profile.weight || 70;

    const hSlider = document.getElementById('bmi-slider-height');
    const wSlider = document.getElementById('bmi-slider-weight');
    const hVal = document.getElementById('bmi-val-height');
    const wVal = document.getElementById('bmi-val-weight');

    if (hSlider) hSlider.value = h;
    if (wSlider) wSlider.value = w;
    if (hVal) hVal.textContent = `${h} cm`;
    if (wVal) wVal.textContent = `${w} kg`;

    this.calculate();
  }

  static bindEvents() {
    // Unit Switcher
    const metricBtn = document.getElementById('unit-btn-metric');
    const imperialBtn = document.getElementById('unit-btn-imperial');

    if (metricBtn && imperialBtn) {
      metricBtn.addEventListener('click', () => {
        this.unit = 'metric';
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        this.updateUnitLabels();
        this.calculate();
      });

      imperialBtn.addEventListener('click', () => {
        this.unit = 'imperial';
        imperialBtn.classList.add('active');
        metricBtn.classList.remove('active');
        this.updateUnitLabels();
        this.calculate();
      });
    }

    // Sliders
    const hSlider = document.getElementById('bmi-slider-height');
    const wSlider = document.getElementById('bmi-slider-weight');

    if (hSlider) {
      hSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const disp = document.getElementById('bmi-val-height');
        if (disp) disp.textContent = this.unit === 'metric' ? `${val} cm` : `${val} in`;
        this.calculate();
      });
    }

    if (wSlider) {
      wSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const disp = document.getElementById('bmi-val-weight');
        if (disp) disp.textContent = this.unit === 'metric' ? `${val} kg` : `${val} lbs`;
        this.calculate();
      });
    }

    // Save to Profile button
    const saveBtn = document.getElementById('bmi-btn-save-profile');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveToProfile());
    }
  }

  static updateUnitLabels() {
    const hSlider = document.getElementById('bmi-slider-height');
    const wSlider = document.getElementById('bmi-slider-weight');
    const hLabel = document.getElementById('bmi-label-height');
    const wLabel = document.getElementById('bmi-label-weight');
    const hDisp = document.getElementById('bmi-val-height');
    const wDisp = document.getElementById('bmi-val-weight');

    if (this.unit === 'metric') {
      if (hLabel) hLabel.textContent = 'Height (cm)';
      if (wLabel) wLabel.textContent = 'Weight (kg)';
      if (hSlider) { hSlider.min = 100; hSlider.max = 230; hSlider.value = 175; }
      if (wSlider) { wSlider.min = 35; wSlider.max = 180; wSlider.value = 70; }
      if (hDisp) hDisp.textContent = '175 cm';
      if (wDisp) wDisp.textContent = '70 kg';
    } else {
      if (hLabel) hLabel.textContent = 'Height (inches)';
      if (wLabel) wLabel.textContent = 'Weight (lbs)';
      if (hSlider) { hSlider.min = 40; hSlider.max = 90; hSlider.value = 69; }
      if (wSlider) { wSlider.min = 80; wSlider.max = 380; wSlider.value = 154; }
      if (hDisp) hDisp.textContent = '69 in';
      if (wDisp) wDisp.textContent = '154 lbs';
    }
  }

  static calculate() {
    const h = parseFloat(document.getElementById('bmi-slider-height')?.value) || 175;
    const w = parseFloat(document.getElementById('bmi-slider-weight')?.value) || 70;

    let bmi = 22.4;
    let healthyWeightMin = 56;
    let healthyWeightMax = 76;

    if (this.unit === 'metric') {
      const hM = h / 100;
      bmi = (w / (hM * hM)).toFixed(1);
      healthyWeightMin = Math.round(18.5 * hM * hM);
      healthyWeightMax = Math.round(24.9 * hM * hM);
    } else {
      bmi = ((703 * w) / (h * h)).toFixed(1);
      healthyWeightMin = Math.round((18.5 * h * h) / 703);
      healthyWeightMax = Math.round((24.9 * h * h) / 703);
    }

    // Display
    const readout = document.getElementById('bmi-module-result-num');
    const badge = document.getElementById('bmi-module-category-badge');
    const advice = document.getElementById('bmi-module-advice-text');
    const rangeText = document.getElementById('bmi-module-healthy-range');

    if (readout) readout.textContent = bmi;

    let cat = 'Normal Weight';
    let badgeClass = 'badge-green';
    let tip = 'Your BMI is in the healthy spectrum. Keep maintaining your wholesome diet and active exercise routine!';

    if (bmi < 18.5) {
      cat = 'Underweight';
      badgeClass = 'badge-cyan';
      tip = 'You are below the standard weight range. Consider adding calorie-dense, nutrient-rich foods and resistance training.';
    } else if (bmi >= 18.5 && bmi < 25) {
      cat = 'Normal Weight';
      badgeClass = 'badge-green';
      tip = 'Your BMI is in the optimal healthy range. Continue your balanced lifestyle and regular hydration!';
    } else if (bmi >= 25 && bmi < 30) {
      cat = 'Overweight';
      badgeClass = 'badge-orange';
      tip = 'Slightly above the normal range. Moderate aerobic activity and portion control will help you reach your ideal target.';
    } else {
      cat = 'Obese Range';
      badgeClass = 'badge-orange';
      tip = 'Consult a certified fitness specialist or nutritionist for a structured cardiovascular and dietary plan.';
    }

    if (badge) {
      badge.className = `badge ${badgeClass}`;
      badge.textContent = cat;
    }
    if (advice) advice.textContent = tip;
    if (rangeText) {
      const unitStr = this.unit === 'metric' ? 'kg' : 'lbs';
      rangeText.textContent = `${healthyWeightMin} - ${healthyWeightMax} ${unitStr}`;
    }
  }

  static saveToProfile() {
    const h = parseFloat(document.getElementById('bmi-slider-height')?.value) || 175;
    const w = parseFloat(document.getElementById('bmi-slider-weight')?.value) || 70;

    // Convert to metric for storage consistency
    const heightCm = this.unit === 'metric' ? h : Math.round(h * 2.54);
    const weightKg = this.unit === 'metric' ? w : Math.round(w / 2.205);

    StorageService.update(state => {
      state.profile.height = heightCm;
      state.profile.weight = weightKg;
      return state;
    });

    AuthService.showToast('Profile updated with new height and weight metrics! 🎯', 'success');
  }
}
