from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Veterinaria API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/owners", response_model=list[schemas.Owner])
def list_owners(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0, le=500),
    db: Session = Depends(get_db),
):
    return crud.get_owners(db, skip=skip, limit=limit)


@app.post("/owners", response_model=schemas.Owner, status_code=201)
def create_owner(owner: schemas.OwnerCreate, db: Session = Depends(get_db)):
    return crud.create_owner(db, owner)


@app.get("/owners/{owner_id}", response_model=schemas.Owner)
def get_owner(owner_id: int, db: Session = Depends(get_db)):
    owner = crud.get_owner(db, owner_id)
    if owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner


@app.post("/owners/{owner_id}/pets", response_model=schemas.Pet, status_code=201)
def create_pet(owner_id: int, pet: schemas.PetCreate, db: Session = Depends(get_db)):
    created = crud.create_pet_for_owner(db, owner_id, pet)
    if created is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return created


@app.get("/owners/{owner_id}/pets", response_model=list[schemas.Pet])
def list_pets_for_owner(
    owner_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0, le=500),
    db: Session = Depends(get_db),
):
    owner = crud.get_owner(db, owner_id)
    if owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    return crud.get_pets_by_owner(db, owner_id, skip=skip, limit=limit)


@app.get("/pets/{pet_id}", response_model=schemas.Pet)
def get_pet(pet_id: int, db: Session = Depends(get_db)):
    pet = crud.get_pet(db, pet_id)
    if pet is None:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet


@app.post(
    "/pets/{pet_id}/appointments",
    response_model=schemas.Appointment,
    status_code=201,
)
def create_appointment(pet_id: int, appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    created = crud.create_appointment_for_pet(db, pet_id, appointment)
    if created is None:
        raise HTTPException(status_code=404, detail="Pet not found")
    return created


@app.get("/pets/{pet_id}/appointments", response_model=list[schemas.Appointment])
def list_appointments_for_pet(
    pet_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0, le=500),
    db: Session = Depends(get_db),
):
    pet = crud.get_pet(db, pet_id)
    if pet is None:
        raise HTTPException(status_code=404, detail="Pet not found")
    return crud.get_appointments_for_pet(db, pet_id, skip=skip, limit=limit)


@app.get("/appointments", response_model=list[schemas.Appointment])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, gt=0, le=500),
    db: Session = Depends(get_db),
):
    return crud.get_appointments(db, skip=skip, limit=limit)
