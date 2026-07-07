from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker


from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL =", DATABASE_URL)

engine = create_engine(DATABASE_URL)

Session_Local=sessionmaker(bind=engine)
Base=declarative_base()