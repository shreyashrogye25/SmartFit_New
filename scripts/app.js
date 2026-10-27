/* ==========================================================================
   SMARTFIT - Application Controller
   Routing, modular tabs, notifications dropdown, i18n, and master bootstrap
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { OnboardingService } from './onboarding.js';
import { DashboardService } from './dashboard.js';
import { DietService } from './diet.js';
import { WorkoutService } from './workout.js';
import { WaterService } from './water.js';
import { BmiService } from './bmi.js';
import { AchievementsService } from './achievements.js';
import { SettingsService } from './settings.js';
import { MeasurementsService } from './measurements.js';
import { ProgressService } from './progress.js';
import { I18nService } from './i18n.js';

export class App {
  static init() {
    I18nService.init();
    AuthService.init();
    OnboardingService.init();
    DashboardService.init();
    DietService.init();
    WorkoutService.init();
    WaterService.init();
    BmiService.init();
    ProgressService.init();
    AchievementsService.init();
    MeasurementsService.init();
    SettingsService.init();

    this.bindNavigation();
    this.bindNotifications();
    this.bindHeaderLanguageDropdown();
    this.bindModalDismissals();

    window.App = App;
    window.AuthService = AuthService;
    window.StorageService = StorageService;
    window.OnboardingService = OnboardingService;

    window.addEventListener('smartfit:navigate', (e) => {
      this.switchTab(e.detail);
    });

    // Restore last visited tab from URL hash or localStorage (ignoring OAuth callback fragments)
    const rawHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const isOAuthHash = rawHash.includes('access_token=') || rawHash.includes('error=');
    const hash = (!isOAuthHash && rawHash) ? rawHash : '';
    const savedTab = hash ? `tab-${hash}` : (localStorage.getItem('smartfit_active_tab') || 'tab-dashboard');
    if (savedTab && document.getElementById(savedTab)) {
      this.switchTab(savedTab);
    }
  }

  static bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });
  }

  static switchTab(tabId) {
    if (!tabId) return;

    // 1. Update active sidebar link
    document.querySelectorAll('.nav-link[data-tab]').forEach(l => {
      if (l.getAttribute('data-tab') === tabId) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    // 2. Hide all tab content panes and reveal target
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.style.display = 'none';
    });

    const target = document.getElementById(tabId);
    if (target) {
      target.style.display = 'block';
    }

    // Persist active tab across refreshes
    try {
      localStorage.setItem('smartfit_active_tab', tabId);
      const cleanSlug = tabId.replace('tab-', '');
      if (window.location.hash !== `#${cleanSlug}`) {
        window.history.replaceState(null, '', `#${cleanSlug}`);
      }
    } catch (_) {}

    // Update header breadcrumb
    const bc = document.getElementById('dash-header-breadcrumb');
    if (bc) {
      const tabTitle = tabId.replace('tab-', '').toUpperCase();
      bc.textContent = `SMARTFIT / ${tabTitle}`;
    }
  }

  static bindHeaderLanguageDropdown() {
    const btn = document.getElementById('header-lang-toggle-btn');
    const menu = document.getElementById('header-lang-dropdown');

    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.style.display === 'none' || !menu.style.display;
        menu.style.display = isHidden ? 'flex' : 'none';
      });

      document.querySelectorAll('.lang-drop-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = opt.getAttribute('data-lang-val');
          I18nService.setLanguage(lang, true);
          menu.style.display = 'none';
        });
      });

      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
          menu.style.display = 'none';
        }
      });
    }
  }

  static bindNotifications() {
    const bellBtn = document.getElementById('header-notification-btn');
    const panel = document.getElementById('notifications-dropdown-panel');

    if (bellBtn && panel) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === 'none' || !panel.style.display ? 'block' : 'none';
        // Hide badge dot
        const dot = bellBtn.querySelector('.notification-dot');
        if (dot) dot.style.display = 'none';
      });

      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !bellBtn.contains(e.target)) {
          panel.style.display = 'none';
        }
      });
    }

    // Populate notifications
    this.renderNotifications();
  }

  static renderNotifications() {
    const list = document.getElementById('notifications-items-list');
    if (!list) return;

    const state = StorageService.getState();
    const notifications = state.notifications || [];

    list.innerHTML = '';
    notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = `notification-dropdown-item ${n.unread ? 'unread' : ''}`;
      item.innerHTML = `
        <div style="font-weight:700;font-size:0.86rem;color:var(--text-heading);">${n.title}</div>
        <div style="font-size:0.8rem;color:var(--text-muted);">${n.message}</div>
        <div style="font-size:0.72rem;color:var(--text-subtle);margin-top:2px;">${n.time}</div>
      `;
      list.appendChild(item);
    });
  }

  static bindModalDismissals() {
    // Generic modal close buttons
    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Close when clicking outside of modal container
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}
