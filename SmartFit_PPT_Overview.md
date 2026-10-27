# 🏋️ SmartFit — Full Project Overview
### Capstone Project | Complete Technical Reference for PPT Preparation

---

## 1. 📌 Project Identity

| Property | Detail |
|---|---|
| **Project Name** | SmartFit – Personal Health & Fitness Web Application |
| **Type** | Full-Stack Web Application (Frontend SPA + Cloud Backend) |
| **Purpose** | An all-in-one fitness companion that tracks diet, workouts, hydration, BMI, body measurements, progress, and achievements — personalized to the user's health profile |
| **Target Users** | Fitness enthusiasts, students, gym-goers, and health-conscious individuals |
| **Development Stage** | Fully functional, production-deployed |
| **Live Deployment** | Netlify (via `netlify.toml` config) |
| **Local Dev URL** | http://localhost:5173 (Vite dev server) |

---

## 2. 🛠️ Technology Stack

### Frontend

| Technology | Role |
|---|---|
| **HTML5** | Application structure (single `index.html` — ~152 KB) |
| **Vanilla CSS** | Custom design system with CSS variables, dark-mode tokens, glassmorphism |
| **Vanilla JavaScript (ES Modules)** | All business logic, state management, UI interactivity |
| **Vite 6.2** | Build tool — bundles and optimizes the app for production |

### Backend / Cloud

| Technology | Role |
|---|---|
| **Supabase** | Cloud Backend-as-a-Service (PostgreSQL database + Auth) |
| **Supabase Auth** | Email/Password + Google OAuth2 sign-in |
| **Supabase PostgreSQL** | Persistent cloud storage for meals, workouts, water logs, progress |
| **localStorage** | In-browser state fallback for offline/unauthenticated usage |

### Libraries (npm)

| Library | Version | Purpose |
|---|---|---|
| `@supabase/supabase-js` | ^2.116.0 | Supabase SDK for auth and database CRUD |
| `jsPDF` | ^4.2.1 | Generate downloadable multi-page PDF health reports |

### Python Module (Capstone Integration)

| File | Purpose |
|---|---|
| `python/bmi_calculator.py` | BMI calculation engine — Metric & Imperial, WHO classification, healthy weight ranges |
| `python/measurements.py` | Full biometrics: Mifflin-St Jeor BMR, TDEE, calorie targets, hydration, disease advisories |
| `python/server.py` | Standalone REST API microservice (`/api/bmi`, `/api/measurements`) using Python stdlib only |
| `python/main.py` | Interactive CLI terminal app for demonstrating and testing calculations |

---

## 3. 🗂️ File & Folder Structure

```
CapstoneProject/
│
├── index.html                  # Single-page app shell (152 KB) — all tabs embedded
│
├── scripts/                    # All JavaScript modules (18 files)
│   ├── app.js                  # Master bootstrapper, routing, navigation controller
│   ├── auth.js                 # Authentication (email/password + Google OAuth)
│   ├── supabase.js             # Supabase client initialization
│   ├── storage.js              # State manager (in-memory + localStorage + Supabase sync)
│   ├── db.js                   # Supabase CRUD helpers (meals, water, workouts, progress)
│   ├── onboarding.js           # 6-step progressive onboarding wizard
│   ├── dashboard.js            # Dashboard metrics, mission tracker, activity chart
│   ├── diet.js                 # Meal logging, nutrition database, calorie totals
│   ├── workout.js              # Workout studio controller, live sessions, timers
│   ├── workout-data.js         # Exercise database (gym + home) + SVG humanoid illustrations
│   ├── water.js                # Smart hydration tracker, reminders, streak counter
│   ├── bmi.js                  # BMI Calculator module (metric & imperial)
│   ├── measurements.js         # Biometric analytics: BMR, TDEE, disease advisories
│   ├── progress.js             # Weight timeline, goal tracking, photo comparison
│   ├── achievements.js         # XP system, level progression, badges gallery
│   ├── settings.js             # User profile settings and export to PDF
│   ├── pdfExport.js            # jsPDF-powered health report generator
│   └── i18n.js                 # Multi-language support (EN, HI, ES, FR, DE)
│
├── styles/                     # CSS design system (5 files)
│   ├── main.css                # Global tokens, reset, typography, layout
│   ├── auth.css                # Login/signup page styles
│   ├── dashboard.css           # Dashboard layout and widget styles
│   ├── modules.css             # All tab/module-specific styles (60 KB)
│   └── responsive.css          # Mobile breakpoints and responsive overrides
│
├── python/                     # Python implementation of core health algorithms
│   ├── bmi_calculator.py       # BMI engine (metric + imperial)
│   ├── measurements.py         # Full biometrics analytics class
│   ├── server.py               # Zero-dependency REST API server
│   ├── main.py                 # CLI application
│   └── README.md               # Python module documentation
│
├── public/
│   └── _redirects              # Netlify redirect rules (SPA fallback)
│
├── package.json                # npm config, build scripts, dependencies
├── netlify.toml                # Netlify deployment config (build command + publish dir)
└── dist/                       # Production build output (generated by Vite)
```

