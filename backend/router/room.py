from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from config.database import rooms_collection
from models.room import Room

router = APIRouter()


@router.get("/rooms", response_model=List[Room])
async def get_all_rooms():
    rooms_cursor = rooms_collection.find({})
    rooms = []
    async for room_doc in rooms_cursor:
        # Convert MongoDB document to dict
        room_data = {
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
