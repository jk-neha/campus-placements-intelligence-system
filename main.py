from fastapi import FastAPI,HTTPException
import fitz
from database import Base, engine
from model import *
Base.metadata.create_all(bind=engine)
from jose import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import Depends
from schemes import (
    Create_Student,
    Update_Student,
    Create_Company,
    Update_Company,
    Create_User,
    Login_User,
    Create_Job,
    Create_Application,
    UpdateApplicationStatus
)



app=FastAPI(
    title="Campus Placements System",version="1.0.0"
)



from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "https://campus-placements-intelligence-syst.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return{"message":"Wecome home"}

from database import Session_Local




def get():
    db=Session_Local()
    try:
        yield db
    # except Exception:
    #     print("Records not found")
    finally:
        db.close()
        

  
#3 DEOCDING USING OAUTH2  
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)
from jose import jwt,JWTError

# def get_current_user(token:str=Depends(oauth2_scheme)):
    # try:
    #     payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    #     email=payload.get("sub")
    #     if email is None:
    #         raise HTTPException(status_code=401,detail="Invalid Token")
    #     return payload
    
    # except JWTError:
    #     raise HTTPException(status_code=401,detail="invalid token")
    
def get_current_user(
    token:str=Depends(oauth2_scheme),
    db:Session=Depends(get)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        user = db.query(Users).filter(
            Users.user_mail == email
        ).first()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
@app.post("/register",tags=["Register"])
def register(user: Create_User, db: Session = Depends(get)):

    existing = db.query(Users).filter(
        Users.user_mail == user.user_mail
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    if user.role not in ["admin", "student", "company"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    new_user = Users(
        user_name=user.user_name,
        user_mail=user.user_mail,
        password=hash_password(user.password),  # 🔥 FIX HERE
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # auto create profile 👇
    if new_user.role == "student":
        db.add(Students(
            user_id=new_user.id,
            registration_number="TEMP",
            name=new_user.user_name,
            cgpa=0,
            department="",
            skills=""
        ))

    elif new_user.role == "company":
        db.add(Companies(
            user_id=new_user.id,
            company_code="TEMP",
            company_name=new_user.user_name,
            minimum_cgpa=0,
            required_skills=""
        ))

    db.commit()

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }
    
# def admin_only(current_user=Depends(get_current_user)):
#     if current_user.role!="admin":
#         raise HTTPException(status_code=403,detail="Admin can Access")
#     return {"id": current_user.id,
#         "name": current_user.user_name,
#         "email": current_user.user_mail,
#         "role": current_user.role}

# def company_only(current_user=Depends(get_current_user)):
#     if current_user.role!="admin":
#         raise HTTPException(status_code=403,detail="Company can access")
#     return {"id": current_user.id,
#         "name": current_user.user_name,
#         "email": current_user.user_mail,
#         "role": current_user.role}
    
# def student_only(current_user=Depends(get_current_user)):
#     if current_user.role!="admin":
#         raise HTTPException(status_code=403,detail="Student can access")
#     return {"id": current_user.id,
#         "name": current_user.user_name,
#         "email": current_user.user_mail,
#         "role": current_user.role}
    
from typing import List
def roles_required(roles:List[str]):
    def role_checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403,detail="Permission Denied")
        return current_user
    return role_checker
    
@app.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {"current_user_id": current_user.id,
        "name": current_user.user_name,
        "email": current_user.user_mail,
        "role": current_user.role}


#ADMIN
@app.post("/admin/create-student")
def create_student(
    student: Create_Student,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["admin"]))
):

    existing_user = db.query(Users).filter(
        Users.user_mail == student.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = Users(
        user_name=student.name,
        user_mail=student.email,
        password=hash_password(student.password),
        role="student"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    student_profile = Students(
        user_id=user.id,
        registration_number=student.registration_number,
        name=student.name,
        cgpa=0,
        department=student.department,
        skills=""
    )

    db.add(student_profile)
    db.commit()
    db.refresh(student_profile)

    return {
    "message": "Student created successfully",
    "student": {
        "id": student_profile.id,
        "name": student_profile.name,
        "registration_number": student_profile.registration_number
    }
}


@app.post("/admin/create-company")
def create_company(
    company: Create_Company,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["admin"]))
):

    existing_user = db.query(Users).filter(
        Users.user_mail == company.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = Users(
        user_name=company.company_name,
        user_mail=company.email,
        password=hash_password(company.password),
        role="company"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    company_profile = Companies(
        user_id=user.id,
        company_code=company.company_code,
        company_name=company.company_name,
        minimum_cgpa=0,
        required_skills=""
    )

    db.add(company_profile)
    db.commit()
    db.refresh(company_profile)

    return {
        "message":"Company created successfully",
        "company":company_profile
    }
    
    
@app.get("/students",tags=["students"])
def get_students(db:Session=Depends(get),current_user=Depends(get_current_user)):
        students=db.query(Students).all()
        return students


# @app.post("/students")
# def insert_student(student:Create_Student,db:Session=Depends(get),current_user=Depends(roles_required(["admin"]))):
#     new_student=Students(
#     name=student.name,
#     cgpa=student.cgpa,
#     skills=student.skills,
#     department=student.department)
#     db.add(new_student)
    
#     db.commit()
    
#     db.refresh(new_student)
    
#     return new_student


# @app.post("/students")
# def insert_student(
#     student: Create_Student,
#     db: Session = Depends(get),
#     current_user=Depends(roles_required(["admin"]))
# ):

#     user = db.query(Users).filter(
#         Users.id == student.user_id,
#         Users.role == "student"
#     ).first()

#     if not user:
#         raise HTTPException(
#             status_code=404,
#             detail="Student user not found"
#         )
#     existing_student = db.query(Students).filter(
#     Students.user_id == student.user_id).first()
#     if existing_student:
#         raise HTTPException(
#         status_code=400,
#         detail="Student profile already exists"
#     )
#     new_student = Students(
#         user_id=student.user_id,
#         name=student.name,
#         cgpa=student.cgpa,
#         department=student.department,
#         skills=student.skills
#     )
    

#     db.add(new_student)
#     db.commit()
#     db.refresh(new_student)

#     return new_student


@app.put("/students/{id}")
def students_update(id:int,students:Update_Student,db:Session=Depends(get),current_user=Depends(roles_required(["student","admin"]))):
    db_student=db.query(Students).filter(Students.id==id).first()
    if not db_student:
        raise HTTPException(status_code=404,detail="Student not found")
    if (current_user.role=="student" and db_student.user_id!=current_user.id):
        raise HTTPException(status_code=403,detail="You can update only your profile")
    db_student.name=students.name
    db_student.cgpa=students.cgpa
    db_student.department=students.department
    db_student.skills=students.skills
    
    db.commit()
    db.refresh(db_student)
    return db_student

    
    
@app.delete("/students/{id}")
def delete_students(id:int,db:Session=Depends(get),current_user=Depends(roles_required(["admin"]))):
    db_students=db.query(Students).filter(Students.id==id).first()
    if db_students is None:
        raise HTTPException(status_code=404,detail="Student not found")
    db.delete(db_students)
    db.commit()
    return {"message":"Students record deleted successfully"}
    

@app.get("/company",tags=["company"])
def get_company(db:Session=Depends(get),curreny_user=Depends(get_current_user)):
    company=db.query(Companies).all()
    return company


# # def insert_company(company:Create_Company,db:Session=Depends(get),curreny_user=Depends(roles_required(["company","admin"]))):
# #     new_company=Companies(
# #     user_id=curreny_user.id,
# #     company_name=company.company_name,
# #     minimum_cgpa=company.minimum_cgpa,
# #     required_skills=company.required_skills,
    
# # )
# #     db.add(new_company)
# #     db.commit()
# #     db.refresh(new_company)
# #     return new_company

# @app.post("/company")
# def insert_company(
#     company: Create_Company,
#     db: Session = Depends(get),
#     current_user=Depends(get_current_user)
# ):
#     if current_user.role not in ["company", "admin"]:
#         raise HTTPException(
#             status_code=403,
#             detail="Only company users can create company profiles"
#         )
#     existing_company = db.query(Companies).filter(
#     Companies.user_id == current_user.id
# ).first()
#     if existing_company:
#         raise HTTPException(
#         status_code=400,
#         detail="Company profile already exists"
#     )
    

#     new_company = Companies(
#         company_name=company.company_name,
#         minimum_cgpa=company.minimum_cgpa,
#         required_skills=company.required_skills,
#         user_id=current_user.id
#     )

#     db.add(new_company)
#     db.commit()
#     db.refresh(new_company)

#     return new_company


@app.put("/company/{id}")
def update_company(id:int,company:Update_Company,db:Session=Depends(get),curreny_user=Depends(roles_required(["company","admin"]))):
    db_update=db.query(Companies).filter(
    Companies.id==id
).first()
    if not db_update:
        raise HTTPException(
        status_code=404,
        detail="Company not found"
    )
    if (
    curreny_user.role=="company"
    and db_update.user_id!=curreny_user.id
):
        raise HTTPException(
        status_code=403,
        detail="You can update only your company profile"
    )
    db_update.company_name=company.company_name
    db_update.minimum_cgpa=company.minimum_cgpa
    db_update.required_skills=company.required_skills
    
    db.commit()
    db.refresh(db_update)
    return db_update

@app.delete("/company/{id}")
def remove_record(id:int,db:Session=Depends(get),curreny_user=Depends(roles_required(["admin"]))):
    db_comapany=db.query(Companies).filter(Companies.id==id).first()
    if not db_comapany:
        raise HTTPException(
        status_code=404,
        detail="Company not found"
    )
    db.delete(db_comapany)
    db.commit()
    return {"msg":"deleted successfully"}


@app.get("/eligibility/{students_id}/{company_id}")
def eligibilit_check(students_id:int,company_id:int,db:Session=Depends(get),curreny_user=Depends(get_current_user)):
    student=db.query(Students).filter(Students.id==students_id).first()
    company=db.query(Companies).filter(Companies.id==company_id).first()
    if not student: 
        raise HTTPException(status_code=404,detail="Student not found")
    if not company :
        raise HTTPException(status_code=404,detail="Company not found")
    
    # eligible=student.cgpa>=company.minimum_cgpa
    # student_skilss=student.skills.split(",")
    # company_skill=company.required_skills.split(",")
    
    
    student_skills = [
    s.strip().lower()
    for s in student.skills.split(",")
]

    company_skills = [
    s.strip().lower()
    for s in company.required_skills.split(",")
]

    matching_skills = 0
    missing_skill=[]

    for skill in company_skills:
        if skill in student_skills:
            matching_skills += 1
        else:
            missing_skill.append(skill)

    
    if len(company_skills)==0:
        readiness_score=0
    else:
        readiness_score = (
    matching_skills / len(company_skills)
) * 100
        
    status=""
    if readiness_score >=0 and readiness_score<=40:
        status="Needs Improvement"
    elif readiness_score>40 and readiness_score<=70:
        status="Average"
    else:
        status="Placement Ready"
    
    eligible = (
    student.cgpa >= company.minimum_cgpa
    and len(missing_skill) == 0
)
    return{
            "student":student.name,
            "student_cgpa":student.cgpa,
            "company":company.company_name,
            "company_required_cgpa":company.minimum_cgpa,
            "eligible":eligible,
            "missing_skills":missing_skill,
            "readiness_score":readiness_score,
            "Status":status
        }
    
@app.get("/recommendations/{students_id}")
def get_recommendations(students_id:int, db:Session=Depends(get),current_user=Depends(get_current_user)):
    student = db.query(Students).filter(
        Students.id == students_id
    ).first()
    if not student:
        raise HTTPException(status_code=404,detail="Studenr not found")
    companies = db.query(Companies).all()
    if (
    current_user.role=="student"
    and student.user_id!=current_user.id
):
        raise HTTPException(
        status_code=403,
        detail="Access denied"
    )
    recommendations = []
    for comp in companies:
        student_skills = {
        s.strip().lower()
        for s in student.skills.split(",")
        if s.strip()
    }
        company_skills = {
        s.strip().lower()
        for s in comp.required_skills.split(",")
        if s.strip()
    }
        missing_skills = list(
        company_skills - student_skills
    )
        if len(company_skills) == 0:
            readiness_score = 100
        else:
            readiness_score = (
            (len(company_skills) - len(missing_skills))
            / len(company_skills)
        ) * 100
        recommendations.append({
        "company": comp.company_name,
        "eligible": (
            student.cgpa >= comp.minimum_cgpa
            and len(missing_skills) == 0
        ),
        "readiness_score": readiness_score,
        "missing_skills": missing_skills
    })
    recommendations.sort(
    key=lambda x: x["readiness_score"],
    reverse=True
)

    return recommendations


# @app.get("/recommenadations_readiness_status/{students_id}/{company_id}")
# def get_recommenadtions_score(students_id:int,company_id:int,db:Session=Depends(get)):
#     student=db.query(Students).filter(Students.id==students_id).first()
#     company=db.query(Companies).filter(Companies.id==company_id).first()
    
   
#     student_skilss=student.skills.split(",")
#     company_skill=company.required_skills.split(",")
    
    
#     matching_skills = 0
#     missing_skill=[]

#     for skill in company_skill:

#         if skill in student_skilss:
#             matching_skills += 1
#         else:
#             missing_skill.append(skill)

#     readiness_score = (
#     matching_skills / len(company_skill)
# ) * 100
    
#     status=""
#     if readiness_score >=0 and readiness_score<=40:
#         status="Needs Improvement"
#     elif readiness_score>40 and readiness_score<=70:
#         status="Average"
#     else:
#         status="Placement Ready"    
    
#     return{
#             "company":company.company_name,
#             "readiness_score":readiness_score,
#             "Status":status
#         }
    
    
@app.get("/student-placement-analysis/{student_id}")
def ers(student_id:int,db:Session=Depends(get),curreny_user=Depends(get_current_user)):
    student=db.query(Students).filter(Students.id==student_id).first()
    company=db.query(Companies).all()
    if not student:
        raise HTTPException(
        status_code=404,
        detail="Student not found"
    )
    if (curreny_user.role == "student"and student.user_id != curreny_user.id
):
        raise HTTPException(
        status_code=403,
        detail="Access denied"
    )
    recommendations=[]
    for comp in company:
        matching_skills=0
        missing_skills=[]
        # student_skills=student.skills.split(",")
        # company_skills=comp.required_skills.split(",")
        student_skilss = [s.strip().lower() for s in student.skills.split(",")]
        company_skill = [s.strip().lower()for s in comp.required_skills.split(",")
]
        for skills in company_skill:
            if skills in student_skilss:
                matching_skills+=1
            else:
                missing_skills.append(skills)
        # readiness_score =(matching_skills/len(company_skills))*100
        if len(company_skill) == 0:
             readiness_score = 0
        else:
            readiness_score = (matching_skills / len(company_skill)) * 100
       
        status=""
        if readiness_score >=0 and readiness_score<=40:
            status="Needs Improvement"
        elif readiness_score>40 and readiness_score<=70:
            status="Average"
        else:
            status="Placement Ready"  
        eligiblity=(student.cgpa>=comp.minimum_cgpa) and len(missing_skills)==0
        recommendations.append(
    {
        "company": comp.company_name,
        "eligible": eligiblity,
        "missing_skills":missing_skills,
        "readiness_score": readiness_score,
        "status": status
    }
)
    recommendations.sort(
    key=lambda x: x["readiness_score"],
    reverse=True)
    
    return recommendations

# from fastapi import UploadFile,File
# import fitz

# @app.post("/resume-upload")
# async def upload_resume(file:UploadFile=File(...),current_user=Depends(roles_required(["student"]))):
#     pdf_bytes=await file.read()
#     pdf=fitz.open(stream=pdf_bytes,filetype="pdf")
#     extracted_text=""
#     for pages in pdf:
#         extracted_text+=pages.get_text()
        
#     known_skills=[
#     "Python",
#     "SQL",
#     "PostgreSQL",
#     "FastAPI",
#     "Django",
#     "Flask",
#     "Pandas",
#     "NumPy",
#     "Machine Learning",
#     "Docker",
#     "Git",
#     "AWS"
# ]
#     found_skills=[]
#     for skills in known_skills:
#         if skills.lower() in extracted_text.lower():
#             found_skills.append(skills)
            
#     return (
#         {
#             "resume_text":extracted_text,
#             "skills":found_skills
#         }
  
#   )
##resumew-uplopad
from fastapi import UploadFile, File, Depends
import fitz

@app.post("/resume-upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(roles_required(["student"])),
    db: Session = Depends(get)
):
    pdf_bytes = await file.read()

    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

    extracted_text = ""

    for page in pdf:
        extracted_text += page.get_text()

    known_skills = [
        "Python",
        "SQL",
        "PostgreSQL",
        "FastAPI",
        "Django",
        "Flask",
        "Pandas",
        "NumPy",
        "Machine Learning",
        "Docker",
        "Git",
        "AWS"
    ]

    found_skills = []

    for skill in known_skills:
        if skill.lower() in extracted_text.lower():
            found_skills.append(skill)

    # Find logged-in student's record
    student = db.query(Students).filter(
        Students.user_id == current_user.id
    ).first()

    if student:
        existing_skills = set()
        if student.skills:
            existing_skills = {
        s.strip().lower()
        for s in student.skills.split(",")
        if s.strip()
    }
        new_skills = {s.lower() for s in found_skills
}

        merged_skills = sorted(existing_skills.union(new_skills))

        student.skills = ",".join(merged_skills)

        db.commit()
        db.refresh(student)

    return {
        "resume_text": extracted_text,
        "skills": found_skills
    } 
    
    
##1. PASSWORD HASING

from schemes import Create_User,Login_User
from passlib.context import CryptContext
from database import engine,Base

#cerate usre tbael:
# Base.metadata.create_all(bind=engine)

pswd_conext=CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password):
    return pswd_conext.hash(password)

def verify_password(plain_password,hased_password):
    return pswd_conext.verify(plain_password,hased_password)

# @app.post("/register_user",tags=["Register"])
# def register(user:Create_User,db:Session=Depends(get)):
#     existing_user=db.query(Users).filter(Users.user_mail==user.user_mail).first()
#     if existing_user:
#         return{
            
#             "msg":"Email already exists"
#         }
#     ALLOWED_ROLES = {"admin", "student", "company"}
    
#     if user.role.lower() not in ALLOWED_ROLES:
#         raise HTTPException(
#         status_code=400,
#         detail="Invalid role"
#     )

#     new_user=Users(
#     user_name=user.user_name,
#     user_mail=user.user_mail,
#     password=hash_password(user.password),
#     role=user.role.lower()
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     if new_user.role == "student":
#         student_profile = Students(
#         user_id=new_user.id,
#         name=new_user.user_name,
#         cgpa=0,
#         department="",
#         skills=""
#     )
#         db.add(student_profile)
#     elif new_user.role == "company":
#         company_profile = Companies(
#         user_id=new_user.id,
#         company_name=new_user.user_name,
#         minimum_cgpa=0,
#         required_skills=""
#     )
#         db.add(company_profile)
#     db.commit()
#     return {"msg":"user Registered Successfully"}



##TOKEN JWT
from dotenv import load_dotenv
load_dotenv()

import os

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found")


ALGORITHM="HS256"

ACCESS_TOKEN_EXPIRE_MINUTES=30

REFRESH_TOKEN_EXPIRE_DAYS=7


def create_access_token(data:dict):

    to_encode=data.copy()

    expire=datetime.utcnow()+timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {"exp":expire}
    )

    encoded_jwt=jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(data:dict):
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp":expire})
    refresh_token=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return refresh_token


