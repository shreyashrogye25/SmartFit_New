"""
==========================================================================
SMARTFIT - Measurements & Body Health Analytics Module (Python)
Biometric calculations, Mifflin-St Jeor BMR, activity-based TDEE,
customized calorie goals, hydration metrics, and disease advisories.
==========================================================================
"""

from typing import Dict, Any, List


class MeasurementsService:
    """
    Computes complete biometric profile analytics including:
    - BMR (Basal Metabolic Rate via Mifflin-St Jeor formula)
    - TDEE (Total Daily Energy Expenditure) based on physical activity levels
    - Calorie targets tailored for Weight Loss, Muscle Building, or Maintenance
    - Daily hydration goals (liters & standard 250ml glasses)
    - Healthy weight ranges
    - Clinical guidelines for pre-existing medical conditions
    """

    ACTIVITY_MULTIPLIERS = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }

    DISEASE_GUIDELINES = {
        "diabetes": {
            "title": "Diabetes Management",
            "icon": "🩸",
            "tip": "Prioritize low-glycemic carbs (oats, brown rice, pulses). Schedule post-meal walks (15-20 min) to stabilize blood glucose and keep emergency glucose handy during workouts."
        },
        "hypertension": {
            "title": "Hypertension (High BP)",
            "icon": "❤️",
            "tip": "Keep sodium under 2,000 mg/day. Emphasize steady-state aerobic cardio (brisk walk, cycling) and avoid heavy isometric breath-holding (Valsalva maneuver)."
        },
        "asthma": {
            "title": "Respiratory & Asthma Care",
            "icon": "🫁",
            "tip": "Always do a gradual 8-10 min warm-up. Keep your prescribed rescue inhaler accessible. Prefer temperature-regulated indoor exercise during cold or pollen peaks."
        },
        "thyroid": {
            "title": "Thyroid Care",
            "icon": "🦋",
            "tip": "Combine moderate resistance training with consistent lean protein intake. Regulate circadian sleep patterns to support endocrine and metabolic balance."
        },
        "heart": {
            "title": "Cardiovascular Care",
            "icon": "🫀",
            "tip": "Maintain target heart rate within moderate aerobic zones (50-70% HR max). Always consult your cardiologist before testing high-intensity intervals (HIIT)."
        },
        "arthritis": {
            "title": "Joint & Arthritis Protection",
            "icon": "🦴",
            "tip": "Choose low-impact activities like swimming, cycling, and resistance bands to preserve joint cartilage while strengthening stabilizer muscles."
        },
        "cholesterol": {
            "title": "Lipid & Cholesterol Optimization",
            "icon": "🥑",
            "tip": "Increase soluble fiber (oats, legumes, chia seeds) and healthy omega-3 fatty acids. Limit trans and saturated fats to boost protective HDL levels."
        }
    }

    @classmethod
    def calculate_biometrics(
        cls,
        age: int = 26,
        gender: str = "male",
        height_cm: float = 178.0,
        weight_kg: float = 71.0,
        activity_level: str = "moderate",
        goal: str = "maintain",
        diseases: List[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates all metabolic and health parameters.
        """
        if diseases is None:
            diseases = ["none"]

        # 1. Height in meters and BMI
        height_m = height_cm / 100.0
        bmi = round(weight_kg / (height_m ** 2), 1)

        if bmi < 18.5:
            bmi_cat, bmi_badge = "Underweight", "badge-cyan"
        elif bmi < 25.0:
            bmi_cat, bmi_badge = "Normal", "badge-green"
        elif bmi < 30.0:
            bmi_cat, bmi_badge = "Overweight", "badge-orange"
        else:
            bmi_cat, bmi_badge = "Obese", "badge-orange"

        # 2. BMR (Mifflin-St Jeor formula)
        # Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
        # Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
        is_male = (gender.lower() != "female")
        if is_male:
            bmr = round(10.0 * weight_kg + 6.25 * height_cm - 5.0 * age + 5.0)
        else:
            bmr = round(10.0 * weight_kg + 6.25 * height_cm - 5.0 * age - 161.0)

        # 3. TDEE (Total Daily Energy Expenditure)
        multiplier = cls.ACTIVITY_MULTIPLIERS.get(activity_level, 1.55)
        tdee = round(bmr * multiplier)

        # 4. Target Calories based on Goal
        target_calories = tdee
        if goal == "lose_weight":
            target_calories = max(1350, tdee - 450)
        elif goal == "build_muscle":
            target_calories = tdee + 350

        # 5. Hydration / Water target (35ml/kg + activity bonus)
        water_liters = round((weight_kg * 0.033) + (0.6 if multiplier > 1.5 else 0.2), 1)
        water_glasses = max(6, round((water_liters * 1000.0) / 250.0))

        # 6. Healthy Weight Range (BMI 18.5 - 24.9)
        min_weight_kg = round(18.5 * (height_m ** 2))
        max_weight_kg = round(24.9 * (height_m ** 2))

        # 7. Secondary Conversions
        total_inches = height_cm / 2.54
        feet = int(total_inches // 12)
        inches = round(total_inches % 12)
        height_formatted = f"{feet}' {inches}\""
        weight_lbs = round(weight_kg * 2.20462, 1)

        # 8. Clinical Disease Advisories
        advisories = []
        if "none" not in diseases and len(diseases) > 0:
            for d in diseases:
                if d in cls.DISEASE_GUIDELINES:
                    advisories.append(cls.DISEASE_GUIDELINES[d])

        return {
            "bmi": bmi,
            "bmi_category": bmi_cat,
            "bmi_badge": bmi_badge,
            "bmr_kcal": bmr,
            "tdee_kcal": tdee,
            "daily_calorie_target_kcal": target_calories,
            "water_intake_liters": water_liters,
            "water_intake_glasses": water_glasses,
            "healthy_weight_range_kg": f"{min_weight_kg} - {max_weight_kg} kg",
            "min_healthy_weight_kg": min_weight_kg,
            "max_healthy_weight_kg": max_weight_kg,
            "height_secondary_display": height_formatted,
            "weight_secondary_lbs": weight_lbs,
            "disease_advisories": advisories
        }


# Demonstration & Test Driver
if __name__ == "__main__":
    print("=" * 60)
    print(" SmartFit Biometrics & Health Analytics (Python Edition)")
    print("=" * 60)

    sample = MeasurementsService.calculate_biometrics(
        age=26,
        gender="male",
        height_cm=178,
        weight_kg=71,
        activity_level="moderate",
        goal="lose_weight",
        diseases=["diabetes", "hypertension"]
    )

    print("\n[Biometric Analytics Report]")
    for k, v in sample.items():
        if k == "disease_advisories":
            print(f"  {k}: {len(v)} clinical guidelines attached:")
            for adv in v:
                print(f"    - {adv['icon']} {adv['title']}: {adv['tip']}")
        else:
            print(f"  {k}: {v}")
