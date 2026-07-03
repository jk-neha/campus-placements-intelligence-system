from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker


import os

DATABASE_URL=os.getenv("DATABASE_URL")

engine=create_engine(DATABASE_URL)

Session_Local=sessionmaker(bind=engine)
Base=declarative_base()