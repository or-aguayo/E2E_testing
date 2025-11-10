from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    species = Column(String(120), nullable=False)
    breed = Column(String(120), nullable=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=False)

    owner = relationship("Owner", back_populates="pets")
    appointments = relationship(
        "Appointment", back_populates="pet", cascade="all, delete-orphan"
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    scheduled_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    reason = Column(Text, nullable=False)
    veterinarian = Column(String(120), nullable=True)
    notes = Column(Text, nullable=True)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)

    pet = relationship("Pet", back_populates="appointments")
