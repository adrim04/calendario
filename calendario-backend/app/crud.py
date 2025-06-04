from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

# Obtener todos los eventos
def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Event).offset(skip).limit(limit).all()

# Obtener un evento por ID
def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

# Crear un nuevo evento
def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        title=event.title,
        start=event.start,
        end=event.end,
        description=event.description,
        color=event.color,
        completed=event.completed or False  # NUEVO: Incluir campo completado
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Actualizar un evento existente
def update_event(db: Session, event_id: int, event: schemas.EventUpdate):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        update_data = event.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_event, key, value)
        db_event.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_event)
    return db_event

# NUEVO: Función específica para cambiar estado de completado
def toggle_event_complete(db: Session, event_id: int, completed: bool):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db_event.completed = completed
        db_event.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_event)
    return db_event

# Eliminar un evento
def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False
