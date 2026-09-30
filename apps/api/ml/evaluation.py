"""
Model Evaluation and Verification Metrics module.
Calculates POD (Probability of Detection), FAR (False Alarm Ratio), CSI (Critical Success Index), and Brier Score.
"""
from typing import Dict, Any, List

def compute_contingency_metrics(hits: int, misses: int, false_alarms: int, correct_negatives: int) -> Dict[str, float]:
    total_events = hits + misses
    total_forecasts = hits + false_alarms
    
    pod = hits / total_events if total_events > 0 else 0.0
    far = false_alarms / total_forecasts if total_forecasts > 0 else 0.0
    csi = hits / (hits + misses + false_alarms) if (hits + misses + false_alarms) > 0 else 0.0
    
    return {
        "pod": round(pod, 3),
        "far": round(far, 3),
        "csi": round(csi, 3),
        "hits": hits,
        "misses": misses,
        "false_alarms": false_alarms,
        "correct_negatives": correct_negatives
    }

def compute_brier_score(forecast_probs: List[float], observed_binary: List[int]) -> float:
    if not forecast_probs or len(forecast_probs) != len(observed_binary):
        return 0.0
    total_sq_err = sum((p - o) ** 2 for p, o in zip(forecast_probs, observed_binary))
    return round(total_sq_err / len(forecast_probs), 4)