from fastapi.security import OAuth2PasswordRequestForm

@app.post("/login",tags=["Authentication"])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get)
):

    db_user = db.query(Users).filter(
        Users.user_mail == form_data.username
    ).first()

    if db_user is None:
        raise HTTPException(status_code=401,detail="Invalid Email")

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(status_code=401,detail="Invalid Password")

    access_token = create_access_token(
        {"sub": db_user.user_mail,
         "role":db_user.role}
    )
    refresh_token=create_refresh_token(
        {
            "sub":db_user.user_mail
        }
    )

    return {
        "access_token": access_token,
        "refresh_token":refresh_token,
        "token_type": "bearer"
    }
    
    
# @app.post("/refresh_tokens")
# def token_Refresh(refresh_token:str,db:Session=Depends(get)):
#     try:
#         payload=jwt.decode(refresh_token,SECRET_KEY,algorithms=[ALGORITHM])
#         email=payload.get("sub")
#         user=db.query(Users).filter(Users.user_mail==email).first()
#         if not user:
#             raise HTTPException(status_code=404,detail="User not found")
#         new_refresh_acces_token=create_access_token({"sub":email,"role":user.role})
#         return{"access token":new_refresh_acces_token}
#     except JWTError:
#         raise HTTPException(status_code=401,detail="Invalid Refresh tokens")
from pydantic import BaseModel

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@app.post("/refresh_tokens")
def token_refresh(
    data: RefreshTokenRequest,
    db: Session = Depends(get)
):
    try:
        payload = jwt.decode(
            data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        user = db.query(Users).filter(
            Users.user_mail == email
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        access_token = create_access_token(
            {
                "sub": user.user_mail,
                "role": user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Refresh Token"
        )
@app.get("/student/me")
def my_profile(
    current_user=Depends(
        roles_required(["student"])
    ),
    db: Session = Depends(get)
):

    student = db.query(
        Students
    ).filter(
        Students.user_id == current_user.id
    ).first()

    return student

@app.get("/company/me")
def my_company(
    current_user=Depends(
        roles_required(["company"])
    ),
    db: Session = Depends(get)
):

    company = db.query(
        Companies
    ).filter(
        Companies.user_id == current_user.id
    ).first()

    return company

@app.get("/users/students")
def get_student_users(
    db: Session = Depends(get),
    current_user=Depends(roles_required(["admin"]))
):
    users = db.query(Users).filter(
        Users.role == "student"
    ).all()

    return users


@app.get("/users/companies")
def get_company_users(
    db: Session = Depends(get),
    current_user=Depends(roles_required(["admin"]))
):
    return db.query(Users).filter(
        Users.role=="company"
    ).all()
    
    
@app.get("/company/eligible-students")
def eligible_students(
    current_user=Depends(
        roles_required(["company"])
    ),
    db: Session = Depends(get)
):
    company = db.query(Companies).filter(
    Companies.user_id == current_user.id
).first()
    if not company:raise HTTPException(
        status_code=404,
        detail="Company profile not found"
    )
    students = db.query(Students).all()
    eligible_students = []

    for student in students:
        student_skills = [
    s.strip().lower()
    for s in student.skills.split(",")
    if s.strip()
]
        company_skills = [
    s.strip().lower()
    for s in company.required_skills.split(",")
    if s.strip()
]

        eligible = (
        student.cgpa >= company.minimum_cgpa
        and all(
            skill in student_skills
            for skill in company_skills
        )
    )

        if eligible:
            eligible_students.append(student)

    return eligible_students
    
    
##JOBS:
from datetime import datetime

@app.post("/jobs")
def create_job(
    job: Create_Job,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["company"]))
):

    company = db.query(Companies).filter(
        Companies.user_id == current_user.id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company profile not found"
        )

    new_job = Jobs(
        company_id=company.id,
        title=job.title,
        description=job.description,
        salary=job.salary,
        deadline=datetime.strptime(
            job.deadline,
            "%Y-%m-%d"
        ).date()
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

@app.get("/jobs")
def get_jobs(
    db: Session = Depends(get),
    current_user=Depends(get_current_user)
):
    return db.query(Jobs).all()

@app.post("/apply")
def apply_job(
    application: Create_Application,
    db: Session = Depends(get),
    current_user=Depends(
        roles_required(["student"])
    )
):

    student = db.query(Students).filter(
        Students.user_id == current_user.id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    job = db.query(Jobs).filter(
        Jobs.id == application.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    already_applied = db.query(
        Applications
    ).filter(
        Applications.student_id == student.id,
        Applications.job_id == job.id
    ).first()

    if already_applied:
        raise HTTPException(
            status_code=400,
            detail="Already applied"
        )

    new_application = Applications(
        student_id=student.id,
        job_id=job.id,
        status="Applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return {
        "message":"Application submitted"
    }
    
# @app.get("/student/applications")
# def my_applications(
#     db: Session = Depends(get),
#     current_user=Depends(
#         roles_required(["student"])
#     )
# ):

#     student = db.query(Students).filter(
#         Students.user_id == current_user.id
#     ).first()

#     return db.query(Applications).filter(
#         Applications.student_id == student.id
#     ).all()
    
    
@app.get("/student/applications")
def my_applications(
    db: Session = Depends(get),
    current_user=Depends(roles_required(["student"]))
):

    student = db.query(Students).filter(
        Students.user_id == current_user.id
    ).first()

    applications = db.query(Applications).filter(
        Applications.student_id == student.id
    ).all()

    result = []

    for app in applications:
        job = db.query(Jobs).filter(Jobs.id == app.job_id).first()
        company = db.query(Companies).filter(Companies.id == job.company_id).first()

        result.append({
            "application_id": app.id,
            "job_title": job.title,
            "company": company.company_name,
            "status": app.status,
            "salary": job.salary,
            "deadline": job.deadline
        })

    return result


@app.get("/company/applications")
def company_applications(
    db: Session = Depends(get),
    current_user=Depends(
        roles_required(["company"])
    )
):

    company = db.query(Companies).filter(
        Companies.user_id == current_user.id
    ).first()

    jobs = db.query(Jobs).filter(
        Jobs.company_id == company.id
    ).all()

    job_ids = [job.id for job in jobs]

    applications = db.query(
        Applications
    ).filter(
        Applications.job_id.in_(job_ids)
    ).all()

    return applications

# @app.put("/applications/{application_id}/status")
# def update_status(
#     application_id:int,
#     data:UpdateApplicationStatus,
#     db:Session=Depends(get),
#     current_user=Depends(
#         roles_required(["company"])
#     )
# ):

#     application = db.query(
#         Applications
#     ).filter(
#         Applications.id == application_id
#     ).first()

#     if not application:
#         raise HTTPException(
#             status_code=404,
#             detail="Application not found"
#         )

#     application.status = data.status

#     db.commit()
#     db.refresh(application)

#     return application

@app.put("/applications/{application_id}/status")
def update_status(
    application_id: int,
    data: UpdateApplicationStatus,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["company"]))
):

    application = db.query(Applications).filter(
        Applications.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    valid_status = ["Applied", "Under Review", "Shortlisted", "Rejected", "Selected"]

    if data.status not in valid_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    application.status = data.status
    db.commit()
    db.refresh(application)

    return {
        "message": "Status updated",
        "application_id": application.id,
        "status": application.status
    }


#compamy side applications filetr:
@app.get("/company/applications/{status}")
def filter_company_applications(
    status: str,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["company"]))
):

    company = db.query(Companies).filter(
        Companies.user_id == current_user.id
    ).first()

    jobs = db.query(Jobs).filter(
        Jobs.company_id == company.id
    ).all()

    job_ids = [j.id for j in jobs]

    return db.query(Applications).filter(
        Applications.job_id.in_(job_ids),
        Applications.status == status
    ).all()
    
    
#admin-registeration
@app.post("/admin/create-admin")
def create_admin(
    admin: Create_User,
    db: Session = Depends(get),
    current_user=Depends(roles_required(["admin"]))
):
    existing = db.query(Users).filter(
        Users.user_mail == admin.user_mail
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = Users(
        user_name=admin.user_name,
        user_mail=admin.user_mail,
        password=hash_password(admin.password),
        role="admin"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Admin created successfully",
        "id": user.id
    }