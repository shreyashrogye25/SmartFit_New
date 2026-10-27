"""
==========================================================================
SMARTFIT - BMI Calculator Module (Python Implementation)
Metric and Imperial biometrics, dynamic category classification,
healthy weight spectrum, and clinical lifestyle advisory.
==========================================================================
"""

from typing import Dict, Any, Tuple


class BMICalculator:
    """
    Calculates Body Mass Index (BMI), healthy weight spectrum,
    and lifestyle health recommendations in both Metric and Imperial units.
    """

    @staticmethod
    def calculate_metric(height_cm: float, weight_kg: float) -> Dict[str, Any]:
        """
        Calculate BMI using Metric Units (height in cm, weight in kg).
        Formula: BMI = weight (kg) / (height (m) ^ 2)
        """
        if height_cm <= 0 or weight_kg <= 0:
            raise ValueError("Height and weight must be greater than zero.")

        height_m = height_cm / 100.0
        bmi = round(weight_kg / (height_m ** 2), 1)

        healthy_weight_min = round(18.5 * (height_m ** 2))
        healthy_weight_max = round(24.9 * (height_m ** 2))

        category, badge_class, advice = BMICalculator._classify_bmi(bmi)

        return {
            "bmi": bmi,
            "unit": "metric",
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "category": category,
            "badge_class": badge_class,
            "advice": advice,
            "healthy_weight_range": f"{healthy_weight_min} - {healthy_weight_max} kg",
            "healthy_min_kg": healthy_weight_min,
            "healthy_max_kg": healthy_weight_max
        }

    @staticmethod
    def calculate_imperial(height_inches: float, weight_lbs: float) -> Dict[str, Any]:
        """
        Calculate BMI using Imperial Units (height in inches, weight in lbs).
        Formula: BMI = (703 * weight (lbs)) / (height (inches) ^ 2)
        """
        if height_inches <= 0 or weight_lbs <= 0:
            raise ValueError("Height and weight must be greater than zero.")

        bmi = round((703.0 * weight_lbs) / (height_inches ** 2), 1)

        healthy_weight_min = round((18.5 * (height_inches ** 2)) / 703.0)
        healthy_weight_max = round((24.9 * (height_inches ** 2)) / 703.0)

        category, badge_class, advice = BMICalculator._classify_bmi(bmi)

        return {
            "bmi": bmi,
            "unit": "imperial",
            "height_inches": height_inches,
            "weight_lbs": weight_lbs,
            "category": category,
            "badge_class": badge_class,
            "advice": advice,
            "healthy_weight_range": f"{healthy_weight_min} - {healthy_weight_max} lbs",
            "healthy_min_lbs": healthy_weight_min,
            "healthy_max_lbs": healthy_weight_max
        }

    @staticmethod
    def _classify_bmi(bmi: float) -> Tuple[str, str, str]:
        """
        Classifies BMI into standard WHO clinical categories and advice.
        """
        if bmi < 18.5:
            return (
                "Underweight",
                "badge-cyan",
                "You are below the standard weight range. Consider adding calorie-dense, nutrient-rich foods and resistance training."
            )
        elif bmi < 25.0:
            return (
                "Normal Weight",
                "badge-green",
                "Your BMI is in the optimal healthy range. Continue your balanced lifestyle and regular hydration!"
            )
        elif bmi < 30.0:
            return (
                "Overweight",
                "badge-orange",
                "Slightly above the normal range. Moderate aerobic activity and portion control will help you reach your ideal target."
            )
        else:
            return (
                "Obese Range",
                "badge-orange",
                "Consult a certified fitness specialist or nutritionist for a structured cardiovascular and dietary plan."
            )

    @staticmethod
    def convert_units(val: float, from_unit: str, to_unit: str) -> float:
        """Helper for unit conversions between metric and imperial."""
        if from_unit == "cm" and to_unit == "in":
            return round(val / 2.54, 1)
        elif from_unit == "in" and to_unit == "cm":
            return round(val * 2.54, 1)
        elif from_unit == "kg" and to_unit == "lbs":
            return round(val * 2.20462, 1)
        elif from_unit == "lbs" and to_unit == "kg":
            return round(val / 2.20462, 1)
        return val


# Demonstration & Test Driver
if __name__ == "__main__":
    print("=" * 60)
    print(" SmartFit BMI Calculator (Python Edition)")
    print("=" * 60)

    # Test Metric
    metric_res = BMICalculator.calculate_metric(height_cm=175, weight_kg=70)
    print("\n[Metric Test: 175 cm, 70 kg]")
    for k, v in metric_res.items():
        print(f"  {k}: {v}")

    # Test Imperial
    imperial_res = BMICalculator.calculate_imperial(height_inches=69, weight_lbs=154)
    print("\n[Imperial Test: 69 in, 154 lbs]")
    for k, v in imperial_res.items():
        print(f"  {k}: {v}")
