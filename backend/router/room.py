from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from config.database import rooms_collection,rooms_bookings,history_notifications
from models.room import Room,UpdateRoom,RoomBooking,History
from datetime import date, time, datetime

router = APIRouter()


@router.get("/rooms", response_model=List[Room])
async def get_all_rooms():
    rooms_cursor = rooms_collection.find({})
    rooms = []
    async for room_doc in rooms_cursor:
        # Convert MongoDB document to dict
        objectid=room_doc.get("_id")
        room_data = {
            "id":str(objectid),
            "name": room_doc.get("name"),
            "floor": room_doc.get("floor"),
            "capacity": room_doc.get("capacity"),
            "features": room_doc.get("features", []),
            "status": room_doc.get("status", "available"),
        }
        rooms.append(Room(**room_data))
    return rooms

@router.patch("/room/update/{id}")
async def update_room(id:str,room_update:UpdateRoom):
    existing = await rooms_collection.find_one({'_id':ObjectId(id)})
    if not existing:
        raise HTTPException(status_code=404,detail="Room Not Found!!")
    updated_room_data={k:v for k,v in room_update.dict().items() if v is not None}

    result = await rooms_collection.update_one(
        {"_id":ObjectId(id)},
        {"$set":updated_room_data}
        )
    
    return{"msg":"Room Data Updated Successfully"}



@router.patch("/booking/update/{bookingId}")
async def update_room(bookingId: str, room_update: UpdateRoom):
    print("Parsed body:", room_update.dict())
    try:
        obj_id = ObjectId(bookingId)
    except Exception as e:
        print("ObjectId error:", e)
        raise HTTPException(status_code=400, detail="Invalid booking ID format")

    existing = await rooms_bookings.find_one({"_id": obj_id})
    print("Existing record:", existing)
    if not existing:
        raise HTTPException(status_code=404, detail="Room Not Found!!")

    updated_room_data = {}
    for k, v in room_update.dict().items():
        if v is not None:
            print(f"Processing field {k} with value {v} and type {type(v)}")
            if isinstance(v, time):
                updated_room_data[k] = v.strftime("%H:%M:%S")
            elif isinstance(v, date):
                updated_room_data[k] = v.isoformat()
            else:
                updated_room_data[k] = v

    if not updated_room_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    print("Prepared update dict:", updated_room_data)

    result = await rooms_bookings.update_one(
        {"_id": obj_id},
        {"$set": updated_room_data}
    )

    print("Update result:", result.modified_count)

    return {"msg": "Room Data Updated Successfully"}



@router.post('/room/booking')
async def book_room(bookrequest: RoomBooking):
    # Find all bookings for the same room where date ranges overlap
    existingBookings = rooms_bookings.find({
        'roomId': bookrequest.roomId,
        'bookingStartDate': {'$lte': bookrequest.bookingEndDate.isoformat()},
        'bookingEndDate': {'$gte': bookrequest.bookingStartDate.isoformat()}
    })

    async for existingBooking in existingBookings:
        # Parse existing times
        existing_start_time = datetime.strptime(existingBooking['startTime'], "%H:%M:%S").time()
        existing_end_time = datetime.strptime(existingBooking['endTime'], "%H:%M:%S").time()

        # If date overlaps, check time overlap
        if not (bookrequest.endTime <= existing_start_time or bookrequest.startTime >= existing_end_time):
            raise HTTPException(status_code=400, detail='Room Already Booked in this time slot.')

    # Prepare data to insert
    data = bookrequest.dict()
    data['bookingStartDate'] = data['bookingStartDate'].isoformat()
    data['bookingEndDate'] = data['bookingEndDate'].isoformat()
    data['startTime'] = data['startTime'].strftime("%H:%M:%S")
    data['endTime'] = data['endTime'].strftime("%H:%M:%S")

    await rooms_bookings.insert_one(data)
    return {'msg': 'Room Booked Successfully'}



@router.get('/room/bookings/all',response_model=List[RoomBooking])
async def booking_data():
    bookings_cursor = rooms_bookings.find({})
    bookedroomsdata = []
    async for room_doc in bookings_cursor:
        # Convert MongoDB document to dict
        objectid=room_doc.get("_id")
        room_doc['bookingId']=str(objectid)
        bookedroomsdata.append(room_doc)
    return bookedroomsdata


@router.delete('/room/booking/delete/{id}')
async def delete_booking(id:str):
    existing = await rooms_bookings.find_one({'_id':ObjectId(id)})
    if not existing:
        raise HTTPException(status_code=404, detail='Booking Not Found')
    result = await rooms_bookings.delete_one({'_id':ObjectId(id)})

    if result.deleted_count == 1:
        return {'msg': 'Booking Cancelled Successfully'}
    else:
        return {'msg': 'Booking Cancelling Failed'}



@router.get('/recentactivity/all', response_model=List[History])
async def getHistory():
    """Get all recent activities"""
    try:
        notifications = []
        cursor = history_notifications.find({}).sort("timestamp", -1).limit(50)  # Get latest 50 activities
        
        async for notification in cursor:
            notification['id'] = str(notification['_id'])
            notifications.append(notification)
        
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")

@router.post('/recentactivity/post')
async def addHistory(notify: History):
    """Add a new activity to the history"""
    try:
        # Add timestamp if not provided
        if not hasattr(notify, 'timestamp') or not notify.timestamp:
            notify.timestamp = datetime.now()
        
        # Convert to dict and insert
        activity_data = notify.dict()
        result = await history_notifications.insert_one(activity_data)
        
        # Return the created activity with ID
        activity_data['id'] = str(result.inserted_id)
        return {
            "msg": "Activity logged successfully",
            "activity": activity_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log activity: {str(e)}")

@router.delete('/recentactivity/clear')
async def clearHistory():
    """Clear all activity history (admin function)"""
    try:
        result = await history_notifications.delete_many({})
        return {
            "msg": f"Cleared {result.deleted_count} activities",
            "deleted_count": result.deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear activities: {str(e)}")
