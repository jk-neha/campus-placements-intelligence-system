from pydantic import BaseModel

class Create_Student(BaseModel):
    registration_number:str
    name:str
    email:str
    password:str
    department:str
    
class Update_Student(BaseModel):
    name:str
    cgpa:float
    department:str
    skills:str
    
class Create_Company(BaseModel):
    company_code:str
    company_name:str
    email:str
    password:str
    
    
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
    
class Create_Job(BaseModel):
    title:str
    description:str
    salary:str
    deadline:str
    status:str
    
class Create_Application(BaseModel):
    job_id:int
    
class UpdateApplicationStatus(BaseModel):
    status:str