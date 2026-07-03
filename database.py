from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker


url="postgresql://postgres:LIAKAAHE@localhost:5432/campus_placement_db"

engine=create_engine(url)

Session_Local=sessionmaker(bind=engine)
Base=declarative_base()