---

## 4. 🔐 Authentication System (`auth.js` + `supabase.js`)

### Sign-In Methods
- **Email & Password** — Traditional form-based auth
- **Google OAuth2** — One-click social sign-in
- **Session Persistence** — Auto-refreshing JWT tokens managed by Supabase SDK
- **URL Reset (`?reset=1`)** — Clears stuck sessions safely

### Auth Flow
```
User visits site
    → checkSession() called
    → Valid session? → handleSuccessfulLogin() → show Dashboard
    → No session?   → showView('auth-view') → show Login screen
```

### Auth State Events
- `supabase.auth.onAuthStateChange` — Handles OAuth redirects, token refresh, sign-out
- On SIGNED_OUT → clears localStorage, shows login view

---

## 5. 🗄️ State Management (`storage.js`)

SmartFit uses a **3-layer persistence strategy**:

| Layer | What it stores | When used |
|---|---|---|
| **In-memory cache** | Live app state during session | Always (fastest read) |
| **localStorage** | Serialized JSON of full state | Offline fallback, fast reload |
| **Supabase PostgreSQL** | Meals, workouts, water, progress | Cloud sync per user |

### Default App State Schema
```javascript
{
  auth:           { isAuthenticated, user, hasCompletedOnboarding },
  profile:        { name, gender, age, height, weight, targetWeight, bodyFat,
                    goal, activityLevel, diseases, language, units,
                    dailyCalorieTarget, dailyWaterTarget },
  todayMetrics:   { caloriesConsumed, caloriesBurned, waterGlasses,
                    exercisesCompleted, healthScore },
  missions:       [ { id, title, completed, xp } ],
  weeklyActivity: [ { day, calories, adherence, isToday } ],
  meals:          { breakfast:[], lunch:[], dinner:[], snacks:[] },
  workouts:       [],
  progressHistory:[],
  gamification:   { xp, level, badges:[] },
  notifications:  []
}
```

### Supabase Database Tables
| Table | Key Columns |
|---|---|
| `meals` | id, user_id, meal_type, name, calories, protein, carbs, fat, log_date |
| `water_logs` | id, user_id, glasses, ml, log_date |
| `workouts` | id, user_id, name, category, duration, calories_burned, sets, reps, log_date |
| `progress_history` | id, user_id, weight, note, log_date |

---

## 6. 🧭 Navigation & Routing (`app.js`)

- **Single-Page Architecture** — All tab content pre-exists in `index.html`; JavaScript shows/hides panes
- **9 Application Tabs**: Dashboard, Diet, Workout, Water, Progress, BMI, Achievements, Measurements, Settings
- **Sidebar navigation links** with `data-tab` attributes drive routing
- **Custom event system** — `smartfit:navigate`, `smartfit:state-changed`, `smartfit:lang-changed`
- **Header breadcrumb** updates on every tab switch

