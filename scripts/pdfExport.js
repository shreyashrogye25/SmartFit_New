/* ==========================================================================
   SMARTFIT - PDF Report Generator
   Generates a professional, multi-page vector PDF summary of the user's
   health profile, daily metrics, meals, workouts, and progress.
   ========================================================================== */

import { jsPDF } from 'jspdf';

export class PdfExportService {
  static generateReport(state) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let y = 14;

    const p = state.profile || {};
    const u = state.auth?.user || {};
    const metrics = state.todayMetrics || {};
    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // ── 1. HEADER BANNER ────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235); // #2563EB Primary Blue
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SMARTFIT - HEALTH & FITNESS REPORT', margin, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Generated on: ${todayStr} | Confidential Personal Health Record`, margin, 21);

    y = 36;

    // ── Helper: Section Title ────────────────────────────────────────────────
    const drawSectionTitle = (title, icon = '•') => {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = 16;
      }
      doc.setFillColor(241, 245, 249); // #F1F5F9
      doc.roundedRect(margin, y - 4, contentWidth, 7, 1.5, 1.5, 'F');
      doc.setTextColor(15, 23, 42); // #0F172A
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(`${icon}  ${title.toUpperCase()}`, margin + 3, y + 1.2);
      y += 8;
    };

    // ── 2. MEMBER PROFILE & BIOMETRICS ──────────────────────────────────────
    drawSectionTitle('Member Profile & Biometrics', '👤');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // #334155

    const userName = p.name || u.name || 'User';
    const userEmail = u.email || 'N/A';
    const userGender = (p.gender || 'male').charAt(0).toUpperCase() + (p.gender || 'male').slice(1);
    const userAge = `${p.age || 26} years`;
    const userGoal = (p.goal || 'stay_fit').replace('_', ' ').toUpperCase();
    const userActivity = (p.activityLevel || 'moderate').replace('_', ' ').toUpperCase();

    // Height, Weight, BMI calculation
    const heightCm = parseFloat(p.height) || 178;
    const weightKg = parseFloat(p.weight) || 71;
    const targetKg = parseFloat(p.targetWeight) || 68;
    const bodyFat = p.bodyFat ? `${p.bodyFat}%` : 'N/A';
    const bmiVal = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);
    let bmiCat = 'Normal';
    if (bmiVal < 18.5) bmiCat = 'Underweight';
    else if (bmiVal >= 25 && bmiVal < 30) bmiCat = 'Overweight';
    else if (bmiVal >= 30) bmiCat = 'Obese';

    const col1X = margin + 2;
    const col2X = margin + (contentWidth / 3);
    const col3X = margin + ((contentWidth / 3) * 2);

    doc.setFont('helvetica', 'bold');
    doc.text('Full Name:', col1X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(userName, col1X + 22, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Height:', col2X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${heightCm} cm`, col2X + 16, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Current BMI:', col3X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${bmiVal} (${bmiCat})`, col3X + 24, y);

    y += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', col1X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(userEmail, col1X + 22, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Weight:', col2X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${weightKg} kg`, col2X + 16, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Target Goal:', col3X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${targetKg} kg`, col3X + 24, y);

    y += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.text('Demographics:', col1X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${userGender}, ${userAge}`, col1X + 26, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Body Fat:', col2X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(bodyFat, col2X + 18, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Primary Focus:', col3X, y);
    doc.setFont('helvetica', 'normal');
    doc.text(userGoal, col3X + 26, y);

    y += 9;

    // ── 3. TODAY'S METRIC SUMMARY ───────────────────────────────────────────
    drawSectionTitle("Today's Health & Activity Metrics", '⚡');

    const calConsumed = metrics.caloriesConsumed || 0;
    const calTarget = p.dailyCalorieTarget || 2000;
    const calBurned = metrics.caloriesBurned || 0;
    const waterGlasses = metrics.waterGlasses || 0;
    const waterTarget = p.dailyWaterTarget || 8;
    const waterMl = waterGlasses * 250;
    const exercisesCount = metrics.exercisesCompleted || (state.workouts?.length || 0);

    // Render 4 stat cards in a row
    const cardWidth = (contentWidth - 9) / 4;
    const cardHeight = 16;
    const stats = [
      { label: 'CALORIES CONSUMED', val: `${calConsumed} / ${calTarget}`, unit: 'kcal' },
      { label: 'CALORIES BURNED', val: `${calBurned}`, unit: 'kcal' },
      { label: 'HYDRATION INTAKE', val: `${waterGlasses} / ${waterTarget} (${waterMl}ml)`, unit: 'glasses' },
      { label: 'EXERCISES LOGGED', val: `${exercisesCount}`, unit: 'completed' }
    ];

    stats.forEach((st, i) => {
      const cx = margin + (i * (cardWidth + 3));
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cx, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(st.label, cx + (cardWidth / 2), y + 4.5, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(37, 99, 235);
      doc.text(st.val, cx + (cardWidth / 2), y + 10.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(st.unit, cx + (cardWidth / 2), y + 14, { align: 'center' });
    });

    y += cardHeight + 8;

    // ── 4. MEAL LOGS BREAKDOWN ──────────────────────────────────────────────
    drawSectionTitle('Nutritional Intake (Today)', '🥗');

    const meals = state.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const allMealEntries = [];
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(category => {
      if (Array.isArray(meals[category])) {
        meals[category].forEach(m => {
          allMealEntries.push({ ...m, category: category.toUpperCase() });
        });
      }
    });

    if (allMealEntries.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('No meals recorded for today yet. Use the Diet Tracker to log daily food items.', margin + 2, y);
      y += 6;
    } else {
      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 3, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('TYPE', margin + 2, y + 0.8);
      doc.text('MEAL ITEM', margin + 28, y + 0.8);
      doc.text('CALORIES', margin + 95, y + 0.8, { align: 'right' });
      doc.text('PROTEIN', margin + 120, y + 0.8, { align: 'right' });
      doc.text('CARBS', margin + 145, y + 0.8, { align: 'right' });
      doc.text('FAT', margin + contentWidth - 2, y + 0.8, { align: 'right' });
      y += 5.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);

      allMealEntries.forEach((m, idx) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 16;
        }
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 3, contentWidth, 4.8, 'F');
        }
        doc.text(m.category, margin + 2, y);
        doc.text(m.name.length > 35 ? m.name.slice(0, 32) + '...' : m.name, margin + 28, y);
        doc.text(`${m.calories || 0} kcal`, margin + 95, y, { align: 'right' });
        doc.text(`${m.protein || 0}g`, margin + 120, y, { align: 'right' });
        doc.text(`${m.carbs || 0}g`, margin + 145, y, { align: 'right' });
        doc.text(`${m.fat || 0}g`, margin + contentWidth - 2, y, { align: 'right' });
        y += 5;
      });
    }

    y += 4;

    // ── 5. WORKOUTS LOGS ────────────────────────────────────────────────────
    drawSectionTitle('Completed Workouts & Exercises', '🏋️');

    const workouts = state.workouts || [];
    if (workouts.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('No workouts logged for today. Start a routine in the Workout module to track energy burn.', margin + 2, y);
      y += 6;
    } else {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 3, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('EXERCISE / ROUTINE', margin + 2, y + 0.8);
      doc.text('CATEGORY', margin + 65, y + 0.8);
      doc.text('DURATION', margin + 105, y + 0.8, { align: 'right' });
      doc.text('SETS × REPS', margin + 140, y + 0.8, { align: 'right' });
      doc.text('BURNED', margin + contentWidth - 2, y + 0.8, { align: 'right' });
      y += 5.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);

      workouts.forEach((w, idx) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 16;
        }
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 3, contentWidth, 4.8, 'F');
        }
        doc.text(w.name.length > 32 ? w.name.slice(0, 30) + '...' : w.name, margin + 2, y);
        doc.text((w.category || 'workout').toUpperCase(), margin + 65, y);
        doc.text(`${w.duration || 0} min`, margin + 105, y, { align: 'right' });
        doc.text(`${w.sets || 1} × ${w.reps || 10}`, margin + 140, y, { align: 'right' });
        doc.text(`${w.caloriesBurned || 0} kcal`, margin + contentWidth - 2, y, { align: 'right' });
        y += 5;
      });
    }

    y += 4;

    // ── 6. PROGRESS HISTORY ─────────────────────────────────────────────────
    drawSectionTitle('Weight & Body Progress Logs', '📈');

    const history = state.progressHistory || [];
    if (history.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('No historical weight entries recorded yet. Track check-ins in the Progress tab.', margin + 2, y);
      y += 6;
    } else {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 3, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('CHECK-IN DATE', margin + 2, y + 0.8);
      doc.text('LOGGED WEIGHT', margin + 55, y + 0.8);
      doc.text('SESSION NOTES / OBSERVATIONS', margin + 95, y + 0.8);
      y += 5.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);

      history.slice(-5).forEach((h, idx) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 16;
        }
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 3, contentWidth, 4.8, 'F');
        }
        doc.text(h.date || 'Recent', margin + 2, y);
        doc.text(`${h.weight} kg`, margin + 55, y);
        const note = h.note ? (h.note.length > 55 ? h.note.slice(0, 52) + '...' : h.note) : '—';
        doc.text(note, margin + 95, y);
        y += 5;
      });
    }

    y += 4;

    // ── 7. GAMIFICATION & HEALTH ADVISORY ───────────────────────────────────
    drawSectionTitle('Gamification & Clinical Profile', '🏆');

    const g = state.gamification || {};
    const unlockedBadges = (g.badges || []).filter(b => b.unlocked).length;
    const totalBadges = (g.badges || []).length || 5;
    const diseasesList = Array.isArray(p.diseases) && p.diseases.length > 0 && !p.diseases.includes('none')
      ? p.diseases.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
      : 'None (Healthy Clinical Baseline)';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Fitness Level:', margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Level ${g.level || 1} (${g.xp || 0} XP)`, margin + 24, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Badges Unlocked:', margin + 65, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${unlockedBadges} of ${totalBadges} Badges Earned`, margin + 94, y);

    y += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.text('Medical Conditions:', margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(diseasesList, margin + 34, y);

    y += 9;

    // ── 8. FOOTER ACROSS ALL PAGES ──────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('SmartFit Health & Fitness Intelligence Platform', margin, pageHeight - 6);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }

    // Trigger direct PDF download in browser
    const filename = `smartfit_health_report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    return filename;
  }
}
