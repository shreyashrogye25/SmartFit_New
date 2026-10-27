/* ==========================================================================
   SMARTFIT - Storage & State Management
   Supabase-backed persistence with in-memory + localStorage fallback
   ========================================================================== */

import { supabase } from './supabase.js';

const STORAGE_KEY = 'smartfit_app_state';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDayName = daysOfWeek[new Date().getDay()];

export const DEFAULT_STATE = {
  auth: {
    isAuthenticated: false,
    user: null, // { id, name, email, avatar, provider }
    hasCompletedOnboarding: false
  },
  profile: {
    name: '',
    gender: 'male',
    age: 26,
    height: 175, // in cm
    weight: 70,  // in kg
    targetWeight: 68,
    bodyFat: 18, // in percentage
    goal: 'stay_fit', // 'lose_weight', 'build_muscle', 'stay_fit', 'stamina'
    activityLevel: 'moderate', // 'sedentary', 'light', 'moderate', 'very_active', 'extra_active'
    diseases: ['none'], // array of condition keys
    language: 'en', // 'en', 'hi', 'es', 'fr', 'de'
    units: 'metric', // 'metric' or 'imperial'
    dailyCalorieTarget: 2000,
    dailyWaterTarget: 8 // glasses (2000ml)
  },
  todayMetrics: {
    caloriesConsumed: 0,
    caloriesBurned: 0,
    waterGlasses: 0,
    exercisesCompleted: 0,
    healthScore: 0
  },
  missions: [
    { id: 'm_water', title: 'Drink 8 glasses of water (2,000 ml)', completed: false, xp: 20 },
    { id: 'm_burn', title: 'Burn 400 kcal through workout & active movement', completed: false, xp: 25 },
    { id: 'm_cal', title: 'Meet daily caloric intake target (2,000 kcal)', completed: false, xp: 20 },
    { id: 'm_workout', title: 'Complete 30-min workout training session', completed: false, xp: 25 }
  ],
  weeklyActivity: [
    { day: 'Mon', calories: 0, adherence: 0, isToday: currentDayName === 'Mon' },
    { day: 'Tue', calories: 0, adherence: 0, isToday: currentDayName === 'Tue' },
    { day: 'Wed', calories: 0, adherence: 0, isToday: currentDayName === 'Wed' },
    { day: 'Thu', calories: 0, adherence: 0, isToday: currentDayName === 'Thu' },
    { day: 'Fri', calories: 0, adherence: 0, isToday: currentDayName === 'Fri' },
    { day: 'Sat', calories: 0, adherence: 0, isToday: currentDayName === 'Sat' },
    { day: 'Sun', calories: 0, adherence: 0, isToday: currentDayName === 'Sun' }
  ],
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  },
  workouts: [],
  progressHistory: [],
  hydration: {
    todayLogs: [],
    reminderHistory: [],
    nextReminderTime: null,
    nextReminderMl: 250,
    wakeTime: '07:00',
    sleepTime: '23:00',
    streak: 0,
    lastLoggedDate: null
  },
  gamification: {
    xp: 0,
    level: 1,
    badges: [
      { id: 'b_hydra', title: 'Hydration Hero', desc: 'Drink 8 glasses of water in a day', icon: '💧', unlocked: false },
      { id: 'b_cal', title: 'Calorie Crusher', desc: 'Burn 500 kcal through workouts', icon: '🔥', unlocked: false },
      { id: 'b_streak', title: '7-Day Streak', desc: 'Log activity 7 days continuously', icon: '⚡', unlocked: false },
      { id: 'b_onboard', title: 'Profile Pioneer', desc: 'Complete health onboarding setup', icon: '🎯', unlocked: false },
      { id: 'b_master', title: 'Fit Master', desc: 'Reach 1,000 XP in SmartFit', icon: '🏆', unlocked: false }
    ]
  },
  notifications: []
};

// ─── In-memory cache ──────────────────────────────────────────────────────────
let _memState = null;

function freshDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export class StorageService {
  static ACTIVE_EMAIL_KEY = 'smartfit_active_email';

  // ─── Helpers ──────────────────────────────────────────────────────────────

  static normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  static getActiveEmail() {
    return localStorage.getItem(this.ACTIVE_EMAIL_KEY) || null;
  }

  static _dispatch(state) {
    window.dispatchEvent(new CustomEvent('smartfit:state-changed', { detail: state }));
  }

  // ─── Synchronous getState / saveState (used by all existing modules) ────────

  static getState() {
    if (_memState) return _memState;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        _memState = JSON.parse(raw);
        if (!_memState.hydration) _memState.hydration = freshDefault().hydration;
        if (!_memState.meals) _memState.meals = freshDefault().meals;
        if (!Array.isArray(_memState.workouts)) _memState.workouts = [];
        if (!Array.isArray(_memState.progressHistory)) _memState.progressHistory = [];
        return _memState;
      }
    } catch (_) { /* ignore */ }

    _memState = freshDefault();
    return _memState;
  }

  static saveState(state) {
    _memState = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
    this._dispatch(state);

    // Fire-and-forget: persist profile+gamification to Supabase if authenticated
    if (state?.auth?.isAuthenticated && state?.auth?.user?.id) {
      this._persistToSupabase(state).catch(err =>
        console.warn('[Supabase] Background save error:', err)
      );
    }
  }

  static update(updater) {
    const currentState = this.getState();
    const newState = updater(currentState) || currentState;
    this.saveState(newState);
    return newState;
  }

  // ─── Supabase persistence (background, non-blocking) ────────────────────

  static async _persistToSupabase(state) {
    const userId = state?.auth?.user?.id;
    if (!userId) return;

    const today = new Date().toISOString().slice(0, 10);
    const p = state.profile;

    // Upsert profile
    await supabase.from('profiles').upsert({
      id: userId,
      name: p.name || '',
      gender: p.gender || 'male',
      age: p.age || 26,
      height: p.height || 175,
      weight: p.weight || 70,
      target_weight: p.targetWeight || 68,
      body_fat: p.bodyFat || 18,
      goal: p.goal || 'stay_fit',
      activity_level: p.activityLevel || 'moderate',
      diseases: p.diseases || ['none'],
      language: p.language || 'en',
      units: p.units || 'metric',
      daily_calorie_target: p.dailyCalorieTarget || 2000,
      daily_water_target: p.dailyWaterTarget || 8,
      has_completed_onboarding: state.auth.hasCompletedOnboarding || false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    // Upsert gamification
    const g = state.gamification;
    await supabase.from('gamification').upsert({
      user_id: userId,
      xp: g?.xp || 0,
      level: g?.level || 1,
      badges: g?.badges || [],
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    // Upsert daily missions
    if (state.missions?.length) {
      const missionRows = state.missions.map(m => ({
        user_id: userId,
        mission_id: m.id,
        completed: m.completed || false,
        mission_date: today
      }));
      await supabase.from('daily_missions').upsert(missionRows, {
        onConflict: 'user_id,mission_id,mission_date'
      });
    }

    // Upsert weekly activity
    const weekStart = _getWeekStart();
    if (state.weeklyActivity?.length) {
      const actRows = state.weeklyActivity.map(a => ({
        user_id: userId,
        day: a.day,
        calories: a.calories || 0,
        adherence: a.adherence || 0,
        week_start: weekStart
      }));
      await supabase.from('weekly_activity').upsert(actRows, {
        onConflict: 'user_id,day,week_start'
      });
    }

    // Upsert water summary to water_logs
    if (state.todayMetrics?.waterGlasses !== undefined) {
      const glasses = state.todayMetrics.waterGlasses || 0;
      const ml = state.hydration?.todayLogs?.reduce((sum, l) => sum + (l.ml || 0), 0) || (glasses * 250);
      try {
        const { data: existing } = await supabase.from('water_logs')
          .select('id')
          .eq('user_id', userId)
          .eq('log_date', today)
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('water_logs').update({ glasses, ml }).eq('id', existing.id);
        } else if (glasses > 0 || ml > 0) {
          await supabase.from('water_logs').insert({ user_id: userId, glasses, ml, log_date: today });
        }
      } catch (_) { /* ignore */ }
    }
  }

  // ─── Full state load from Supabase ───────────────────────────────────────

  static async loadFromSupabase(userId, supabaseUser) {
    const today = new Date().toISOString().slice(0, 10);
    const weekStart = _getWeekStart();

    // Check if current local state belongs to THIS user, or if we have saved state for this email
    const localState = this.getState();
    const userEmail = this.normalizeEmail(supabaseUser.email);
    const isSameUser = localState?.auth?.user?.id === userId ||
      (userEmail && this.normalizeEmail(localState?.auth?.user?.email) === userEmail);
    const userSaved = userEmail ? this.getUserState(userEmail) : null;

    // Isolate data: if localState belongs to another user, start from clean default state
    const baseState = userSaved || (isSameUser ? localState : freshDefault());
    const state = JSON.parse(JSON.stringify(baseState || freshDefault()));

    // Guarantee default data structures exist
    if (!state.meals) state.meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    if (!state.meals.breakfast) state.meals.breakfast = [];
    if (!state.meals.lunch) state.meals.lunch = [];
    if (!state.meals.dinner) state.meals.dinner = [];
    if (!state.meals.snacks) state.meals.snacks = [];
    if (!Array.isArray(state.workouts)) state.workouts = [];
    if (!Array.isArray(state.progressHistory)) state.progressHistory = [];
    if (!state.hydration) {
      state.hydration = {
        todayLogs: [],
        reminderHistory: [],
        nextReminderTime: null,
        nextReminderMl: 250,
        wakeTime: '07:00',
        sleepTime: '23:00',
        streak: 0,
        lastLoggedDate: null
      };
    }
    if (!Array.isArray(state.hydration.todayLogs)) state.hydration.todayLogs = [];
    if (!state.todayMetrics) {
      state.todayMetrics = {
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterGlasses: 0,
        exercisesCompleted: 0,
        healthScore: 0
      };
    }

    try {
      const [
        profileRes,
        mealsRes,
        waterRes,
        workoutsRes,
        progressRes,
        gamificationRes,
        missionsRes,
        weeklyRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('meals').select('*').eq('user_id', userId).eq('log_date', today),
        supabase.from('water_logs').select('*').eq('user_id', userId).eq('log_date', today),
        supabase.from('workouts').select('*').eq('user_id', userId).eq('log_date', today),
        supabase.from('progress_history').select('*').eq('user_id', userId).order('log_date', { ascending: true }),
        supabase.from('gamification').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('daily_missions').select('*').eq('user_id', userId).eq('mission_date', today),
        supabase.from('weekly_activity').select('*').eq('user_id', userId).eq('week_start', weekStart)
      ]);

      const profile = profileRes?.data;

      // Extract Google OAuth metadata if available
      const googleName = supabaseUser?.user_metadata?.full_name ||
                         supabaseUser?.user_metadata?.name ||
                         supabaseUser?.email?.split('@')[0] || 'User';
      const googleAvatar = supabaseUser?.user_metadata?.avatar_url ||
                           supabaseUser?.user_metadata?.picture ||
                           state.auth?.user?.avatar || null;

      // Auth
      state.auth.isAuthenticated = true;
      state.auth.user = {
        id: userId,
        name: profile?.name || googleName,
        email: supabaseUser.email,
        avatar: googleAvatar,
        provider: supabaseUser.app_metadata?.provider || (supabaseUser.email?.includes('gmail') ? 'google' : 'email')
      };

      if (profile?.has_completed_onboarding !== undefined) {
        state.auth.hasCompletedOnboarding = Boolean(profile.has_completed_onboarding);
      } else if (!isSameUser) {
        // Brand new Google user without an existing cloud profile
        state.auth.hasCompletedOnboarding = false;
      }

      // Profile
      if (profile) {
        state.profile = {
          ...state.profile,
          name: profile.name || state.profile.name || googleName,
          gender: profile.gender || state.profile.gender || 'male',
          age: profile.age || state.profile.age || 26,
          height: profile.height || state.profile.height || 175,
          weight: profile.weight || state.profile.weight || 70,
          targetWeight: profile.target_weight || state.profile.targetWeight || 68,
          bodyFat: profile.body_fat || state.profile.bodyFat || 18,
          goal: profile.goal || state.profile.goal || 'stay_fit',
          activityLevel: profile.activity_level || state.profile.activityLevel || 'moderate',
          diseases: profile.diseases || state.profile.diseases || ['none'],
          language: profile.language || state.profile.language || 'en',
          units: profile.units || state.profile.units || 'metric',
          dailyCalorieTarget: profile.daily_calorie_target || state.profile.dailyCalorieTarget || 2000,
          dailyWaterTarget: profile.daily_water_target || state.profile.dailyWaterTarget || 8
        };
      } else {
        // Initialize clean profile with user's Google full name
        state.profile.name = googleName;
      }

      // Meals (today) — Merge from Supabase without overwriting local items
      if (mealsRes?.data?.length) {
        mealsRes.data.forEach(m => {
          const type = m.meal_type || 'breakfast';
          if (!state.meals[type]) state.meals[type] = [];
          const exists = state.meals[type].some(item => item.id === m.id);
          if (!exists) {
            state.meals[type].push({
              id: m.id,
              name: m.name,
              calories: m.calories || 0,
              protein: m.protein || 0,
              carbs: m.carbs || 0,
              fat: m.fat || m.fats || 0,
              fats: m.fat || m.fats || 0
            });
          }
        });
      }

      // Water (today) — Merge glasses and ml
      if (waterRes?.data?.length) {
        const totalGlasses = waterRes.data.reduce((sum, r) => sum + (r.glasses || 0), 0);
        const totalMl = waterRes.data.reduce((sum, r) => sum + (r.ml || 0), 0);
        if (totalGlasses > (state.todayMetrics.waterGlasses || 0)) {
          state.todayMetrics.waterGlasses = totalGlasses;
        }
        if (state.hydration.todayLogs.length === 0 && totalMl > 0) {
          state.hydration.todayLogs.push({
            id: 'w_' + Date.now(),
            time: '12:00 PM',
            timestamp: Date.now(),
            ml: totalMl
          });
        }
      }

      // Workouts (today) — Merge workouts
      if (workoutsRes?.data?.length) {
        workoutsRes.data.forEach(w => {
          const exists = state.workouts.some(item => item.id === w.id);
          if (!exists) {
            state.workouts.unshift({
              id: w.id,
              name: w.name,
              category: w.category || 'general',
              duration: w.duration || 0,
              caloriesBurned: w.calories_burned || 0,
              sets: w.sets || null,
              reps: w.reps || null,
              date: w.log_date || today
            });
          }
        });
        state.todayMetrics.caloriesBurned = state.workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
        state.todayMetrics.exercisesCompleted = state.workouts.length;
      }

      // Progress history — Merge without losing photo data URLs
      if (progressRes?.data?.length) {
        const dbItems = progressRes.data.map((p, idx) => {
          const localMatch = state.progressHistory.find(h => h.id === p.id || h.rawDate === p.log_date);
          const rawDate = p.log_date || today;
          const formattedDate = new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            id: p.id,
            weekNumber: idx + 1,
            rawDate: rawDate,
            date: formattedDate,
            weight: Number(p.weight),
            notes: p.note || p.notes || localMatch?.notes || '',
            note: p.note || p.notes || localMatch?.notes || '',
            photoDataUrl: localMatch?.photoDataUrl || null
          };
        });

        // Retain any local entries not yet in cloud
        state.progressHistory.forEach(lh => {
          if (!dbItems.some(di => di.id === lh.id || di.rawDate === lh.rawDate)) {
            dbItems.push(lh);
          }
        });

        dbItems.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
        dbItems.forEach((item, i) => { item.weekNumber = i + 1; });
        state.progressHistory = dbItems;
      }

      // Gamification
      if (gamificationRes?.data) {
        const gd = gamificationRes.data;
        state.gamification = {
          xp: Math.max(gd.xp || 0, state.gamification?.xp || 0),
          level: Math.max(gd.level || 1, state.gamification?.level || 1),
          badges: gd.badges || state.gamification?.badges || []
        };
      }

      // Daily missions
      if (missionsRes?.data?.length) {
        missionsRes.data.forEach(dbM => {
          const local = state.missions?.find(m => m.id === dbM.mission_id);
          if (local && dbM.completed) local.completed = true;
        });
      }

      // Weekly activity
      if (weeklyRes?.data?.length) {
        weeklyRes.data.forEach(row => {
          const local = state.weeklyActivity?.find(a => a.day === row.day);
          if (local) {
            local.calories = Math.max(local.calories || 0, row.calories || 0);
            local.adherence = Math.max(local.adherence || 0, row.adherence || 0);
          }
        });
      }
    } catch (dbErr) {
      console.warn('[StorageService] Error querying Supabase data, continuing with local state:', dbErr);
    }

    // Compute today calories consumed
    state.todayMetrics.caloriesConsumed =
      [...state.meals.breakfast, ...state.meals.lunch, ...state.meals.dinner, ...state.meals.snacks]
        .reduce((s, m) => s + (m.calories || 0), 0);

    return state;
  }

  // ─── Login / Logout via Supabase Auth ────────────────────────────────────

  /**
   * Called by AuthService after Supabase confirms a session.
   * Loads full state from Supabase, merges with local state and caches it.
   */
  static async loginUser(supabaseSession) {
    const supabaseUser = supabaseSession.user;
    const userId = supabaseUser.id;

    try {
      const state = await this.loadFromSupabase(userId, supabaseUser);
      _memState = state;

      localStorage.setItem(this.ACTIVE_EMAIL_KEY, supabaseUser.email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (supabaseUser.email) {
        localStorage.setItem(`smartfit_user_${this.normalizeEmail(supabaseUser.email)}`, JSON.stringify(state));
      }

      this._dispatch(state);
      return { isNew: !state.auth.hasCompletedOnboarding, state };
    } catch (err) {
      console.error('[StorageService] loginUser error:', err);
      const fallback = this.getState();
      fallback.auth.isAuthenticated = true;
      fallback.auth.user = {
        id: userId,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email,
        provider: 'email'
      };
      _memState = fallback;
      this.saveState(fallback);
      return { isNew: !fallback.auth.hasCompletedOnboarding, state: fallback };
    }
  }

  static logoutUser() {
    // Flush current state to Supabase before logging out
    if (_memState?.auth?.isAuthenticated) {
      this._persistToSupabase(_memState).catch(() => {});
    }

    // Preserve the user's state under their email key so it's not permanently lost
    const activeEmail = this.getActiveEmail() || _memState?.auth?.user?.email;
    if (activeEmail && _memState) {
      try {
        localStorage.setItem(`smartfit_user_${this.normalizeEmail(activeEmail)}`, JSON.stringify(_memState));
      } catch (_) {}
    }

    _memState = null;
    localStorage.removeItem(this.ACTIVE_EMAIL_KEY);

    const clean = freshDefault();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clean)); } catch (_) {}
    this._dispatch(clean);
    return clean;
  }

  static resetAll() {
    const current = this.getState();
    const clean = freshDefault();

    if (current?.auth?.isAuthenticated && current?.auth?.user) {
      clean.auth.isAuthenticated = true;
      clean.auth.user = current.auth.user;
      clean.auth.hasCompletedOnboarding = false;
      clean.profile.name = current.auth.user.name || '';
    }

    this.saveState(clean);
    return clean;
  }

  // ─── Legacy compat (some modules call getUserKey / userExists) ────────────

  static getUserKey(email) {
    const normalized = this.normalizeEmail(email);
    return normalized ? `smartfit_user_${normalized}` : null;
  }

  static userExists(email) {
    const key = this.getUserKey(email);
    if (!key) return false;
    return !!localStorage.getItem(key);
  }

  static getUserState(email) {
    const key = this.getUserKey(email);
    if (!key) return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
}

// ─── Utility: get the Monday of the current week ──────────────────────────────
function _getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff);
  return mon.toISOString().slice(0, 10);
}
