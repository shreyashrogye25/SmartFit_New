/* ==========================================================================
   SMARTFIT - Workout Exercise Database
   Comprehensive catalog for Gym and Home exercises with humanoid illustrations
   ========================================================================== */

export const SVG_ILLUSTRATIONS = {
  // 1. Incline Dumbbell Press (Humanoid on 45-deg bench with dumbbells)
  inclineDumbbellPress: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#1D4ED8"/>
        </linearGradient>
      </defs>
      <!-- Background Floor & Grid -->
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
      <!-- Incline Bench (40 degrees) -->
      <path d="M45 138 L75 80 L140 125 L150 138" stroke="#334155" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line x1="75" y1="80" x2="60" y2="138" stroke="#475569" stroke-width="4"/>
      <line x1="110" y1="105" x2="110" y2="138" stroke="#475569" stroke-width="4"/>
      <rect x="70" y="74" width="75" height="10" rx="3" transform="rotate(30 70 74)" fill="#1E293B"/>
      <!-- Bench Seat -->
      <rect x="135" y="118" width="26" height="8" rx="2" fill="#1E293B"/>

      <!-- Humanoid Figure: Torso on Incline -->
      <!-- Legs -->
      <path d="M142 122 L155 132 L158 139" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <!-- Torso (Engaging Upper Chest) -->
      <path d="M85 86 L130 114" stroke="url(#primaryGlow)" stroke-width="12" stroke-linecap="round"/>
      <!-- Head -->
      <circle cx="76" cy="74" r="8" fill="#3B82F6"/>
      <!-- Upper Chest Highlight Glow -->
      <circle cx="96" cy="88" r="7" fill="#60A5FA" opacity="0.8"/>
      <!-- Arms Pressing Upward -->
      <path d="M96 90 L88 56" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
      <path d="M104 94 L114 58" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
      <!-- Dumbbells at Top of Press -->
      <!-- Dumbbell Left -->
      <rect x="78" y="52" width="20" height="4" rx="1.5" fill="#0F172A"/>
      <circle cx="78" cy="54" r="5" fill="#334155"/>
      <circle cx="98" cy="54" r="5" fill="#334155"/>
      <!-- Dumbbell Right -->
      <rect x="105" y="54" width="20" height="4" rx="1.5" fill="#0F172A"/>
      <circle cx="105" cy="56" r="5" fill="#334155"/>
      <circle cx="125" cy="56" r="5" fill="#334155"/>
      <!-- Upward Motion Arrows -->
      <path d="M88 44 L88 32 M84 36 L88 30 L92 36" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M115 44 L115 32 M111 36 L115 30 L119 36" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 2. Flat Dumbbell Bench Press
  flatDumbbellPress: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Floor -->
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
      <!-- Flat Bench -->
      <rect x="50" y="98" width="90" height="8" rx="2" fill="#1E293B"/>
      <line x1="60" y1="106" x2="60" y2="140" stroke="#475569" stroke-width="5"/>
      <line x1="130" y1="106" x2="130" y2="140" stroke="#475569" stroke-width="5"/>
      <!-- Humanoid Figure Lying Flat -->
      <!-- Legs bent to floor -->
      <path d="M135 98 L152 112 L152 140" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <!-- Torso -->
      <line x1="62" y1="94" x2="135" y2="94" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <!-- Head on bench -->
      <circle cx="54" cy="94" r="8" fill="#3B82F6"/>
      <!-- Chest Highlight -->
      <circle cx="90" cy="92" r="7" fill="#60A5FA" opacity="0.85"/>
      <!-- Arms Pressing Vertically -->
      <line x1="84" y1="92" x2="84" y2="52" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <line x1="96" y1="92" x2="96" y2="52" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <!-- Dumbbells -->
      <rect x="74" y="48" width="20" height="4" fill="#0F172A"/>
      <circle cx="74" cy="50" r="5" fill="#334155"/>
      <circle cx="94" cy="50" r="5" fill="#334155"/>
      <rect x="88" y="44" width="20" height="4" fill="#0F172A"/>
      <circle cx="88" cy="46" r="5" fill="#334155"/>
      <circle cx="108" cy="46" r="5" fill="#334155"/>
      <!-- Motion Arrows -->
      <path d="M90 38 L90 28 M86 32 L90 26 L94 32" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 3. Barbell Bench Press
  barbellBenchPress: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
      <!-- Bench Rack Uprights -->
      <line x1="68" y1="45" x2="68" y2="140" stroke="#334155" stroke-width="4"/>
      <!-- Bench Pad -->
      <rect x="48" y="98" width="94" height="8" rx="2" fill="#1E293B"/>
      <line x1="125" y1="106" x2="125" y2="140" stroke="#475569" stroke-width="5"/>
      <!-- Humanoid Figure -->
      <path d="M136 98 L154 114 L154 140" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <line x1="60" y1="94" x2="135" y2="94" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="52" cy="94" r="8" fill="#3B82F6"/>
      <circle cx="90" cy="92" r="7" fill="#60A5FA" opacity="0.8"/>
      <!-- Arms holding Barbell -->
      <path d="M90 92 L88 56" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <!-- Barbell with Weight Plates -->
      <line x1="45" y1="54" x2="140" y2="54" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      <rect x="52" y="38" width="6" height="32" rx="2" fill="#2563EB"/>
      <rect x="126" y="38" width="6" height="32" rx="2" fill="#2563EB"/>
      <path d="M89 36 L89 22 M84 27 L89 21 L94 27" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 4. Cable Chest Fly
  cableChestFly: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <!-- Cable Pulleys on Left & Right -->
      <line x1="30" y1="20" x2="30" y2="140" stroke="#334155" stroke-width="4"/>
      <line x1="170" y1="20" x2="170" y2="140" stroke="#334155" stroke-width="4"/>
      <circle cx="30" cy="50" r="6" fill="#64748B"/>
      <circle cx="170" cy="50" r="6" fill="#64748B"/>
      <!-- Tension Cables -->
      <line x1="30" y1="50" x2="88" y2="82" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2"/>
      <line x1="170" y1="50" x2="112" y2="82" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2"/>
      <!-- Standing Humanoid, Forward Stride -->
      <path d="M96 105 L85 140 M104 105 L118 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <path d="M100 106 L100 70" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="58" r="8" fill="#3B82F6"/>
      <!-- Chest Glow -->
      <circle cx="100" cy="74" r="6" fill="#60A5FA"/>
      <!-- Arcing Arms coming together -->
      <path d="M94 72 Q80 80 88 84" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M106 72 Q120 80 112 84" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <!-- Inward Fly Movement Arrows -->
      <path d="M74 88 Q88 94 94 88 M90 85 L94 88 L91 92" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M126 88 Q112 94 106 88 M110 85 L106 88 L109 92" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,

  // 5. Standard Push-ups
  standardPushups: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
      <!-- Floor Mat -->
      <rect x="35" y="133" width="130" height="4" rx="2" fill="#CBD5E1"/>
      <!-- Humanoid in Pushup Plank Position -->
      <circle cx="45" cy="126" r="4" fill="#475569"/>
      <path d="M46 126 L95 106 L140 88" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="152" cy="82" r="8" fill="#3B82F6"/>
      <circle cx="130" cy="94" r="6" fill="#60A5FA"/>
      <path d="M135 90 L132 110 L132 133" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M148 100 L148 120 M144 105 L148 99 L152 105 M144 115 L148 121 L152 115" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 6. Incline Push-ups
  inclinePushups: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <!-- Platform -->
      <rect x="135" y="90" width="35" height="10" rx="2" fill="#1E293B"/>
      <line x1="142" y1="100" x2="142" y2="140" stroke="#475569" stroke-width="4"/>
      <line x1="162" y1="100" x2="162" y2="140" stroke="#475569" stroke-width="4"/>
      <circle cx="50" cy="135" r="4" fill="#475569"/>
      <path d="M52 135 L98 105 L132 82" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="142" cy="74" r="8" fill="#3B82F6"/>
      <circle cx="122" cy="88" r="6" fill="#60A5FA"/>
      <path d="M128 86 L138 90" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <path d="M110 68 L118 78 M108 74 L110 68 L116 70" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 7. Diamond Push-ups
  diamondPushups: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3"/>
      <circle cx="45" cy="126" r="4" fill="#475569"/>
      <path d="M46 126 L95 106 L136 88" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="148" cy="82" r="8" fill="#3B82F6"/>
      <path d="M130 90 L124 112 L128 133" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="122" cy="106" r="5" fill="#38BDF8"/>
      <polygon points="128,131 133,134 128,137 123,134" fill="#F59E0B"/>
    </svg>
  `,

  // 8. Lat Pulldown (Gym Back)
  latPulldown: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <line x1="100" y1="18" x2="100" y2="40" stroke="#334155" stroke-width="5"/>
      <circle cx="100" cy="20" r="7" fill="#64748B"/>
      <path d="M60 48 Q100 42 140 48" stroke="#0F172A" stroke-width="5" stroke-linecap="round" fill="none"/>
      <rect x="85" y="105" width="30" height="8" rx="2" fill="#1E293B"/>
      <line x1="100" y1="113" x2="100" y2="140" stroke="#475569" stroke-width="5"/>
      <path d="M102 110 L115 125 L115 140" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <line x1="100" y1="106" x2="100" y2="72" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="62" r="8" fill="#3B82F6"/>
      <path d="M92 78 Q100 84 108 78" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
      <path d="M94 72 L76 52 M106 72 L124 52" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M72 58 L72 70 M68 65 L72 71 L76 65" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M128 58 L128 70 M124 65 L128 71 L132 65" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 9. Seated Cable Row (Gym Back)
  seatedCableRow: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="50" y="112" width="65" height="8" rx="2" fill="#1E293B"/>
      <rect x="135" y="100" width="8" height="24" rx="2" fill="#475569"/>
      <line x1="140" y1="102" x2="102" y2="92" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2"/>
      <path d="M75 112 L105 106 L135 108" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M75 110 L68 76" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="66" cy="64" r="8" fill="#3B82F6"/>
      <circle cx="70" cy="80" r="6" fill="#38BDF8"/>
      <path d="M72 78 L90 92 L102 92" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M110 84 L96 84 M100 80 L95 84 L100 88" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 10. Doorframe Rows (Home Back)
  doorframeRow: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="130" y="30" width="14" height="110" fill="#1E293B" rx="2"/>
      <circle cx="75" cy="138" r="4" fill="#475569"/>
      <path d="M76 138 L95 108 L114 78" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="118" cy="66" r="8" fill="#3B82F6"/>
      <path d="M112 80 L130 84" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <circle cx="106" cy="84" r="6" fill="#38BDF8"/>
      <path d="M102 68 L114 72 M108 66 L115 72 L112 77" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 11. Prone Superman Y-T-W (Home Back)
  proneSuperman: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="30" y="133" width="140" height="4" rx="2" fill="#CBD5E1"/>
      <path d="M45 118 Q80 128 100 130 Q125 128 150 114" stroke="#2563EB" stroke-width="10" stroke-linecap="round" fill="none"/>
      <circle cx="158" cy="108" r="8" fill="#3B82F6"/>
      <path d="M148 116 L168 98" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="102" cy="126" r="6" fill="#38BDF8"/>
      <path d="M165 110 L165 96 M161 101 L165 95 L169 101" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M48 112 L48 98 M44 103 L48 97 L52 103" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 12. Dumbbell Shoulder Overhead Press (Gym Shoulders)
  overheadShoulderPress: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M94 105 L88 140 M106 105 L112 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <line x1="100" y1="106" x2="100" y2="68" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="8" fill="#3B82F6"/>
      <circle cx="88" cy="68" r="6" fill="#F59E0B"/>
      <circle cx="112" cy="68" r="6" fill="#F59E0B"/>
      <path d="M90 68 L78 36" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <path d="M110 68 L122 36" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <rect x="68" y="32" width="20" height="4" fill="#0F172A"/>
      <circle cx="68" cy="34" r="5" fill="#334155"/>
      <circle cx="88" cy="34" r="5" fill="#334155"/>
      <rect x="112" y="32" width="20" height="4" fill="#0F172A"/>
      <circle cx="112" cy="34" r="5" fill="#334155"/>
      <circle cx="132" cy="34" r="5" fill="#334155"/>
      <path d="M78 26 L78 16 M74 20 L78 15 L82 20" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M122 26 L122 16 M118 20 L122 15 L126 20" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 13. Dumbbell Lateral Raise (Gym Shoulders)
  lateralRaise: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M95 106 L90 140 M105 106 L110 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <line x1="100" y1="106" x2="100" y2="68" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="8" fill="#3B82F6"/>
      <circle cx="90" cy="68" r="6" fill="#F59E0B"/>
      <circle cx="110" cy="68" r="6" fill="#F59E0B"/>
      <path d="M92 68 L50 68" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <path d="M108 68 L150 68" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <rect x="46" y="60" width="5" height="16" rx="2" fill="#0F172A"/>
      <rect x="149" y="60" width="5" height="16" rx="2" fill="#0F172A"/>
      <path d="M60 84 Q52 74 54 62 M50 67 L54 61 L58 66" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M140 84 Q148 74 146 62 M142 66 L146 61 L150 67" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,

  // 14. Pike Push-ups (Home Shoulders)
  pikePushups: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3"/>
      <circle cx="60" cy="134" r="4" fill="#475569"/>
      <path d="M62 134 L96 74" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
      <path d="M96 74 L126 108" stroke="#2563EB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="134" cy="116" r="8" fill="#3B82F6"/>
      <circle cx="122" cy="106" r="6" fill="#F59E0B"/>
      <path d="M124 108 L132 134" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <path d="M112 92 L120 102 M114 100 L121 103 L119 96" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 15. Barbell Bicep Curls (Gym Biceps)
  barbellBicepCurls: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M94 106 L88 140 M106 106 L112 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <line x1="100" y1="106" x2="100" y2="68" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="8" fill="#3B82F6"/>
      <path d="M94 70 L92 94" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <path d="M92 94 L110 74" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <circle cx="98" cy="80" r="6" fill="#10B981"/>
      <line x1="80" y1="72" x2="140" y2="72" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      <circle cx="84" cy="72" r="7" fill="#2563EB"/>
      <circle cx="136" cy="72" r="7" fill="#2563EB"/>
      <path d="M120 98 Q126 84 116 76 M115 82 L116 76 L122 79" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,

  // 16. Incline Dumbbell Curls (Gym Biceps)
  inclineDumbbellCurls: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M45 138 L75 80 L140 125" stroke="#334155" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M85 86 L130 114" stroke="#2563EB" stroke-width="12" stroke-linecap="round"/>
      <circle cx="76" cy="74" r="8" fill="#3B82F6"/>
      <path d="M96 90 L88 112 L106 100" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="98" cy="100" r="5" fill="#10B981"/>
      <rect x="104" y="94" width="16" height="4" fill="#0F172A"/>
      <circle cx="104" cy="96" r="4" fill="#334155"/>
      <circle cx="120" cy="96" r="4" fill="#334155"/>
    </svg>
  `,

  // 17. Towel Isometric Bicep Curls (Home Biceps)
  towelBicepCurls: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M94 106 L90 140 M106 106 L110 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <line x1="100" y1="106" x2="100" y2="68" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="8" fill="#3B82F6"/>
      <path d="M90 138 Q82 110 92 86 M90 138 Q118 110 108 86" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M96 70 L92 90 L102 86" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="98" cy="82" r="6" fill="#10B981"/>
    </svg>
  `,

  // 18. Tricep Rope Pushdowns (Gym Triceps)
  tricepPushdown: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <line x1="145" y1="20" x2="145" y2="140" stroke="#334155" stroke-width="4"/>
      <circle cx="145" cy="25" r="6" fill="#64748B"/>
      <line x1="145" y1="25" x2="122" y2="88" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2"/>
      <path d="M92 106 L86 140 M104 106 L108 140" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
      <line x1="98" y1="106" x2="104" y2="68" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="106" cy="56" r="8" fill="#3B82F6"/>
      <path d="M102 68 L114 88 L122 110" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="112" cy="78" r="6" fill="#EC4899"/>
      <line x1="120" y1="108" x2="128" y2="114" stroke="#F59E0B" stroke-width="3"/>
      <path d="M128 92 L128 106 M124 101 L128 107 L132 101" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 19. Chair / Bench Dips (Home Triceps)
  chairDips: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="50" y="85" width="36" height="8" rx="2" fill="#1E293B"/>
      <line x1="56" y1="93" x2="56" y2="140" stroke="#475569" stroke-width="4"/>
      <line x1="80" y1="93" x2="80" y2="140" stroke="#475569" stroke-width="4"/>
      <path d="M100 110 L128 126 L144 140" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <line x1="100" y1="110" x2="100" y2="76" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="64" r="8" fill="#3B82F6"/>
      <path d="M98 76 L86 85 L84 85" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="90" cy="78" r="6" fill="#EC4899"/>
      <path d="M112 88 L112 102 M108 92 L112 87 L116 92 M108 98 L112 103 L116 98" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 20. Barbell Back Squat (Gym Legs)
  barbellSquat: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <line x1="72" y1="140" x2="82" y2="140" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <line x1="118" y1="140" x2="128" y2="140" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <path d="M78 140 L70 114 L100 108" stroke="#64748B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M100 108 L104 74" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="106" cy="62" r="8" fill="#3B82F6"/>
      <circle cx="86" cy="112" r="7" fill="#3B82F6" opacity="0.9"/>
      <line x1="60" y1="72" x2="148" y2="72" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
      <rect x="64" y="58" width="6" height="28" rx="2" fill="#2563EB"/>
      <rect x="138" y="58" width="6" height="28" rx="2" fill="#2563EB"/>
      <path d="M102 50 L102 38 M98 44 L102 37 L106 44" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 21. Bodyweight Squats (Home Legs)
  bodyweightSquat: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <line x1="75" y1="140" x2="85" y2="140" stroke="#334155" stroke-width="4"/>
      <path d="M80 140 L74 114 L104 108" stroke="#64748B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M104 108 L108 72" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="110" cy="60" r="8" fill="#3B82F6"/>
      <path d="M104 74 L138 72" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="90" cy="112" r="7" fill="#60A5FA"/>
      <path d="M116 88 L116 100 M112 92 L116 87 L120 92 M112 96 L116 101 L120 96" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 22. Walking Lunges / Bulgarian Split Squat (Gym/Home Legs)
  lunges: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <path d="M125 140 L125 116 L98 116" stroke="#64748B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M60 138 L68 132 L98 116" stroke="#64748B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line x1="98" y1="116" x2="98" y2="74" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="98" cy="62" r="8" fill="#3B82F6"/>
      <circle cx="112" cy="116" r="6" fill="#60A5FA"/>
      <path d="M96 78 L86 92 L96 98" stroke="#1D4ED8" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 23. Glute Bridges (Home Legs/Glutes)
  gluteBridges: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="35" y="133" width="130" height="4" rx="2" fill="#CBD5E1"/>
      <circle cx="130" cy="133" r="4" fill="#334155"/>
      <line x1="130" y1="133" x2="130" y2="105" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
      <path d="M130 105 L100 95 L65 125" stroke="#2563EB" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="54" cy="128" r="8" fill="#3B82F6"/>
      <circle cx="102" cy="96" r="7" fill="#F59E0B"/>
      <path d="M100 86 L100 74 M96 79 L100 73 L104 79" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 24. Standard Plank (Abs / Core)
  plank: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="135" x2="180" y2="135" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="35" y="133" width="130" height="4" rx="2" fill="#CBD5E1"/>
      <circle cx="45" cy="126" r="4" fill="#475569"/>
      <path d="M46 126 L95 110 L138 98" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="148" cy="92" r="8" fill="#3B82F6"/>
      <path d="M132 100 L132 133 L146 133" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="95" cy="110" r="7" fill="#EF4444"/>
      <line x1="50" y1="84" x2="140" y2="84" stroke="#0284C7" stroke-dasharray="3 3" stroke-width="2"/>
    </svg>
  `,

  // 25. Hanging Leg Raises / Mountain Climbers (Abs)
  hangingLegRaises: `
    <svg viewBox="0 0 200 160" class="exercise-humanoid-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" stroke-width="3"/>
      <line x1="50" y1="20" x2="150" y2="20" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
      <line x1="90" y1="22" x2="94" y2="52" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="110" y1="22" x2="106" y2="52" stroke="#1D4ED8" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="100" y1="52" x2="100" y2="86" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
      <circle cx="100" cy="44" r="8" fill="#3B82F6"/>
      <circle cx="100" cy="74" r="6" fill="#EF4444"/>
      <path d="M100 86 L136 86" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
      <path d="M104 120 Q128 114 134 94 M128 97 L134 93 L137 99" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `
};