---

## 7. 🎯 Onboarding Module (`onboarding.js`)

A **6-step progressive wizard** shown to new users after first login:

| Step | Title | Data Collected |
|---|---|---|
| 1 | Language Preference | Language selection (EN/HI/ES/FR/DE) |
| 2 | Personal Details & Age | Name, gender, age |
| 3 | Physical Measurements | Height (cm), weight (kg), target weight, body fat % |
| 4 | Daily Activity Level | Sedentary / Light / Moderate / Very Active / Extremely Active |
| 5 | Health History & Conditions | Pre-existing diseases (7 conditions) |
| 6 | Fitness Goal & Baseline | Lose Weight / Build Muscle / Stay Fit / Boost Stamina |

---

## 8. 📊 Dashboard Module (`dashboard.js`)

### Key Features
- **Live metrics cards** — Calories consumed, calories burned, water intake, exercises done
- **Daily Mission Tracker** — 4 auto-synced missions with real-time completion state
- **Weekly Adherence Chart** — SVG bar chart showing Mon–Sun daily progress
- **Smart Recommendation Engine** — Contextual tip based on current day progress
- **XP & Gamification Sidebar** — Live XP bar and level display

### Daily Missions
1. Drink 8 glasses of water
2. Burn 400+ kcal through workout
3. Meet daily calorie intake target
4. Complete 30-min workout session

---

## 9. 🥗 Diet & Nutrition Module (`diet.js`)

### Food Database — 24 Pre-loaded Items
Oatmeal, Boiled Egg, Scrambled Eggs, Grilled Chicken Breast, Brown Rice, White Basmati Rice, Whole Wheat Roti, Paneer, Yellow Dal, Salmon Fillet, Greek Yogurt, Whey Protein Shake, Peanut Butter, Avocado, Banana, Apple, Mixed Salad, Whole Milk, Almonds, Tofu, Sweet Potato, Whole Wheat Pasta, Protein Bar, Mixed Nuts

Each food has: `id, name, icon (emoji), portion, calories, protein (g), carbs (g), fats (g)`

### Features
- **4 meal categories**: Breakfast, Lunch, Dinner, Snacks
- **Real-time food search modal**
- **Quantity scaling** — calories auto-scale with quantity
- **Running nutrition totals** — live calorie/protein/carbs/fats tallied
- **Supabase cloud sync** on every add/delete

---

## 10. 💪 Workout Studio (`workout.js` + `workout-data.js`)

### Exercise Database (`workout-data.js` — 66 KB)
- **Gym mode**: Chest, Back, Shoulders, Biceps, Triceps, Legs, Abs
- **Home mode**: Push-ups, Squats, Planks, Mountain Climbers, Burpees, Lunges, etc.
- **20+ SVG humanoid illustrations** — custom animated vector figures showing correct form

### Live Session Engine
| Feature | Detail |
|---|---|
| Per-set countdown timer | Default 45 seconds, configurable |
| Rest timer between sets | Default 60 seconds, pause/resume |
| Session stopwatch | Total elapsed workout time |
| Calorie burn estimation | Real-time cumulative estimate |
| Set completion tracker | Current set / total sets display |
| Celebration animation | Fireworks effect on workout completion |

---

## 11. 💧 Smart Hydration Tracker (`water.js`)

### Features
- **Personalized daily water goal**: `weight x 0.033L + activity bonus`
- **Visual fluid bottle** — animated fill effect
- **Quick log buttons**: 125ml, 250ml, 500ml
- **Custom amount entry** modal
- **Intelligent reminders** — scheduled alerts with snooze and countdown timer
- **Reminder & intake history** log panels
- **Daily hydration streak tracker**
- **Wake/sleep time** configuration for smart reminder scheduling

---

## 12. 📏 BMI Calculator Module (`bmi.js`)

### Calculation Formulas
| Unit System | BMI Formula |
|---|---|
| **Metric** | `BMI = weight (kg) / (height in m) squared` |
| **Imperial** | `BMI = (703 x weight in lbs) / (height in inches) squared` |

