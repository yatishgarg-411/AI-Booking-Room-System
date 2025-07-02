from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from config.database import rooms_collection
from models.room import Room,UpdateRoom

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

        if room_data["status"] == "booked":
            if "currentBooking" in room_doc and room_doc["currentBooking"]:
                room_data["currentBooking"] = room_doc["currentBooking"]
            if "nextBooking" in room_doc and room_doc["nextBooking"]:
                room_data["nextBooking"] = room_doc["nextBooking"]

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

