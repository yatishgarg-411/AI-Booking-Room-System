from fastapi import APIRouter,HTTPException
from models.user import User_Signup, User_Login
from config.database import user_collection,admin_collection
from auth.jwt_handler import create_token


router=APIRouter()

@router.post("/user/signup")
async def user_signup(user:User_Signup):
    existing = await user_collection.find_one({'email':user.email})
    if existing:
        raise HTTPException(status_code=404,detail="User already Exists!!")
    await user_collection.insert_one(user.dict())
    return{'msg':"Signed Up Successfully"}

@router.post("/user/login")
async def user_login(user: User_Login):
    existing = await user_collection.find_one({'email': user.email, 'password': user.password} )
    if not existing:
        raise HTTPException(status_code=404, detail="user does not exiats")
    token=create_token({'email':existing['email']})
    return {'msg': "Login Successful",'token':token}

@router.post("/admin/signup")
async def user_signup(user:User_Signup):
    existing = await admin_collection.find_one({'email':user.email})
    if existing:
        raise HTTPException(status_code=404,detail="User already Exists!!")
    await admin_collection.insert_one(user.dict())
    return{'msg':"Signed Up Successfully"}

@router.post("/admin/login")
async def user_login(user: User_Login):
    existing = await admin_collection.find_one({'email': user.email, 'password': user.password})
    if not existing:
        raise HTTPException(status_code=404, detail="user does not exiats")
    token=create_token({'email':existing['email']})
    return {'msg': "Login Successful",'token':token}