from pydantic import BaseModel,EmailStr

class User_Signup(BaseModel):
    name:str
    email:EmailStr
    password:str
    
class User_Login(BaseModel):
    email:EmailStr
    password:str