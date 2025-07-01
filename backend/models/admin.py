from pydantic import BaseModel,EmailStr

class Admin_Signup(BaseModel):
    name:str
    email:EmailStr
    password:str
    
class Admin_Login(BaseModel):
    email:EmailStr
    password:str