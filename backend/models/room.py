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