### WHO BMI Classifications
| BMI Range | Category | Display Color |
|---|---|---|
| Less than 18.5 | Underweight | Cyan |
| 18.5 to 24.9 | Normal Weight | Green |
| 25.0 to 29.9 | Overweight | Orange |
| 30.0 and above | Obese Range | Orange/Red |

### Features
- Dual unit toggle (Metric / Imperial)
- Interactive sliders for height and weight
- Live BMI readout as sliders move
- Healthy weight range display
- Personalized clinical advice text
- "Save to Profile" button

---

## 13. 🧬 Measurements & Biometrics Module (`measurements.js`)

### Calculations Performed
| Metric | Formula Used |
|---|---|
| **BMI** | weight / (height_m squared) |
| **BMR (Male)** | 10xW + 6.25xH - 5xage + 5 (Mifflin-St Jeor) |
| **BMR (Female)** | 10xW + 6.25xH - 5xage - 161 (Mifflin-St Jeor) |
| **TDEE** | BMR x activity multiplier |
| **Calorie Target (Lose Weight)** | max(1350, TDEE - 450) |
| **Calorie Target (Build Muscle)** | TDEE + 350 |
| **Water Target** | weight x 0.033L + activity bonus |
| **Healthy Weight Range** | 18.5 x h squared to 24.9 x h squared |

### Activity Multipliers (Harris-Benedict Scale)
| Level | Multiplier |
|---|---|
| Sedentary | 1.2x |
| Lightly Active | 1.375x |
| Moderately Active | 1.55x |
| Very Active | 1.725x |
| Extremely Active | 1.9x |

### Clinical Disease Advisory Panel
Personalized guidance for 7 conditions:
- Diabetes, Cardiovascular Disease, Hypertension (High BP)
- Asthma, Thyroid Disorder, Arthritis / Joint Pain, High Cholesterol

---

## 14. 📈 Progress Tracker (`progress.js`)

### Features
- **Weight Timeline** — chronological weekly log entries
- **Goal Progress Bar** — current weight vs. target weight visualization
- **Weekly Entry Modal** — date, weight (kg), notes, optional photo upload
- **Photo Comparison Panel** — before/after side-by-side image view
- **Legacy data cleaner** — removes fake/demo seed data automatically
- **Full Supabase CRUD sync** — insert, update, delete all cloud-synced

---

## 15. 🏆 Achievements & Gamification (`achievements.js`)

### XP System
- Level = floor(totalXP / 100) + 1
- XP progress bar within each level shown live

### Badges
| Badge | Icon | Unlock Condition |
|---|---|---|
| Hydration Hero | Water Drop | Drink 8+ glasses in a day |
| Calorie Crusher | Fire | Burn 400+ kcal through workouts |
| 7-Day Streak | Lightning | Log activity 7 consecutive days |
| Profile Pioneer | Target | Complete health onboarding |
| Fit Master | Trophy | Reach 1,000 total XP |

---

## 16. Settings & Profile Manager (`settings.js`)

### Configurable Fields
Name, Language, Gender, Age, Height, Weight, Target Weight, Body Fat Percentage, Fitness Goal, Activity Level, Daily Calorie Target, Daily Water Target, Pre-existing medical conditions

### Export Feature
- Triggers PDF export via jsPDF — downloads full A4 health report

---

## 17. 📄 PDF Report Generator (`pdfExport.js`)

Built with **jsPDF** library:
- **A4 portrait** multi-page PDF
- **Branded header banner** (SmartFit blue, generation date)
- **Sections covered**: User Profile, Daily Metrics, Meals Logged, Workouts Completed, Progress History
- **100% client-side** — no server required to generate the PDF
- **Vector graphics** — fully resolution-independent output

---

## 18. 🌐 Internationalization (`i18n.js` — 530 lines)

