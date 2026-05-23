from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Hum database ka naam grocery_saas.db rakh rahe hain
SQLALCHEMY_DATABASE_URL = "sqlite:///./grocery_saas.db"

# Engine database ke sath connection establish karta hai
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal actual database queries run karne ke kaam aayega
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class jisko use karke hum apne saare database tables banayenge
Base = declarative_base()