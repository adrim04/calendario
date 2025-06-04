from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Esquema base para eventos
class EventBase(BaseModel):
    title: str
    start: datetime
    end: datetime
    description: Optional[str] = None
    color: Optional[str] = "#3788d8"
    completed: Optional[bool] = False  # NUEVO: Campo para completado

# Esquema para crear eventos
class EventCreate(EventBase):
    pass

# Esquema para actualizar eventos
class EventUpdate(BaseModel):
    title: Optional[str] = None
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    description: Optional[str] = None
    color: Optional[str] = None
    completed: Optional[bool] = None  # NUEVO: Permitir actualizar estado completado

# Esquema para respuesta de eventos
class Event(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True  # Para versiones recientes de Pydantic

# NUEVO: Esquema específico para cambiar estado de completado
class EventToggleComplete(BaseModel):
    completed: bool
