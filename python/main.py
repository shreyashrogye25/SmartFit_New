"""
==========================================================================
SMARTFIT - Python Biometrics & BMI CLI Application
Interactive Terminal Interface for Health Analytics
==========================================================================
"""

from bmi_calculator import BMICalculator
from measurements import MeasurementsService


def main():
    print("=" * 65)
    print("        🏋️‍♂️ SMARTFIT HEALTH & BIOMETRICS SYSTEM (PYTHON) 🏋️‍♂️")
    print("=" * 65)
    print("1. Calculate BMI (Body Mass Index)")
    print("2. Calculate Full Biometrics (BMR, TDEE, Calorie Target, Hydration)")
    print("3. Run Verification Tests")
    print("4. Exit")
    print("=" * 65)

    choice = input("Enter choice (1-4): ").strip()

    if choice == "1":
        unit = input("Choose unit - Metric (m) or Imperial (i) [default: m]: ").strip().lower()
        if unit == "i":
            h = float(input("Enter Height in inches (e.g., 69): ") or 69)
            w = float(input("Enter Weight in lbs (e.g., 154): ") or 154)
            res = BMICalculator.calculate_imperial(h, w)
        else:
            h = float(input("Enter Height in cm (e.g., 175): ") or 175)
            w = float(input("Enter Weight in kg (e.g., 70): ") or 70)
            res = BMICalculator.calculate_metric(h, w)

        print("\n--- BMI RESULT ---")
        print(f"BMI Score: {res['bmi']}")
        print(f"Category:  {res['category']}")
        print(f"Healthy Weight Range: {res['healthy_weight_range']}")
        print(f"Clinical Tip: {res['advice']}\n")

    elif choice == "2":
        age = int(input("Enter Age in years (default: 26): ") or 26)
        gender = input("Enter Gender (male/female, default: male): ") or "male"
        h = float(input("Enter Height in cm (default: 178): ") or 178)
        w = float(input("Enter Weight in kg (default: 71): ") or 71)
        print("Activity Levels: sedentary, light, moderate, very_active, extra_active")
        act = input("Enter Activity Level (default: moderate): ") or "moderate"
        print("Goals: maintain, lose_weight, build_muscle")
        goal = input("Enter Fitness Goal (default: maintain): ") or "maintain"
        diseases_in = input("Enter chronic conditions comma-separated (e.g., diabetes,hypertension or none): ") or "none"
        diseases = [d.strip() for d in diseases_in.split(",")]

        res = MeasurementsService.calculate_biometrics(
            age=age,
            gender=gender,
            height_cm=h,
            weight_kg=w,
            activity_level=act,
            goal=goal,
            diseases=diseases
        )

        print("\n" + "=" * 50)
        print("         FULL HEALTH ANALYTICS REPORT")
        print("=" * 50)
        print(f"BMI:                     {res['bmi']} ({res['bmi_category']})")
        print(f"BMR (Basal Metabolism):  {res['bmr_kcal']} kcal/day")
        print(f"TDEE (Daily Burn):       {res['tdee_kcal']} kcal/day")
        print(f"Target Daily Calories:   {res['daily_calorie_target_kcal']} kcal/day")
        print(f"Hydration Target:        {res['water_intake_glasses']} glasses ({res['water_intake_liters']} L)")
        print(f"Healthy Weight Range:    {res['healthy_weight_range_kg']}")
        print(f"Secondary Readout:       {res['height_secondary_display']} | {res['weight_secondary_lbs']} lbs")

        if res["disease_advisories"]:
            print("\nClinical Advisories:")
            for adv in res["disease_advisories"]:
                print(f"  {adv['icon']} {adv['title']}: {adv['tip']}")
        print("=" * 50 + "\n")

    elif choice == "3":
        print("\nRunning automated tests on BMI and Biometrics logic...")
        m = BMICalculator.calculate_metric(175, 70)
        assert m["bmi"] == 22.9, f"Expected 22.9, got {m['bmi']}"
        assert m["category"] == "Normal Weight"

        bio = MeasurementsService.calculate_biometrics(26, "male", 178, 71, "moderate", "lose_weight")
        assert bio["bmi"] == 22.4, f"Expected 22.4, got {bio['bmi']}"
        assert bio["daily_calorie_target_kcal"] > 0
        print("✅ All tests passed successfully!\n")

    else:
        print("Exiting SmartFit CLI.")


if __name__ == "__main__":
    main()
