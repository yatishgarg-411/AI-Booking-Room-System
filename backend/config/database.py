import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGOURI=os.getenv('MONGOURI')

if not MONGOURI:
    raise Exception("MONGOURI not found. Check your .env file or load_dotenv()")

client=AsyncIOMotorClient(MONGOURI)
db=client['Hotel']
user_collection=db['users']
admin_collection=db['admins']
rooms_collection=db['rooms']
rooms_bookings=db['room_bookings']
history_notifications=db['history']