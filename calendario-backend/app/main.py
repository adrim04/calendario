from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import engine, get_db


# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Inicializar la aplicación FastAPI
app = FastAPI(
    title="Calendario API",
    description="API para gestionar eventos del calendario",
    version="1.0.0"
)

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta raíz
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API del Calendario"}

# Obtener todos los eventos
@app.get("/events/", response_model=List[schemas.Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, skip=skip, limit=limit)
    return events

# Obtener un evento específico por ID
@app.get("/events/{event_id}", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return db_event

# Crear un nuevo evento
@app.post("/events/", response_model=schemas.Event, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

# Actualizar un evento existente
@app.put("/events/{event_id}", response_model=schemas.Event)
def update_event(event_id: int, event: schemas.EventUpdate, db: Session = Depends(get_db)):
    db_event = crud.update_event(db=db, event_id=event_id, event=event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return db_event

# Eliminar un evento
@app.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    success = crud.delete_event(db=db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return None