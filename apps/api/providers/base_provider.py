import abc
import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class BaseWeatherProvider(abc.ABC):
    @abc.abstractmethod
    def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    def get_forecast(self, lat: float, lon: float, hours: int = 24) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    def get_history(self, lat: float, lon: float, days: int = 1) -> Dict[str, Any]:
        pass

class BaseRadarProvider(abc.ABC):
    @abc.abstractmethod
    def get_radar_station(self, station_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    def get_frames(self, station_id: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

class BaseSatelliteProvider(abc.ABC):
    @abc.abstractmethod
    def get_latest_product(self) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    def get_frames(self) -> List[Dict[str, Any]]:
        pass

class BaseLightningProvider(abc.ABC):
    @abc.abstractmethod
    def get_recent_strikes(self, limit: int = 100) -> List[Dict[str, Any]]:
        pass

    @abc.abstractmethod
    def get_density(self) -> Dict[str, Any]:
        pass

    @abc.abstractmethod
    def get_trend(self) -> List[Dict[str, Any]]:
        pass
