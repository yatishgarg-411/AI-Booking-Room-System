from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class BookingInfo(BaseModel):
    bookedBy: EmailStr
    startTime: datetime
    endTime: datetime
    

class Room(BaseModel):
    id: str
    name: str
    floor: str
    capacity: int
    features: List[str]
    status: str = Field(default="available")
    currentBooking: Optional[BookingInfo] = None
    nextBooking: Optional[BookingInfo] = None    


class UpdateRoom(BaseModel):
    features: Optional[List[str]] = None
    status: Optional[str]=None
    currentBooking: Optional[BookingInfo] = None
    nextBooking: Optional[BookingInfo] = None    
