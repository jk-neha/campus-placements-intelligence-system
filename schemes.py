from pydantic import BaseModel

class Create_Student(BaseModel):
    user_id:int
    name:str
    cgpa:float
    department:str
    skills:str
    
    
class Update_Student(BaseModel):
    name:str
    cgpa:float
    department:str
    skills:str
    
class Create_Company(BaseModel):
    user_id:int
    company_name:str
    minimum_cgpa:float
    required_skills:str
    
    
class Update_Company(BaseModel):
    company_name:str
    minimum_cgpa:float
    required_skills:str
    
class Create_User(BaseModel):
    user_name:str
    user_mail:str
    password:str
    role:str
    
class Login_User(BaseModel):
    user_mail:str
    password:str
    