from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class AppointmentBase(BaseModel):
    scheduled_at: datetime
    reason: str
    veterinarian: Optional[str] = None
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class Appointment(AppointmentBase):
    id: int
    pet_id: int

    class Config:
        orm_mode = True


class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None


class PetCreate(PetBase):
    pass


class Pet(PetBase):
    id: int
    owner_id: int
    appointments: List[Appointment] = Field(default_factory=list)

    class Config:
        orm_mode = True


class OwnerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


class OwnerCreate(OwnerBase):
    pass


class Owner(OwnerBase):
    id: int
    pets: List[Pet] = Field(default_factory=list)

    class Config:
        orm_mode = True
