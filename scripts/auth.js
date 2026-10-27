/* ==========================================================================
   SMARTFIT - Authentication Service
   Supabase Email/Password + Google OAuth + Session Handlers
   ========================================================================== */

import { supabase } from './supabase.js';
import { StorageService } from './storage.js';

export class AuthService {
  static isHandlingLogin = false;

  static init() {
    this.bindEvents();
    this.checkSession();

    // Listen for Supabase auth state changes (OAuth redirect, token refresh, initial session, sign-out)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') && session) {
        this.cleanAuthUrl();
        await this.handleSuccessfulLogin(session);
      } else if (event === 'SIGNED_OUT') {
        StorageService.logoutUser();
        this.showView('auth-view');
      }
    });
  }

  static cleanAuthUrl() {
    try {
      const url = new URL(window.location.href);
      let changed = false;

      // Clean OAuth query params
      ['code', 'state', 'error', 'error_code', 'error_description'].forEach(key => {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      });

      // Clean OAuth hash fragments
      if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error='))) {
        url.hash = '';
        changed = true;
      }

      if (changed) {
        const cleanPath = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '');
        window.history.replaceState({}, document.title, cleanPath);
      }
    } catch (_) {}
  }

  static bindEvents() {
    // Mode toggle via Top Tabs (Sign In vs Create Account)
    const modeTabs = document.querySelectorAll('[data-auth-mode-tab]');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetMode = tab.getAttribute('data-auth-mode-tab');
        this.setAuthMode(targetMode);
      });
    });

    // Mode toggle via footer link ("Create account" / "Sign in")
    const toggleLinks = document.querySelectorAll('[data-auth-toggle]');
    toggleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('auth-submit-btn');
        const currentMode = submitBtn?.getAttribute('data-mode') || 'signin';
        this.setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
      });
    });

    // Form submission (Email & Password)
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleStandardAuth();
      });
    }

    // Google Sign-In button
    const googleBtn = document.getElementById('btn-google-auth');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        this.handleGoogleAuth();
      });
    }

    // Logout button in sidebar
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  static async checkSession() {
    // 1. Allow ?reset=1 in URL to force clean logout (clears stuck sessions)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === '1') {
      try { await supabase.auth.signOut(); } catch (_) {}
      StorageService.logoutUser();
      window.history.replaceState({}, '', window.location.pathname);
      this.showView('auth-view');
      return;
    }

    // 2. Check for OAuth callback errors in URL query or hash
    const hashStr = window.location.hash ? window.location.hash.substring(1) : '';
    const hashParams = new URLSearchParams(hashStr);
    const oauthError = urlParams.get('error') || hashParams.get('error');
    const oauthErrorDesc = urlParams.get('error_description') || hashParams.get('error_description');

    if (oauthError) {
      console.warn('[AuthService] Google OAuth callback error:', oauthError, oauthErrorDesc);
      this.cleanAuthUrl();
      const msg = oauthError === 'access_denied'
        ? 'Google sign-in was cancelled or access was denied.'
        : `Google sign-in failed: ${decodeURIComponent(oauthErrorDesc || oauthError).replace(/\+/g, ' ')}`;
      this.showToast(msg, 'warning');
      this.showView('auth-view');
      return;
    }

    // 3. Indicate OAuth processing if returning with auth code or access token
    const hasOAuthParams = urlParams.has('code') || hashParams.has('access_token');
    const googleBtn = document.getElementById('btn-google-auth');
    if (hasOAuthParams && googleBtn) {
      googleBtn.style.opacity = '0.7';
      googleBtn.innerHTML = `
        <span style="display:inline-block;width:14px;height:14px;border:2px solid #CBD5E1;border-top-color:#2563EB;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></span>
        Signing in with Google...
      `;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        this.cleanAuthUrl();
        await this.handleSuccessfulLogin(session);
      } else {
        if (hasOAuthParams && error) {
          console.warn('[AuthService] OAuth exchange error:', error);
          this.cleanAuthUrl();
          this.showToast('Google sign-in could not be completed. Please try again.', 'warning');
        }
        const state = StorageService.getState();
        if (state?.auth?.isAuthenticated) {
          if (!state.auth.hasCompletedOnboarding) {
            this.showView('onboarding-view');
          } else {
            this.showView('dashboard-layout-view');
          }
        } else {
          this.showView('auth-view');
        }
      }
    } catch (err) {
      console.warn('[AuthService] checkSession error:', err);
      const state = StorageService.getState();
      if (state?.auth?.isAuthenticated) {
        this.showView(state.auth.hasCompletedOnboarding ? 'dashboard-layout-view' : 'onboarding-view');
      } else {
        this.showView('auth-view');
      }
    } finally {
      if (hasOAuthParams) {
        this.resetGoogleBtn();
      }
    }
  }

  /**
   * Switches auth UI mode between 'signin' and 'signup'
   */
  static setAuthMode(mode) {
    const isSignUp = mode === 'signup';
    const submitBtn = document.getElementById('auth-submit-btn');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const togglePrompt = document.getElementById('auth-toggle-prompt');
    const toggleLink = document.getElementById('auth-toggle-link');
    const nameGroup = document.getElementById('auth-name-group');
    const nameInput = document.getElementById('auth-name');
    const passwordInput = document.getElementById('auth-password');

    // Update top tabs
    const tabSignIn = document.getElementById('auth-tab-signin');
    const tabSignUp = document.getElementById('auth-tab-signup');
    if (tabSignIn && tabSignUp) {
      if (isSignUp) {
        tabSignIn.classList.remove('active');
        tabSignUp.classList.add('active');
      } else {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
      }
    }

    if (isSignUp) {
      // Create Account Mode
      if (submitBtn) {
        submitBtn.setAttribute('data-mode', 'signup');
        submitBtn.textContent = 'Create Account';
      }
      if (title) title.textContent = 'Create Your Account';
      if (subtitle) subtitle.textContent = 'Sign up to start your personalized fitness journey';
      if (togglePrompt) togglePrompt.textContent = 'Already have an account? ';
      if (toggleLink) toggleLink.textContent = 'Sign in';
      if (nameGroup) nameGroup.style.display = 'block';
      if (nameInput) nameInput.required = true;
      if (passwordInput) passwordInput.placeholder = 'Create a password (min. 6 chars)';
    } else {
      // Sign In Mode
      if (submitBtn) {
        submitBtn.setAttribute('data-mode', 'signin');
        submitBtn.textContent = 'Sign In';
      }
      if (title) title.textContent = 'Welcome Back';
      if (subtitle) subtitle.textContent = 'Sign in to access your personal fitness metrics';
      if (togglePrompt) togglePrompt.textContent = "Don't have an account? ";
      if (toggleLink) toggleLink.textContent = 'Create account';
      if (nameGroup) nameGroup.style.display = 'none';
      if (nameInput) nameInput.required = false;
      if (passwordInput) passwordInput.placeholder = 'Enter your password';
    }
  }

  static toggleAuthMode() {
    const submitBtn = document.getElementById('auth-submit-btn');
    const currentMode = submitBtn?.getAttribute('data-mode') || 'signin';
    this.setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
  }

  static async handleStandardAuth() {
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const nameInput = document.getElementById('auth-name');
    const submitBtn = document.getElementById('auth-submit-btn');
    const isSignUp = submitBtn?.getAttribute('data-mode') === 'signup';

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '';

    if (!email || !password) {
      this.showToast('Please enter both email and password', 'warning');
      return;
    }

    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    if (isSignUp && !name) {
      this.showToast('Please enter your full name', 'warning');
      return;
    }

    // Disable button during request
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isSignUp ? 'Creating account...' : 'Signing in...';
    }

    try {
      if (isSignUp) {
        // ── Sign Up ──────────────────────────────────────────────
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });

        if (error) throw error;

        if (data?.session) {
          this.showToast(`Account created! Welcome to SmartFit ✨`, 'success');
          await this.handleSuccessfulLogin(data.session);
        } else if (data?.user) {
          // Auto-confirm trigger confirms email, try immediate sign in
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInErr && signInData?.session) {
            this.showToast(`Account created! Welcome to SmartFit ✨`, 'success');
            await this.handleSuccessfulLogin(signInData.session);
          } else {
            this.showToast('Account created! Please sign in with your email and password.', 'success');
            this.setAuthMode('signin');
          }
        }
      } else {
        // ── Sign In ──────────────────────────────────────────────
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        await this.handleSuccessfulLogin(data.session);
      }
    } catch (err) {
      console.error('[AuthService] Auth error:', err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Incorrect email or password. Please check your details or create an account.';
      } else if (msg.includes('User already registered')) {
        msg = 'An account with this email already exists. Please sign in instead.';
        this.setAuthMode('signin');
      }
      this.showToast(msg, 'warning');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignUp ? 'Create Account' : 'Sign In';
      }
    }
  }

  static async handleGoogleAuth() {
    const googleBtn = document.getElementById('btn-google-auth');

    if (googleBtn) {
      googleBtn.style.opacity = '0.7';
      googleBtn.disabled = true;
      googleBtn.innerHTML = `
        <span style="display:inline-block;width:14px;height:14px;border:2px solid #CBD5E1;border-top-color:#2563EB;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></span>
        Connecting to Google...
      `;
    }

    try {
      // Standard OAuth redirect URI (root of current origin)
      const redirectUrl = window.location.origin + '/';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });

      if (error) throw error;

      // In case browser redirect didn't fire automatically
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('[AuthService] Google OAuth error:', err);
      this.showToast('Google sign-in failed: ' + (err.message || 'Please check your connection and try again.'), 'warning');
      this.resetGoogleBtn();
    }
  }

  static resetGoogleBtn() {
    const googleBtn = document.getElementById('btn-google-auth');
    if (!googleBtn) return;
    googleBtn.style.opacity = '1';
    googleBtn.disabled = false;
    googleBtn.innerHTML = `
      <svg class="svg-icon-sm" viewBox="0 0 24 24" style="stroke:none;fill:currentColor;">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      <span data-i18n="continueGoogle">Continue with Google</span>
    `;
  }

  static async handleSuccessfulLogin(session) {
    if (this.isHandlingLogin) return;
    this.isHandlingLogin = true;

    try {
      const { isNew, state } = await StorageService.loginUser(session);
      const displayName = state.profile?.name || state.auth?.user?.name || session.user?.email?.split('@')[0] || 'User';

      if (isNew || !state.auth?.hasCompletedOnboarding) {
        this.showToast(`Welcome, ${displayName}! Let's set up your profile ✨`, 'success');
        this.showView('onboarding-view');
        const onboardName = document.getElementById('onboard-name');
        if (onboardName) onboardName.value = state.profile?.name || displayName;
      } else {
        this.showToast(`Welcome back, ${displayName}!`, 'success');
        this.showView('dashboard-layout-view');
      }
    } catch (err) {
      console.error('[AuthService] handleSuccessfulLogin error:', err);
    } finally {
      this.isHandlingLogin = false;
    }
  }

  static async logout() {
    StorageService.logoutUser();
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthService] Supabase signOut error:', err);
    }

    // Clear form inputs
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const nameInput = document.getElementById('auth-name');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (nameInput) nameInput.value = '';

    this.setAuthMode('signin');
    this.showToast('You have been logged out.', 'info');
    this.showView('auth-view');
  }

  static showView(viewId) {
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }
  }

  static showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}
