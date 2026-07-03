from sqlalchemy.orm import sessionmaker, Session

from sqlalchemy import create_engine



DATABASE_URL = 'sqlite:///./habits.db'

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(engine,class_=Session,expire_on_commit=False)



async def get_db():
    session =  SessionLocal()
    try:
        yield session
    finally:
        session.close()

