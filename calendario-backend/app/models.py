from sqlalchemy import Column, Integer, String, DateTime, Text
from .database import Base
import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    start = Column(DateTime, nullable=False)
    end = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)
    color = Column(String, default="#3788d8")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)