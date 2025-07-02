from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class BookingInfo(BaseModel):
    bookedBy: EmailStr
    startTime: datetime
    endTime: datetime
    

class Room(BaseModel):
    name: str
    floor: str
    capacity: int
    features: List[str]
    status: str = Field(default="available")
    currentBooking: Optional[BookingInfo] = None
    nextBooking: Optional[BookingInfo] = None    