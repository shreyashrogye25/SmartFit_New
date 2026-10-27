/* ==========================================================================
   SMARTFIT - Diet & Nutrition Service
   Meal logging, searchable food nutrition database, automatic quantity
   scaling, and direct dashboard synchronization.
   ========================================================================== */

import { StorageService } from './storage.js';
import { AuthService } from './auth.js';
import { dbInsertMeal, dbDeleteMeal } from './db.js';

export const FOOD_DATABASE = [
  { id: 'f1', name: 'Oatmeal / Rolled Oats', icon: '🥣', portion: '1 bowl (40g dry)', calories: 150, protein: 5, carbs: 27, fats: 3 },
  { id: 'f2', name: 'Boiled Egg', icon: '🥚', portion: '1 large egg', calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3 },
  { id: 'f3', name: 'Scrambled Eggs (with butter/oil)', icon: '🍳', portion: '2 eggs portion', calories: 182, protein: 12.6, carbs: 1.5, fats: 14 },
  { id: 'f4', name: 'Grilled Chicken Breast', icon: '🍗', portion: '100g cooked', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { id: 'f5', name: 'Brown Rice', icon: '🍚', portion: '1 cup cooked (150g)', calories: 215, protein: 5, carbs: 45, fats: 1.8 },
  { id: 'f6', name: 'White Basmati Rice', icon: '🍚', portion: '1 cup cooked (150g)', calories: 205, protein: 4.2, carbs: 45, fats: 0.4 },
  { id: 'f7', name: 'Whole Wheat Roti / Chapati', icon: '🫓', portion: '1 medium roti', calories: 104, protein: 3.1, carbs: 20, fats: 1.2 },
  { id: 'f8', name: 'Paneer (Cottage Cheese)', icon: '🧀', portion: '100g fresh', calories: 265, protein: 18.3, carbs: 4.1, fats: 20 },
  { id: 'f9', name: 'Cooked Yellow Dal / Lentils', icon: '🍲', portion: '1 bowl (150g)', calories: 165, protein: 9.2, carbs: 28, fats: 2.5 },
  { id: 'f10', name: 'Salmon Fillet', icon: '🐟', portion: '100g grilled', calories: 208, protein: 20.4, carbs: 0, fats: 13.4 },
  { id: 'f11', name: 'Greek Yogurt (Plain)', icon: '🥛', portion: '1 cup (170g)', calories: 130, protein: 17, carbs: 6, fats: 4 },
  { id: 'f12', name: 'Whey Protein Shake', icon: '🥤', portion: '1 scoop (30g)', calories: 120, protein: 24, carbs: 2, fats: 1.5 },
  { id: 'f13', name: 'Peanut Butter', icon: '🥜', portion: '1 tbsp (16g)', calories: 94, protein: 4, carbs: 3.1, fats: 8 },
  { id: 'f14', name: 'Avocado', icon: '🥑', portion: '1/2 medium (100g)', calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
  { id: 'f15', name: 'Banana', icon: '🍌', portion: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
  { id: 'f16', name: 'Apple', icon: '🍎', portion: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { id: 'f17', name: 'Mixed Green Salad with Olive Oil', icon: '🥗', portion: '1 bowl (120g)', calories: 85, protein: 2, carbs: 8, fats: 5 },
  { id: 'f18', name: 'Whole Cow Milk', icon: '🥛', portion: '1 glass (250ml)', calories: 150, protein: 8, carbs: 12, fats: 8 },
  { id: 'f19', name: 'Almonds', icon: '🌰', portion: 'Handful (28g / 23 nuts)', calories: 164, protein: 6, carbs: 6.1, fats: 14.2 },
  { id: 'f20', name: 'Tofu (Firm)', icon: '🧊', portion: '100g raw', calories: 83, protein: 10, carbs: 2.3, fats: 5.3 },
  { id: 'f21', name: 'Sweet Potato (Boiled/Baked)', icon: '🍠', portion: '1 medium (130g)', calories: 112, protein: 2, carbs: 26, fats: 0.1 },
  { id: 'f22', name: 'Whole Wheat Pasta', icon: '🍝', portion: '1 cup cooked (140g)', calories: 174, protein: 7.5, carbs: 37, fats: 0.8 },
  { id: 'f23', name: 'Protein Bar', icon: '🍫', portion: '1 bar (60g)', calories: 210, protein: 20, carbs: 22, fats: 6 },
  { id: 'f24', name: 'Mixed Nuts & Raisins', icon: '🥜', portion: '1 small pack (40g)', calories: 195, protein: 5, carbs: 18, fats: 12 }
];

export class DietService {
  static currentCategory = 'breakfast';
  static selectedFood = null;
  static currentQuantity = 1;

  static init() {
    this.render();
    this.bindEvents();

    window.addEventListener('smartfit:state-changed', () => {
      this.render();
    });
  }

  static bindEvents() {
    // Add Food buttons on each meal category card
    document.querySelectorAll('[data-add-meal-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-add-meal-cat');
        this.openAddFoodModal(cat);
      });
    });

    // Modal Add Food Form
    const form = document.getElementById('add-food-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddFoodSubmit();
      });
    }

    // Food Live Search input
    const searchInput = document.getElementById('food-search-input');
    const resultsContainer = document.getElementById('food-search-results');

    if (searchInput && resultsContainer) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          resultsContainer.style.display = 'none';
          resultsContainer.innerHTML = '';
          return;
        }

        const matches = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(query));
        if (matches.length === 0) {
          resultsContainer.innerHTML = `<div style="padding:12px; color:var(--text-muted); font-size:0.85rem; text-align:center;">No matching foods found. Enter details manually below!</div>`;
          resultsContainer.style.display = 'block';
          return;
        }

        resultsContainer.innerHTML = matches.slice(0, 7).map(f => `
          <div class="food-search-item" data-select-id="${f.id}">
            <div class="food-item-left">
              <span class="food-item-icon">${f.icon}</span>
              <div>
                <div class="food-item-name">${f.name}</div>
                <div class="food-item-portion">${f.portion}</div>
              </div>
            </div>
            <span class="food-item-badge">${f.calories} kcal</span>
          </div>
        `).join('');

        resultsContainer.style.display = 'block';
      });

      // Delegation for clicking search results
      resultsContainer.addEventListener('click', (e) => {
        const itemEl = e.target.closest('[data-select-id]');
        if (itemEl) {
          const foodId = itemEl.getAttribute('data-select-id');
          const found = FOOD_DATABASE.find(f => f.id === foodId);
          if (found) {
            this.selectFood(found);
            resultsContainer.style.display = 'none';
            searchInput.value = '';
          }
        }
      });

      // Hide results if clicking outside
      document.addEventListener('click', (e) => {
        if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
          resultsContainer.style.display = 'none';
        }
      });
    }

    // Modal quick food suggestion pills
    document.querySelectorAll('.food-suggestion-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const foodId = pill.getAttribute('data-food-id');
        const found = FOOD_DATABASE.find(f => f.id === foodId);
        if (found) {
          this.selectFood(found);
        }
      });
    });

    // Quantity Stepper controls
    const minusBtn = document.getElementById('btn-food-qty-minus');
    const plusBtn = document.getElementById('btn-food-qty-plus');
    const qtyInput = document.getElementById('food-quantity-val');

    if (minusBtn && qtyInput) {
      minusBtn.addEventListener('click', () => {
        let val = parseFloat(qtyInput.value) || 1;
        val = Math.max(0.25, val - (val > 1 ? 0.5 : 0.25));
        qtyInput.value = val;
        this.updateQuantity(val);
      });
    }

    if (plusBtn && qtyInput) {
      plusBtn.addEventListener('click', () => {
        let val = parseFloat(qtyInput.value) || 1;
        val = Math.min(20, val + (val >= 1 ? 0.5 : 0.25));
        qtyInput.value = val;
        this.updateQuantity(val);
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value) || 1;
        if (val < 0.1) val = 0.1;
        this.updateQuantity(val);
      });
    }

    // Reset Food Selection button
    const clearBtn = document.getElementById('btn-clear-food-selection');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearFoodSelection();
      });
    }

    // Delete meal item delegation
    document.querySelectorAll('.meal-items-list').forEach(list => {
      list.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.meal-item-delete');
        if (delBtn) {
          const mealId = delBtn.getAttribute('data-meal-id');
          const category = delBtn.getAttribute('data-cat');
          this.deleteFoodItem(category, mealId);
        }
      });
    });
  }

  static selectFood(food) {
    this.selectedFood = food;
    this.currentQuantity = 1;

    const previewCard = document.getElementById('selected-food-preview-card');
    const titleEl = document.getElementById('selected-food-title');
    const portionEl = document.getElementById('selected-food-portion-base');
    const qtyInput = document.getElementById('food-quantity-val');
    const customFieldsWrap = document.getElementById('custom-food-fields-wrap');

    if (titleEl) titleEl.textContent = `${food.icon} ${food.name}`;
    if (portionEl) portionEl.textContent = `Standard Portion: ${food.portion}`;
    if (qtyInput) qtyInput.value = 1;

    if (previewCard) previewCard.style.display = 'block';
    if (customFieldsWrap) customFieldsWrap.style.display = 'none';

    this.updateQuantity(1);
  }

  static updateQuantity(qty) {
    this.currentQuantity = qty;

    if (this.selectedFood) {
      const scaledCals = Math.round(this.selectedFood.calories * qty);
      const scaledProt = Math.round(this.selectedFood.protein * qty * 10) / 10;
      const scaledCarbs = Math.round(this.selectedFood.carbs * qty * 10) / 10;
      const scaledFats = Math.round(this.selectedFood.fats * qty * 10) / 10;

      const calsEl = document.getElementById('selected-food-cals');
      const protEl = document.getElementById('selected-food-prot');
      const carbsEl = document.getElementById('selected-food-carbs');
      const fatsEl = document.getElementById('selected-food-fats');

      if (calsEl) calsEl.textContent = scaledCals;
      if (protEl) protEl.textContent = `${scaledProt}g`;
      if (carbsEl) carbsEl.textContent = `${scaledCarbs}g`;
      if (fatsEl) fatsEl.textContent = `${scaledFats}g`;

      // Keep hidden/standard inputs synchronized
      const nameInp = document.getElementById('food-input-name');
      const calInp = document.getElementById('food-input-cals');
      const protInp = document.getElementById('food-input-protein');
      const carbInp = document.getElementById('food-input-carbs');
      const fatInp = document.getElementById('food-input-fats');

      const portionLabel = qty === 1 ? this.selectedFood.portion : `${qty} servings (${this.selectedFood.portion})`;
      if (nameInp) nameInp.value = `${this.selectedFood.name} (${portionLabel})`;
      if (calInp) calInp.value = scaledCals;
      if (protInp) protInp.value = Math.round(scaledProt);
      if (carbInp) carbInp.value = Math.round(scaledCarbs);
      if (fatInp) fatInp.value = Math.round(scaledFats);
    }
  }

  static clearFoodSelection() {
    this.selectedFood = null;
    this.currentQuantity = 1;

    const previewCard = document.getElementById('selected-food-preview-card');
    const customFieldsWrap = document.getElementById('custom-food-fields-wrap');
    const nameInp = document.getElementById('food-input-name');
    const calInp = document.getElementById('food-input-cals');

    if (previewCard) previewCard.style.display = 'none';
    if (customFieldsWrap) customFieldsWrap.style.display = 'block';
    if (nameInp) nameInp.value = '';
    if (calInp) calInp.value = '';
  }

  static render() {
    const state = StorageService.getState();
    const meals = state.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };

    let totalCals = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(cat => {
      const listEl = document.getElementById(`meal-list-${cat}`);
      const calsBadge = document.getElementById(`meal-cals-${cat}`);
      const items = meals[cat] || [];

      let catCals = 0;
      if (listEl) listEl.innerHTML = '';

      if (items.length === 0 && listEl) {
        listEl.innerHTML = `<div style="color:var(--text-subtle);font-size:0.85rem;padding:8px 0;">No items logged yet.</div>`;
      } else if (listEl) {
        items.forEach(item => {
          catCals += (item.calories || 0);
          totalProtein += (item.protein || 0);
          totalCarbs += (item.carbs || 0);
          totalFats += (item.fats || 0);

          const row = document.createElement('div');
          row.className = 'meal-item-row';
          row.innerHTML = `
            <span class="meal-item-name">${item.name}</span>
            <div style="display:flex;align-items:center;gap:12px;">
              <span class="meal-item-cals">${item.calories} kcal</span>
              <button class="meal-item-delete" data-cat="${cat}" data-meal-id="${item.id}" title="Remove">✕</button>
            </div>
          `;
          listEl.appendChild(row);
        });
      }

      if (calsBadge) calsBadge.textContent = `${catCals} kcal`;
      totalCals += catCals;
    });

    // Update Macro summary cards
    const totalCalEl = document.getElementById('diet-macro-total-cals');
    const protEl = document.getElementById('diet-macro-protein');
    const carbEl = document.getElementById('diet-macro-carbs');
    const fatEl = document.getElementById('diet-macro-fats');

    if (totalCalEl) totalCalEl.textContent = totalCals;
    if (protEl) protEl.textContent = `${totalProtein}g`;
    if (carbEl) carbEl.textContent = `${totalCarbs}g`;
    if (fatEl) fatEl.textContent = `${totalFats}g`;
  }

  static openAddFoodModal(category) {
    this.currentCategory = category;
    this.clearFoodSelection();

    const modal = document.getElementById('modal-add-food');
    const catTitle = document.getElementById('modal-food-category-title');
    const searchInput = document.getElementById('food-search-input');

    if (catTitle) {
      catTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    if (searchInput) {
      searchInput.value = '';
    }
    if (modal) {
      modal.classList.add('active');
    }
  }

  static handleAddFoodSubmit() {
    const nameInp = document.getElementById('food-input-name');
    const calInp = document.getElementById('food-input-cals');
    const protInp = document.getElementById('food-input-protein');
    const carbInp = document.getElementById('food-input-carbs');
    const fatInp = document.getElementById('food-input-fats');

    const name = nameInp?.value.trim();
    const calories = parseInt(calInp?.value) || 0;
    const protein = parseInt(protInp?.value) || 0;
    const carbs = parseInt(carbInp?.value) || 0;
    const fats = parseInt(fatInp?.value) || 0;

    if (!name || calories <= 0) {
      AuthService.showToast('Please select or enter a food name with positive calories', 'warning');
      return;
    }

    const newItem = {
      id: 'food_' + Date.now(),
      name,
      calories,
      protein,
      carbs,
      fats
    };

    StorageService.update(state => {
      if (!state.meals[this.currentCategory]) {
        state.meals[this.currentCategory] = [];
      }
      state.meals[this.currentCategory].push(newItem);

      // Re-sum total calories and sync to todayMetrics
      let sum = 0;
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(c => {
        (state.meals[c] || []).forEach(m => sum += (m.calories || 0));
      });
      state.todayMetrics.caloriesConsumed = sum;

      return state;
    });

    // Persist to Supabase (fire-and-forget)
    dbInsertMeal(this.currentCategory, newItem).catch(() => {});

    // Close modal & reset
    const modal = document.getElementById('modal-add-food');
    if (modal) modal.classList.remove('active');
    this.clearFoodSelection();

    AuthService.showToast(`Logged ${name} (${calories} kcal, ${protein}g protein)! 🥗`, 'success');
  }

  static deleteFoodItem(category, mealId) {
    StorageService.update(state => {
      if (state.meals[category]) {
        state.meals[category] = state.meals[category].filter(i => i.id !== mealId);
      }
      // Re-sum
      let sum = 0;
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(c => {
        (state.meals[c] || []).forEach(m => sum += (m.calories || 0));
      });
      state.todayMetrics.caloriesConsumed = sum;

      return state;
    });

    // Persist to Supabase (fire-and-forget)
    dbDeleteMeal(mealId).catch(() => {});

    AuthService.showToast('Food item removed.', 'info');
  }
}