export const WORKOUT_DATABASE = [
  // ==========================================
  // GYM WORKOUTS - CHEST
  // ==========================================
  {
    id: 'gym-chest-1',
    name: 'Incline Dumbbell Press',
    type: 'gym',
    muscleGroup: 'chest',
    primaryMuscle: 'Upper Chest (Clavicular Head)',
    secondaryMuscles: 'Front Deltoids, Triceps',
    equipment: 'Incline Bench (30–45°) + Dumbbells',
    description: 'Primarily targets the upper chest while also engaging the anterior deltoids and triceps for powerful pushing strength.',
    illustrationKey: 'inclineDumbbellPress',
    sets: 3,
    reps: '8–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 75,
    difficulty: 'Intermediate',
    calories: 85,
    instructions: [
      'Set an adjustable bench to a 30-to-45-degree angle.',
      'Sit back with dumbbells resting on your knees, then kick them up to shoulder height as you lie back.',
      'Plant your feet firmly on the floor, retract your shoulder blades, and brace your core.',
      'Press the dumbbells upward in a controlled arc until arms are extended without locking elbows.',
      'Lower the weights steadily over 2–3 seconds until you feel a deep stretch in the upper pecs.'
    ]
  },
  {
    id: 'gym-chest-2',
    name: 'Flat Dumbbell Press',
    type: 'gym',
    muscleGroup: 'chest',
    primaryMuscle: 'Mid Pectorals',
    secondaryMuscles: 'Triceps, Front Shoulders',
    equipment: 'Flat Bench + Dumbbells',
    description: 'A cornerstone compound exercise that builds foundational chest thickness and unilateral shoulder stability.',
    illustrationKey: 'flatDumbbellPress',
    sets: 4,
    reps: '10–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 90,
    instructions: [
      'Lie flat on the bench with your feet securely on the floor and dumbbells at chest level.',
      'Keep your wrists neutral and elbows tucked at roughly 45 degrees to protect your shoulders.',
      'Exhale and drive the weights straight up over your mid-chest.',
      'Squeeze your chest at the top, then descend with steady control.'
    ]
  },
  {
    id: 'gym-chest-3',
    name: 'Barbell Bench Press',
    type: 'gym',
    muscleGroup: 'chest',
    primaryMuscle: 'Sternal & Clavicular Pectorals',
    secondaryMuscles: 'Triceps Brachii, Core',
    equipment: 'Olympic Barbell + Bench Rack',
    description: 'The premier upper-body strength benchmark for maximum chest hypertrophy and pressing output.',
    illustrationKey: 'barbellBenchPress',
    sets: 4,
    reps: '6–8 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 90,
    difficulty: 'Advanced',
    calories: 110,
    instructions: [
      'Lie with eyes directly beneath the racked barbell.',
      'Grip the bar slightly wider than shoulder-width with fingers wrapped securely.',
      'Unrack the bar, lower it smoothly to your lower-to-mid sternum with an inhale.',
      'Drive powerfully upward through your palms, maintaining foot drive.'
    ]
  },
  {
    id: 'gym-chest-4',
    name: 'Cable Chest Fly',
    type: 'gym',
    muscleGroup: 'chest',
    primaryMuscle: 'Inner & Lower Chest',
    secondaryMuscles: 'Anterior Deltoids',
    equipment: 'Dual Cable Cross Machine',
    description: 'Delivers continuous mechanical tension across the entire chest muscle belly, ideal for peak contraction and definition.',
    illustrationKey: 'cableChestFly',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 70,
    instructions: [
      'Set pulleys at shoulder or chest height and grip handles with palms facing forward.',
      'Step forward into a staggered stance with a gentle forward torso lean.',
      'With a slight bend in your elbows, bring handles together in front of your chest in a hugging motion.',
      'Pause for a 1-second peak squeeze, then open arms under full tension.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - CHEST
  // ==========================================
  {
    id: 'home-chest-1',
    name: 'Standard Push-ups',
    type: 'home',
    muscleGroup: 'chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: 'Triceps, Core, Front Delts',
    equipment: 'Bodyweight (Floor Mat optional)',
    description: 'The classic bodyweight chest builder. Builds muscular endurance, core tension, and functional pushing power.',
    illustrationKey: 'standardPushups',
    sets: 3,
    reps: '15–20 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 65,
    instructions: [
      'Position hands on the floor slightly wider than shoulder-width apart.',
      'Keep your body in a rigid straight plank line from head to heels.',
      'Lower your chest until it is roughly 2 inches off the ground.',
      'Push back up forcefully through your palms while keeping core tight.'
    ]
  },
  {
    id: 'home-chest-2',
    name: 'Incline Push-ups',
    type: 'home',
    muscleGroup: 'chest',
    primaryMuscle: 'Lower Chest',
    secondaryMuscles: 'Front Deltoids, Triceps',
    equipment: 'Chair / Bed Frame / Sturdy Table',
    description: 'Elevates your upper body to reduce joint load, emphasizing lower chest development and endurance.',
    illustrationKey: 'inclinePushups',
    sets: 3,
    reps: '12–16 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 55,
    instructions: [
      'Place hands on the edge of a stable elevated surface.',
      'Step feet back until your body forms a straight line at an incline.',
      'Lower your chest toward the platform edge with controlled elbows.',
      'Push back to starting position without locking elbows.'
    ]
  },
  {
    id: 'home-chest-3',
    name: 'Diamond Push-ups',
    type: 'home',
    muscleGroup: 'chest',
    primaryMuscle: 'Inner Chest & Triceps',
    secondaryMuscles: 'Core, Anterior Deltoids',
    equipment: 'Bodyweight',
    description: 'Hands placed close together in a diamond shape to aggressively load the inner chest fibers and lateral triceps.',
    illustrationKey: 'diamondPushups',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '40–50 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 70,
    instructions: [
      'Form a triangle or diamond with thumbs and index fingers under your chest.',
      'Keep elbows tucked close to your ribcage as you lower down.',
      'Drive upward through the palms, focusing on the triceps and inner pecs.'
    ]
  },
  {
    id: 'home-chest-4',
    name: 'Wide-Grip Push-ups',
    type: 'home',
    muscleGroup: 'chest',
    primaryMuscle: 'Outer Chest Pectorals',
    secondaryMuscles: 'Serratus Anterior, Shoulders',
    equipment: 'Bodyweight',
    description: 'Widened hand spacing reduces triceps contribution and forces the chest to stretch and contract maximally.',
    illustrationKey: 'standardPushups',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 65,
    instructions: [
      'Place hands roughly 1.5 times shoulder-width apart.',
      'Keep glutes squeezed and spine neutral as you descend.',
      'Stop when elbows reach a 90-degree angle and drive upward.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - BACK
  // ==========================================
  {
    id: 'gym-back-1',
    name: 'Wide-Grip Lat Pulldown',
    type: 'gym',
    muscleGroup: 'back',
    primaryMuscle: 'Latissimus Dorsi (Lats)',
    secondaryMuscles: 'Biceps, Rear Deltoids, Rhomboids',
    equipment: 'Cable Lat Pulldown Machine',
    description: 'Builds impressive back width and the coveted V-taper physique by mimicking vertical pulling mechanics.',
    illustrationKey: 'latPulldown',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 80,
    instructions: [
      'Adjust thigh pads snugly and grasp the wide bar with an overhand grip.',
      'Lean back slightly (10–15 degrees) with chest lifted high.',
      'Pull the bar down toward your upper chest by driving elbows toward your hips.',
      'Resist the weight smoothly back to the top stretch.'
    ]
  },
  {
    id: 'gym-back-2',
    name: 'Seated Cable Row',
    type: 'gym',
    muscleGroup: 'back',
    primaryMuscle: 'Mid Back (Rhomboids & Traps)',
    secondaryMuscles: 'Lats, Forearms, Biceps',
    equipment: 'Low Cable Row Station + V-Grip Handle',
    description: 'Develops back thickness, postural alignment, and scapular retraction strength.',
    illustrationKey: 'seatedCableRow',
    sets: 4,
    reps: '10–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 85,
    instructions: [
      'Place feet securely on the footrests with knees slightly bent.',
      'Maintain an upright neutral spine without rounding your lower back.',
      'Pull the handle toward your navel, squeezing shoulder blades tightly together.',
      'Extend arms back slowly under complete control.'
    ]
  },
  {
    id: 'gym-back-3',
    name: 'Barbell Bent-Over Row',
    type: 'gym',
    muscleGroup: 'back',
    primaryMuscle: 'Upper & Middle Back',
    secondaryMuscles: 'Erector Spinae, Lats, Biceps',
    equipment: 'Barbell + Weight Plates',
    description: 'A powerhouse free-weight exercise that packs dense muscle onto the entire posterior chain.',
    illustrationKey: 'seatedCableRow',
    sets: 4,
    reps: '8–10 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 75,
    difficulty: 'Advanced',
    calories: 105,
    instructions: [
      'Hinge at the hips until your torso is roughly 45 degrees to the floor.',
      'Grip the barbell just outside knee width with knuckles facing out.',
      'Pull the barbell to your lower sternum while keeping elbows tucked.',
      'Lower under control without swinging your hips.'
    ]
  },
  {
    id: 'gym-back-4',
    name: 'Single-Arm Dumbbell Row',
    type: 'gym',
    muscleGroup: 'back',
    primaryMuscle: 'Lower Lats & Rhomboids',
    secondaryMuscles: 'Core, Biceps',
    equipment: 'Flat Bench + Dumbbell',
    description: 'Allows deep unilateral stretch and contraction, correcting left/right strength imbalances.',
    illustrationKey: 'inclineDumbbellPress',
    sets: 3,
    reps: '10–12 reps each side',
    recommendedTime: '60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 80,
    instructions: [
      'Place one knee and one hand on a flat bench for torso support.',
      'Hold the dumbbell in the free hand with arm hanging straight.',
      'Row the dumbbell up toward your hip pocket, keeping elbow close.',
      'Lower down smoothly to full stretch before repeating.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - BACK
  // ==========================================
  {
    id: 'home-back-1',
    name: 'Doorframe Rows',
    type: 'home',
    muscleGroup: 'back',
    primaryMuscle: 'Lats & Upper Back',
    secondaryMuscles: 'Biceps, Forearms',
    equipment: 'Sturdy Doorframe',
    description: 'Uses bodyweight angle against a sturdy doorframe to deliver horizontal pulling resistance without gym equipment.',
    illustrationKey: 'doorframeRow',
    sets: 4,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 55,
    instructions: [
      'Stand facing a doorframe, gripping the trim at mid-chest height.',
      'Walk your feet forward to create a comfortable backward lean angle.',
      'Pull your chest toward the frame by squeezing your shoulder blades.',
      'Lower yourself back down with straight, controlled arms.'
    ]
  },
  {
    id: 'home-back-2',
    name: 'Prone Superman Y-T-W',
    type: 'home',
    muscleGroup: 'back',
    primaryMuscle: 'Lower Back & Spinal Erectors',
    secondaryMuscles: 'Rear Delts, Glutes',
    equipment: 'Yoga / Floor Mat',
    description: 'Improves posture, strengthens spinal stability, and eliminates sedentary lower back stiffness.',
    illustrationKey: 'proneSuperman',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 50,
    instructions: [
      'Lie face down on a mat with arms extended overhead.',
      'Simultaneously lift your chest, arms, and legs 2–3 inches off the ground.',
      'Hold the contraction for 2 seconds at the peak.',
      'Smoothly lower and repeat without jerking your neck.'
    ]
  },
  {
    id: 'home-back-3',
    name: 'Inverted Towel Table Rows',
    type: 'home',
    muscleGroup: 'back',
    primaryMuscle: 'Mid Back & Lats',
    secondaryMuscles: 'Biceps, Grip Strength',
    equipment: 'Sturdy Table or Towel Anchor',
    description: 'An advanced bodyweight row that simulates gym barbell rows using a sturdy table underside.',
    illustrationKey: 'doorframeRow',
    sets: 3,
    reps: '8–12 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 65,
    instructions: [
      'Lie beneath a very heavy, sturdy table and grip the edge overhand.',
      'Keep your heels on the ground and body in a rigid reverse plank.',
      'Pull your chest up until it nearly touches the table underside.',
      'Lower down slowly and repeat.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - SHOULDERS
  // ==========================================
  {
    id: 'gym-shoulders-1',
    name: 'Dumbbell Shoulder Press',
    type: 'gym',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: 'Triceps, Upper Traps',
    equipment: 'Adjustable Bench (90°) + Dumbbells',
    description: 'Builds boulder shoulders and overhead functional pressing power with independent dumbbell control.',
    illustrationKey: 'overheadShoulderPress',
    sets: 4,
    reps: '8–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 75,
    difficulty: 'Intermediate',
    calories: 90,
    instructions: [
      'Sit on an upright bench with dumbbells held at shoulder level, palms forward.',
      'Keep core braced and feet firmly pressed into the floor.',
      'Press the dumbbells straight overhead until arms are nearly straight.',
      'Lower the weights under control back to ear level.'
    ]
  },
  {
    id: 'gym-shoulders-2',
    name: 'Dumbbell Lateral Raise',
    type: 'gym',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Lateral Deltoids (Side Shoulders)',
    secondaryMuscles: 'Trapezius',
    equipment: 'Dumbbells',
    description: 'The golden exercise for side shoulder cap growth, widening your silhouette and enhancing frame aesthetics.',
    illustrationKey: 'lateralRaise',
    sets: 4,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 65,
    instructions: [
      'Stand with dumbbells at your sides with a slight forward hip hinge.',
      'Lead with your elbows, raising arms out to the sides until parallel with the floor.',
      'Pause briefly at the top without shrugging your neck.',
      'Lower down smoothly over 2 full seconds.'
    ]
  },
  {
    id: 'gym-shoulders-3',
    name: 'Cable Face Pulls',
    type: 'gym',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Posterior Deltoids & Rotator Cuff',
    secondaryMuscles: 'Rhomboids, Middle Traps',
    equipment: 'Cable Machine + Rope Attachment',
    description: 'Essential shoulder health exercise that counteracts computer posture and builds dense rear deltoids.',
    illustrationKey: 'overheadShoulderPress',
    sets: 3,
    reps: '15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 60,
    instructions: [
      'Set pulley to upper chest height and grasp rope with a thumbs-backward grip.',
      'Step back, pull the center of the rope directly toward your eye level.',
      'At the finish, rotate hands back like a double bicep pose to engage rotator cuff.',
      'Return slowly under cable tension.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - SHOULDERS
  // ==========================================
  {
    id: 'home-shoulders-1',
    name: 'Pike Push-ups',
    type: 'home',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Anterior & Medial Delts',
    secondaryMuscles: 'Triceps, Upper Traps',
    equipment: 'Bodyweight (Floor Mat)',
    description: 'Shifts bodyweight directly over the shoulders, serving as an exceptional calisthenics overhead press builder.',
    illustrationKey: 'pikePushups',
    sets: 3,
    reps: '8–12 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 70,
    instructions: [
      'Begin in pushup position and walk feet toward hands, pushing hips into an inverted V.',
      'Bend elbows to lower your crown diagonally forward toward the floor.',
      'Push back up through your shoulders to return to the pike peak.'
    ]
  },
  {
    id: 'home-shoulders-2',
    name: 'Lateral Arm Circles & Pulses',
    type: 'home',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Lateral Deltoids',
    secondaryMuscles: 'Neck stabilizers, Traps',
    equipment: 'Bodyweight',
    description: 'High-rep isometric and rotational burn that exhausts side delts without needing any weights.',
    illustrationKey: 'lateralRaise',
    sets: 3,
    reps: '30 sec clockwise + 30 sec counter',
    recommendedTime: '60 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 45,
    instructions: [
      'Stand tall and raise both arms straight out to the sides at shoulder level.',
      'Perform small, tight circular rotations for 30 seconds.',
      'Reverse direction immediately without dropping your arms.'
    ]
  },
  {
    id: 'home-shoulders-3',
    name: 'Wall Handstand Hold',
    type: 'home',
    muscleGroup: 'shoulders',
    primaryMuscle: 'Entire Deltoid Complex',
    secondaryMuscles: 'Core, Serratus, Triceps',
    equipment: 'Clear Wall Space',
    description: 'A formidable isometric hold that builds tremendous shoulder stability, core strength, and balance.',
    illustrationKey: 'pikePushups',
    sets: 3,
    reps: '20–40 sec hold',
    recommendedTime: '30–45 sec',
    restSeconds: 60,
    difficulty: 'Advanced',
    calories: 80,
    instructions: [
      'Kick up gently against a sturdy wall or walk feet up the wall into a handstand.',
      'Keep arms locked, push ground away, and tuck your ribs.',
      'Breathe steadily and hold for target duration, stepping down safely.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - BICEPS
  // ==========================================
  {
    id: 'gym-biceps-1',
    name: 'Barbell Bicep Curls',
    type: 'gym',
    muscleGroup: 'biceps',
    primaryMuscle: 'Biceps Brachii (Long & Short Head)',
    secondaryMuscles: 'Brachialis, Forearm Flexors',
    equipment: 'EZ-Bar or Olympic Barbell',
    description: 'The heavyweight standard for maximizing bicep size, peak height, and pulling strength.',
    illustrationKey: 'barbellBicepCurls',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 70,
    instructions: [
      'Stand tall with feet hip-width, gripping the bar shoulder-width underhand.',
      'Keep elbows pinned directly to your sides.',
      'Curl bar upward toward chest while contracting biceps hard at peak.',
      'Lower smoothly to full extension over 2 seconds.'
    ]
  },
  {
    id: 'gym-biceps-2',
    name: 'Incline Dumbbell Curls',
    type: 'gym',
    muscleGroup: 'biceps',
    primaryMuscle: 'Biceps Long Head (Peak)',
    secondaryMuscles: 'Brachialis',
    equipment: 'Incline Bench (45–60°) + Dumbbells',
    description: 'Places the long head of the bicep under a deep stretch from the shoulder, producing taller bicep peaks.',
    illustrationKey: 'inclineDumbbellCurls',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 65,
    instructions: [
      'Lie back on an incline bench with arms hanging straight down with dumbbells.',
      'Keep shoulders back against pad and curl weights upward with supination.',
      'Squeeze hard at the peak, then lower slowly to feel the full stretch.'
    ]
  },
  {
    id: 'gym-biceps-3',
    name: 'Hammer Curls',
    type: 'gym',
    muscleGroup: 'biceps',
    primaryMuscle: 'Brachialis & Brachioradialis',
    secondaryMuscles: 'Biceps Brachii',
    equipment: 'Dumbbells',
    description: 'Neutral-grip curls that build arm thickness from the side and reinforce forearm grip power.',
    illustrationKey: 'barbellBicepCurls',
    sets: 3,
    reps: '12 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 60,
    instructions: [
      'Hold dumbbells with palms facing each other (neutral grip).',
      'Curl the weights upward without rotating your wrists.',
      'Hold at shoulder level for a split second, then lower steadily.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - BICEPS
  // ==========================================
  {
    id: 'home-biceps-1',
    name: 'Towel Isometric Bicep Curls',
    type: 'home',
    muscleGroup: 'biceps',
    primaryMuscle: 'Biceps Brachii',
    secondaryMuscles: 'Forearms, Grip',
    equipment: 'Bath Towel',
    description: 'Step on a bath towel and curl against maximum leg resistance for intense isometric tension.',
    illustrationKey: 'towelBicepCurls',
    sets: 3,
    reps: '15 sec max effort hold × 3 pulses',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 50,
    instructions: [
      'Loop a strong bath towel under one foot, holding ends in both hands.',
      'Bend elbows to a 90-degree angle.',
      'Pull upward with maximum force against your foot for 15 seconds.',
      'Relax briefly and repeat 3 times per set.'
    ]
  },
  {
    id: 'home-biceps-2',
    name: 'Doorframe Bicep Curls',
    type: 'home',
    muscleGroup: 'biceps',
    primaryMuscle: 'Biceps & Forearms',
    secondaryMuscles: 'Rear Shoulders',
    equipment: 'Doorframe',
    description: 'Lean back from a doorframe with underhand grip and pull your face toward the frame using arms.',
    illustrationKey: 'doorframeRow',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 50,
    instructions: [
      'Hold the doorframe trim with one arm underhand at chest height.',
      'Lean body backward on heels.',
      'Pull your chest toward your hand strictly by bending your elbow.',
      'Switch arms after completing reps.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - TRICEPS
  // ==========================================
  {
    id: 'gym-triceps-1',
    name: 'Tricep Rope Pushdowns',
    type: 'gym',
    muscleGroup: 'triceps',
    primaryMuscle: 'Triceps Lateral & Medial Head',
    secondaryMuscles: 'Forearms',
    equipment: 'High Cable Pulley + Rope',
    description: 'Isolates the horseshoe tricep shape with smooth constant cable resistance throughout the sweep.',
    illustrationKey: 'tricepPushdown',
    sets: 4,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 65,
    instructions: [
      'Grip the rope attachment with palms facing inward.',
      'Tuck elbows at your sides and lean slightly forward.',
      'Push rope downward, spreading handles apart at bottom extension.',
      'Slowly allow forearms to rise back to 90 degrees.'
    ]
  },
  {
    id: 'gym-triceps-2',
    name: 'Lying Tricep Skull Crushers',
    type: 'gym',
    muscleGroup: 'triceps',
    primaryMuscle: 'Triceps Long Head',
    secondaryMuscles: 'Anterior Shoulders',
    equipment: 'Flat Bench + EZ-Bar',
    description: 'The ultimate mass builder for the long head of the triceps, providing intense stretch and contraction.',
    illustrationKey: 'flatDumbbellPress',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 75,
    difficulty: 'Intermediate',
    calories: 75,
    instructions: [
      'Lie flat holding the EZ-bar straight above your chest.',
      'Keep upper arms stationary and bend elbows to lower bar toward forehead.',
      'Drive the bar back up strictly with triceps extension.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - TRICEPS
  // ==========================================
  {
    id: 'home-triceps-1',
    name: 'Chair / Bench Dips',
    type: 'home',
    muscleGroup: 'triceps',
    primaryMuscle: 'All 3 Tricep Heads',
    secondaryMuscles: 'Front Deltoids, Chest',
    equipment: 'Sturdy Chair or Couch Edge',
    description: 'Convenient bodyweight compound movement that heavily overloads the triceps at full lockout.',
    illustrationKey: 'chairDips',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 60,
    instructions: [
      'Place hands on chair edge behind you with knuckles forward.',
      'Extend legs forward; bend elbows backward to lower hips toward the floor.',
      'Stop when elbows hit 90 degrees and push straight back up.'
    ]
  },
  {
    id: 'home-triceps-2',
    name: 'Close-Grip Floor Press',
    type: 'home',
    muscleGroup: 'triceps',
    primaryMuscle: 'Lateral Tricep Head',
    secondaryMuscles: 'Inner Chest',
    equipment: 'Bodyweight (Floor Mat)',
    description: 'Pushups performed with elbows grazing the ribcage to place maximum workload directly on the triceps.',
    illustrationKey: 'diamondPushups',
    sets: 3,
    reps: '10–14 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 65,
    instructions: [
      'Assume a pushup stance with hands shoulder-width apart.',
      'Lower down keeping upper arms skimming against your ribcage.',
      'Lock out arms completely at top to flex triceps.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - LEGS
  // ==========================================
  {
    id: 'gym-legs-1',
    name: 'Barbell Back Squats',
    type: 'gym',
    muscleGroup: 'legs',
    primaryMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: 'Hamstrings, Adductors, Core',
    equipment: 'Squat Rack + Olympic Barbell',
    description: 'The undisputed king of lower-body exercises. Drives full-body anabolic stimulus and leg strength.',
    illustrationKey: 'barbellSquat',
    sets: 4,
    reps: '6–10 reps',
    recommendedTime: '60 sec',
    restSeconds: 90,
    difficulty: 'Advanced',
    calories: 130,
    instructions: [
      'Rest bar across upper traps, step back with feet slightly wider than hips.',
      'Brace core, push hips back and bend knees to descend below parallel.',
      'Drive aggressively through whole foot to stand back up tall.'
    ]
  },
  {
    id: 'gym-legs-2',
    name: 'Leg Press',
    type: 'gym',
    muscleGroup: 'legs',
    primaryMuscle: 'Quadriceps (Vastus Medialis/Lateralis)',
    secondaryMuscles: 'Gluteus Maximus',
    equipment: '45-Degree Leg Press Machine',
    description: 'Allows heavy quadriceps loading without spinal compression, optimal for safe high-volume leg workouts.',
    illustrationKey: 'barbellSquat',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '50 sec',
    restSeconds: 75,
    difficulty: 'Intermediate',
    calories: 100,
    instructions: [
      'Seat firmly with back pad supported and feet shoulder-width on sled.',
      'Unlock sled, lower knees toward chest until thighs reach 90 degrees.',
      'Press sled back up through heels without locking knees.'
    ]
  },
  {
    id: 'gym-legs-3',
    name: 'Romanian Deadlifts (RDL)',
    type: 'gym',
    muscleGroup: 'legs',
    primaryMuscle: 'Hamstrings & Glutes',
    secondaryMuscles: 'Lower Back, Traps',
    equipment: 'Barbell or Heavy Dumbbells',
    description: 'Targeted hip-hinge exercise for developing powerful hamstring flexibility and sculpted glutes.',
    illustrationKey: 'barbellSquat',
    sets: 3,
    reps: '10–12 reps',
    recommendedTime: '50 sec',
    restSeconds: 75,
    difficulty: 'Intermediate',
    calories: 95,
    instructions: [
      'Stand holding barbell at thighs with soft knees.',
      'Hinge hips backward while sliding the bar down along shins.',
      'Feel the deep stretch in your hamstrings, then thrust hips forward to stand.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - LEGS
  // ==========================================
  {
    id: 'home-legs-1',
    name: 'Bodyweight Squats',
    type: 'home',
    muscleGroup: 'legs',
    primaryMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: 'Hamstrings, Calves',
    equipment: 'Bodyweight',
    description: 'Foundational lower body movement for cardiovascular conditioning, knee health, and leg endurance.',
    illustrationKey: 'bodyweightSquat',
    sets: 4,
    reps: '20 reps',
    recommendedTime: '45–60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 75,
    instructions: [
      'Stand with feet shoulder-width apart, toes turned slightly out.',
      'Send hips back and descend until thighs are at least parallel to the floor.',
      'Drive back up through midfoot to complete the rep.'
    ]
  },
  {
    id: 'home-legs-2',
    name: 'Walking Lunges',
    type: 'home',
    muscleGroup: 'legs',
    primaryMuscle: 'Quads & Glutes',
    secondaryMuscles: 'Balance stabilizers, Calves',
    equipment: 'Bodyweight',
    description: 'Unilateral leg strength builder that burns high calories and improves athletic balance.',
    illustrationKey: 'lunges',
    sets: 3,
    reps: '12 reps each leg',
    recommendedTime: '60 sec',
    restSeconds: 60,
    difficulty: 'Beginner',
    calories: 80,
    instructions: [
      'Take a long step forward, lowering back knee until hovering above floor.',
      'Drive through the front heel to step directly into the next lunge.'
    ]
  },
  {
    id: 'home-legs-3',
    name: 'Bulgarian Split Squats',
    type: 'home',
    muscleGroup: 'legs',
    primaryMuscle: 'Quadriceps & Upper Glutes',
    secondaryMuscles: 'Hamstrings, Core',
    equipment: 'Chair / Bed edge',
    description: 'Elevating the rear foot forces the working front leg to bear almost 90% of your bodyweight.',
    illustrationKey: 'lunges',
    sets: 3,
    reps: '10–12 reps per leg',
    recommendedTime: '60 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 85,
    instructions: [
      'Place top of rear foot on a chair behind you, front foot 2–3 feet forward.',
      'Lower hips down until front thigh is parallel to the ground.',
      'Drive back up through front heel.'
    ]
  },
  {
    id: 'home-legs-4',
    name: 'Glute Bridges',
    type: 'home',
    muscleGroup: 'legs',
    primaryMuscle: 'Gluteus Maximus',
    secondaryMuscles: 'Hamstrings, Core',
    equipment: 'Floor Mat',
    description: 'Activates sleepy glutes and counteracts long hours of sitting while protecting lower spine.',
    illustrationKey: 'gluteBridges',
    sets: 3,
    reps: '15–20 reps',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 60,
    instructions: [
      'Lie on back with knees bent and feet flat on the floor close to glutes.',
      'Drive through heels to lift hips until thighs and torso align.',
      'Squeeze glutes hard for 2 seconds at the peak before lowering.'
    ]
  },

  // ==========================================
  // GYM WORKOUTS - ABS
  // ==========================================
  {
    id: 'gym-abs-1',
    name: 'Hanging Leg Raises',
    type: 'gym',
    muscleGroup: 'abs',
    primaryMuscle: 'Lower Rectus Abdominis',
    secondaryMuscles: 'Hip Flexors, Forearm Grip',
    equipment: 'Pull-up Bar',
    description: 'The pinnacle lower abdominal movement that sculpts deep core definition and grip endurance.',
    illustrationKey: 'hangingLegRaises',
    sets: 3,
    reps: '12–15 reps',
    recommendedTime: '45 sec',
    restSeconds: 60,
    difficulty: 'Intermediate',
    calories: 65,
    instructions: [
      'Hang from pullup bar with arms straight and shoulders packed.',
      'Without swinging, raise straight legs until parallel to the floor.',
      'Lower legs slowly without using momentum.'
    ]
  },
  {
    id: 'gym-abs-2',
    name: 'Cable Woodchoppers',
    type: 'gym',
    muscleGroup: 'abs',
    primaryMuscle: 'Internal & External Obliques',
    secondaryMuscles: 'Shoulders, Transverse Abdominis',
    equipment: 'Cable Machine + D-Handle',
    description: 'Rotational core power exercise that tightens the waistline and boosts athletic torque.',
    illustrationKey: 'cableChestFly',
    sets: 3,
    reps: '12 reps each side',
    recommendedTime: '60 sec',
    restSeconds: 45,
    difficulty: 'Intermediate',
    calories: 70,
    instructions: [
      'Set pulley high, grip handle with both hands across shoulder.',
      'Rotate torso down diagonally across body toward opposite hip.',
      'Pivot rear foot and maintain core tightness throughout rotation.'
    ]
  },

  // ==========================================
  // HOME WORKOUTS - ABS
  // ==========================================
  {
    id: 'home-abs-1',
    name: 'Standard Forearm Plank',
    type: 'home',
    muscleGroup: 'abs',
    primaryMuscle: 'Transverse Abdominis & Deep Core',
    secondaryMuscles: 'Shoulders, Glutes',
    equipment: 'Floor Mat',
    description: 'Isometric anti-extension exercise creating a natural muscular corset around the abdomen.',
    illustrationKey: 'plank',
    sets: 3,
    reps: '45–60 sec hold',
    recommendedTime: '45–60 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 55,
    instructions: [
      'Rest on forearms with elbows directly beneath shoulders.',
      'Squeeze glutes and draw navel toward spine to keep a flat back.',
      'Breathe steadily and prevent lower back from sagging.'
    ]
  },
  {
    id: 'home-abs-2',
    name: 'Side Plank',
    type: 'home',
    muscleGroup: 'abs',
    primaryMuscle: 'Obliques & Quadratus Lumborum',
    secondaryMuscles: 'Hip Abductors',
    equipment: 'Floor Mat',
    description: 'Reinforces lateral spinal stability and defines side abdominal contours.',
    illustrationKey: 'plank',
    sets: 3,
    reps: '30–45 sec per side',
    recommendedTime: '60 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 50,
    instructions: [
      'Lie on your side propped on one elbow with feet stacked.',
      'Elevate hips until body forms a straight diagonal line.',
      'Hold position firmly, then repeat on the opposite side.'
    ]
  },
  {
    id: 'home-abs-3',
    name: 'Bicycle Crunches',
    type: 'home',
    muscleGroup: 'abs',
    primaryMuscle: 'Rectus Abdominis & Obliques',
    secondaryMuscles: 'Hip Flexors',
    equipment: 'Floor Mat',
    description: 'Rated among the most effective exercises for muscle activation in both upper/lower abs and obliques.',
    illustrationKey: 'gluteBridges',
    sets: 3,
    reps: '20 alternating reps',
    recommendedTime: '45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 60,
    instructions: [
      'Lie on back with hands lightly behind head and knees lifted.',
      'Rotate opposite elbow toward opposite knee while extending other leg.',
      'Alternate fluidly in a bicycle pedaling motion.'
    ]
  },
  {
    id: 'home-abs-4',
    name: 'Mountain Climbers',
    type: 'home',
    muscleGroup: 'abs',
    primaryMuscle: 'Lower Abs & Core Flexors',
    secondaryMuscles: 'Shoulders, Cardiovascular System',
    equipment: 'Floor Mat',
    description: 'Fast-paced core and conditioning movement that incinerates calories while tightening abs.',
    illustrationKey: 'standardPushups',
    sets: 3,
    reps: '30 sec rapid reps',
    recommendedTime: '30–45 sec',
    restSeconds: 45,
    difficulty: 'Beginner',
    calories: 70,
    instructions: [
      'Start in a pushup plank position with hands under shoulders.',
      'Drive one knee quickly toward chest, then alternate in rapid rhythm.',
      'Keep hips level and core braced throughout.'
    ]
  }
];
