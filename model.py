from database import Base
from sqlalchemy import Column,Integer,String,DECIMAL,ForeignKey,Date
from sqlalchemy.orm import relationship  

class Students(Base):
    __tablename__="students"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    registration_number = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(String)

    cgpa = Column(DECIMAL)

    department = Column(String)

    skills = Column(String)
    
    user=relationship("Users",back_populates="student")
    applications = relationship(
    "Applications",
    back_populates="student"
)
    
class Companies(Base):
    __tablename__="companies"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    company_code = Column(
        String,
        unique=True,
        nullable=False
    )
    
    company_name = Column(String)

    minimum_cgpa = Column(DECIMAL)

    required_skills = Column(String)
    
    user = relationship(
    "Users",
    back_populates="company"
)
    jobs = relationship(
    "Jobs",
    back_populates="company",
    cascade="all, delete"
)
    
class Users(Base):
    __tablename__="users"

    id = Column(Integer, primary_key=True)

    user_name = Column(String, unique=True)

    user_mail = Column(String, unique=True)

    password = Column(String)

    role = Column(String)
    student = relationship(
    "Students",
    back_populates="user",
    uselist=False
)
    company = relationship(
    "Companies",
    back_populates="user",
    uselist=False
)
    
class Jobs(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey("companies.id"))

    title = Column(String)
    description = Column(String)
    salary = Column(String)

    deadline = Column(Date)
    status = Column(
    String,
    default="Applied"  # Applied → Shortlisted → Rejected → Selected
)
    company = relationship(
    "Companies",
    back_populates="jobs"
)
    applications = relationship(
    "Applications",
    back_populates="job"
)
class Applications(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer,
        ForeignKey("students.id"))

    job_id = Column(Integer,
        ForeignKey("jobs.id"))

    status = Column(
    String,
    default="Applied"
)
    student = relationship(
    "Students",
    back_populates="applications"
)
    job = relationship(
    "Jobs",
    back_populates="applications"
)
    
    

