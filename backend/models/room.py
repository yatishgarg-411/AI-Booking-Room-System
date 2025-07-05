from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime,date,time

# class BookingInfo(BaseModel):
#     bookedBy: EmailStr
#     startTime: datetime
#     endTime: datetime
    

# class Room(BaseModel):
#     id: str
#     name: str
#     floor: str
#     capacity: int
#     features: List[str]
#     status: str = Field(default="available")
#     currentBooking: Optional[BookingInfo] = None
#     nextBooking: Optional[BookingInfo] = None    


# class UpdateRoom(BaseModel):
#     features: Optional[List[str]] = None
#     status: Optional[str]=None
#     currentBooking: Optional[BookingInfo] = None
#     nextBooking: Optional[BookingInfo] = None    

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime,date,time


class Room(BaseModel):
    id: str
    name: str
    floor: str
    capacity: int
    features: List[str]
    status: str = Field(default="available")


class UpdateRoom(BaseModel):
    status:Optional[str]=None
    endTime: Optional[time]=None
    bookingEndDate: Optional[date]=None
    features: Optional[List[str]]=None

     
class Room(BaseModel):
    id: str
    name: str
    floor: str
    capacity: int
    features: List[str]
    status: str = Field(default="available")

   
class RoomBooking(BaseModel):
    bookingId:str
    roomId:str
    room_name: str
    bookedBy: EmailStr
    bookingStartDate: date
    bookingEndDate: date
    startTime: time
    endTime: time
    purpose:str

class History(BaseModel):
    id: Optional[str] = None
    timestamp: Optional[datetime] = None
    type: str  # 'booking', 'room_status_change', 'room_settings'
    action: str  # 'created', 'cancelled', 'extended', 'released', 'marked_available', 'marked_unavailable', 'updated'
    roomName: str
    roomId: str
    user: str
    details: str
    bookingDetails: Optional[dict] = None  # For booking-related activities
    changes: Optional[dict] = None  # For settings changes
