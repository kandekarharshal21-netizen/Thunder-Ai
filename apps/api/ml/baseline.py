"""
Baseline Nowcasting Model conforming to Section 14.
Deterministic, robust, physics-informed regression with multi-horizon calibration.
"""
import math
from typing import Dict, Any

class BaselineNowcastModel:
    VERSION = "THANDER-Baseline-v2.4.0"

    def predict_probabilities(self, features: Dict[str, float], horizon_min: int) -> Dict[str, float]:
        """
        Calculates calibrated thunderstorm and lightning probability for the given horizon.
        """
        # Feature weights derived from meteorological literature and IMD case backtests
        w_radar = 0.35 * features.get("norm_dbz", 0.5) + 0.15 * max(0.0, features.get("dbz_trend", 0.0))
        w_sat = 0.20 * features.get("cloud_top_cooling", 0.5) + 0.10 * features.get("cold_core_depth", 0.5)
        w_ltg = 0.25 * features.get("strike_rate", 0.4) * features.get("first_flash_weight", 0.8)
        w_atmo = 0.25 * features.get("norm_cape", 0.6) + 0.10 * features.get("norm_shear", 0.5) - 0.05 * features.get("cin_suppression", 0.2)

        raw_convective_potential = w_radar + w_sat + w_ltg + w_atmo

        # Logistic sigmoid scaling
        def sigmoid(x: float) -> float:
            return 1.0 / (1.0 + math.exp(-6.0 * (x - 0.45)))

        prob_base = sigmoid(raw_convective_potential)

        # Horizon decay: shorter horizons have higher predictability
        decay_factors = {15: 1.05, 30: 0.98, 60: 0.84, 90: 0.68}
        factor = decay_factors.get(horizon_min, 0.80)

        thunder_prob = min(0.98, max(0.05, prob_base * factor))
        lightning_prob = min(0.96, max(0.02, thunder_prob * (0.88 + 0.22 * features.get("strike_rate", 0.4))))

        return {
            "thunderstorm_probability": round(thunder_prob, 2),
            "lightning_probability": round(lightning_prob, 2),
            "convective_score": round(raw_convective_potential, 3)
        }
