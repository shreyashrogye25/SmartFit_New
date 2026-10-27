/* ==========================================================================
   SMARTFIT - Supabase Data Service
   Row-level insert/delete helpers for meals, water, workouts, and progress.
   All operations are fire-and-forget: they don't block the UI.
   ========================================================================== */

import { supabase } from './supabase.js';
import { StorageService } from './storage.js';

function getUserId() {
  return StorageService.getState()?.auth?.user?.id || null;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─── MEALS ────────────────────────────────────────────────────────────────────

export async function dbInsertMeal(mealType, item) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('meals').insert({
    id: item.id,
    user_id: userId,
    meal_type: mealType,
    name: item.name,
    calories: item.calories || 0,
    protein: item.protein || 0,
    carbs: item.carbs || 0,
    fat: item.fats || item.fat || 0,
    log_date: today()
  });
  if (error) console.warn('[DB] insertMeal error:', error.message);
}

export async function dbDeleteMeal(mealId) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('meals').delete()
    .eq('id', mealId).eq('user_id', userId);
  if (error) console.warn('[DB] deleteMeal error:', error.message);
}

// ─── WATER LOGS ───────────────────────────────────────────────────────────────

export async function dbUpsertWater(glasses, ml) {
  const userId = getUserId();
  if (!userId) return;
  // We store one row per day per user; update if exists
  const { data: existing } = await supabase.from('water_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('log_date', today())
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from('water_logs')
      .update({ glasses, ml })
      .eq('id', existing.id);
    if (error) console.warn('[DB] updateWater error:', error.message);
  } else {
    const { error } = await supabase.from('water_logs').insert({
      user_id: userId,
      glasses,
      ml,
      log_date: today()
    });
    if (error) console.warn('[DB] insertWater error:', error.message);
  }
}

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────

export async function dbInsertWorkout(workoutItem) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('workouts').insert({
    id: workoutItem.id,
    user_id: userId,
    name: workoutItem.name,
    category: workoutItem.category || 'general',
    duration: workoutItem.duration || 0,
    calories_burned: workoutItem.caloriesBurned || 0,
    sets: workoutItem.sets || null,
    reps: workoutItem.reps || null,
    log_date: today()
  });
  if (error) console.warn('[DB] insertWorkout error:', error.message);
}

export async function dbDeleteWorkout(workoutId) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('workouts').delete()
    .eq('id', workoutId).eq('user_id', userId);
  if (error) console.warn('[DB] deleteWorkout error:', error.message);
}

// ─── PROGRESS HISTORY ─────────────────────────────────────────────────────────

export async function dbInsertProgress(entry) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('progress_history').insert({
    id: entry.id,
    user_id: userId,
    weight: entry.weight,
    note: entry.note || '',
    log_date: entry.date || today()
  });
  if (error) console.warn('[DB] insertProgress error:', error.message);
}

export async function dbDeleteProgress(entryId) {
  const userId = getUserId();
  if (!userId) return;
  const { error } = await supabase.from('progress_history').delete()
    .eq('id', entryId).eq('user_id', userId);
  if (error) console.warn('[DB] deleteProgress error:', error.message);
}

export async function dbUpdateProgress(entryId, fields) {
  const userId = getUserId();
  if (!userId) return;
  const update = {};
  if (fields.weight !== undefined) update.weight = fields.weight;
  if (fields.note !== undefined) update.note = fields.note;
  if (fields.date !== undefined) update.log_date = fields.date;
  const { error } = await supabase.from('progress_history').update(update)
    .eq('id', entryId).eq('user_id', userId);
  if (error) console.warn('[DB] updateProgress error:', error.message);
}
