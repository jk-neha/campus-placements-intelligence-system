from database import Base
from sqlalchemy import Column,Integer,String,DECIMAL,ForeignKey
from sqlalchemy.orm import relationship  
class Students(Base):
    __tablename__="students"
    id=Column(Integer,primary_key=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    name=Column(String)
    cgpa=Column(DECIMAL)
    department=Column(String)
    skills=Column(String)
    
    user=relationship("Users",back_populates="student")
    
class Companies(Base):
    __tablename__="companies"
    id=Column(Integer,primary_key=True)
    company_name=Column(String)
    minimum_cgpa=Column(DECIMAL)
    required_skills=Column(String)
    user_id=Column(Integer,ForeignKey("users.id"))
    user=relationship("Users",back_populates="company")

class Users(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True)
    user_name=Column(String,unique=True)
    user_mail=Column(String,unique=True)
    password=Column(String)
    
    
    role=Column(String)
    
    student=relationship("Students",back_populates="user")
    company=relationship("Companies",back_populates="user")