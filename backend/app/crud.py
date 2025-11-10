from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


def create_owner(db: Session, owner: schemas.OwnerCreate) -> models.Owner:
    db_owner = models.Owner(**owner.dict())
    db.add(db_owner)
    db.commit()
    db.refresh(db_owner)
    return db_owner


def get_owners(db: Session) -> List[models.Owner]:
    return db.query(models.Owner).all()


def get_owner(db: Session, owner_id: int) -> Optional[models.Owner]:
    return db.query(models.Owner).filter(models.Owner.id == owner_id).first()


def create_pet_for_owner(
    db: Session, owner_id: int, pet: schemas.PetCreate
) -> Optional[models.Pet]:
    owner = get_owner(db, owner_id)
    if owner is None:
        return None
    db_pet = models.Pet(**pet.dict(), owner_id=owner_id)
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet


def get_pet(db: Session, pet_id: int) -> Optional[models.Pet]:
    return db.query(models.Pet).filter(models.Pet.id == pet_id).first()


def get_pets_by_owner(db: Session, owner_id: int) -> List[models.Pet]:
    return db.query(models.Pet).filter(models.Pet.owner_id == owner_id).all()


def create_appointment_for_pet(
    db: Session, pet_id: int, appointment: schemas.AppointmentCreate
) -> Optional[models.Appointment]:
    pet = get_pet(db, pet_id)
    if pet is None:
        return None
    scheduled_at = appointment.scheduled_at
    if isinstance(scheduled_at, str):
        scheduled_at = datetime.fromisoformat(scheduled_at)
    db_appointment = models.Appointment(
        **appointment.dict(exclude={"scheduled_at"}),
        scheduled_at=scheduled_at,
        pet_id=pet_id,
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


def get_appointments_for_pet(db: Session, pet_id: int) -> List[models.Appointment]:
    return (
        db.query(models.Appointment)
        .filter(models.Appointment.pet_id == pet_id)
        .order_by(models.Appointment.scheduled_at.desc())
        .all()
    )


def get_appointments(db: Session) -> List[models.Appointment]:
    return db.query(models.Appointment).order_by(models.Appointment.scheduled_at.desc()).all()