- **5 Languages**: English, Hindi, Spanish, French, German
- **530 lines** of translation strings covering all UI text
- **Runtime language switching** — triggers re-render without page reload
- **Language persisted** in user profile and localStorage
- **Header dropdown** and Measurements tab both provide language switching UI

---

## 19. Python Integration

The Python layer is a **standalone algorithmic implementation** — demonstrates multi-language proficiency for the Capstone project.

### Key Formulas Implemented in Python
- BMI (metric & imperial)
- Mifflin-St Jeor BMR (gender-specific variants)
- Activity-weighted TDEE
- Goal-adjusted daily calorie target
- Personalized hydration target
- Healthy weight range calculation
- All 7 chronic disease clinical advisories

### REST API Endpoints (python/server.py)

POST /api/bmi
  - Input: unit (metric/imperial), height, weight
  - Output: bmi score, category, clinical advice, healthy weight range

POST /api/measurements
  - Input: age, gender, height, weight, activity_level, goal, diseases list
  - Output: bmi, bmr_kcal, tdee_kcal, calorie_target, water_intake, healthy_weight_range, disease_advisories

GET /health
  - Output: service status and available endpoints

---

## 20. 🚀 Deployment

### Build & Deploy Pipeline
```
Source Code (JS/CSS/HTML)
    → npm run build       (Vite bundles into /dist)
    → Netlify Deploy      (reads netlify.toml → publishes /dist)
    → SPA Redirect Rule   (all routes → index.html, status 200)
    → Live on Netlify URL
```

### Production Bundle Sizes (gzip compressed)
| Asset | Gzip Size |
|---|---|
| index.html | 25.4 KB |
| index.css | 12.2 KB |
| Main app JS | 245 KB |
| jsPDF library | 53.6 KB |
| html2canvas | 48 KB |
| DOMPurify | 11.2 KB |

---

## 21. 📊 Project Statistics Summary

| Metric | Value |
|---|---|
| Total JavaScript modules | 18 files |
| Total CSS stylesheets | 5 files |
| Total Python files | 4 files |
| Total lines of JS code | 6,500+ lines |
| Total lines of Python | 350+ lines |
| Food items in nutrition DB | 24 |
| Exercise SVG illustrations | 20+ |
| Supported UI languages | 5 |
| Supabase database tables | 4 |
| Application tabs / modules | 9 |
| Fitness goal options | 4 |
| Tracked health conditions | 7 |
| Achievement badges | 5 |

---

## 22. 💡 Suggested PPT Slide Structure

| Slide No. | Slide Title | Content Source |
|---|---|---|
| 1 | Title Slide | SmartFit logo, team name, date |
| 2 | Problem Statement | Why fitness tracking matters |
| 3 | Solution Overview | What SmartFit does |
| 4 | Tech Stack | Section 2 table |
| 5 | System Architecture | 3-layer persistence + Supabase diagram |
| 6 | Authentication & Security | Section 4 |
| 7 | Onboarding Flow | 6-step wizard — Section 7 |
| 8 | Dashboard & Missions | Section 8 |
| 9 | Diet & Nutrition Tracker | Section 9 + food database |
| 10 | Workout Studio | Section 10 + SVG humanoids |
| 11 | Hydration Tracker | Section 11 |
| 12 | BMI Calculator | Section 12 + formulas table |
| 13 | Measurements & Biometrics | Section 13 + clinical advisories |
| 14 | Progress & Photo Comparison | Section 14 |
| 15 | Gamification & Achievements | Section 15 |
| 16 | Multi-language Support | Section 18 — 5 languages |
| 17 | PDF Report Export | Section 17 |
| 18 | Python Integration | Section 19 — algorithms + API |
| 19 | Deployment & Build | Section 20 — Netlify pipeline |
| 20 | Project Statistics | Section 21 — numbers at a glance |
| 21 | Demo / Live App | http://localhost:5173 or Netlify URL |
| 22 | Conclusion & Future Scope | Mobile app, AI recommendations, wearables |

---

SmartFit Capstone Project — Complete Technical Overview
Prepared for detailed PPT presentation.
