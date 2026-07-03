from dotenv import load_dotenv
import os


load_dotenv()

class Settings:
    JWT_KEY = os.getenv('JWT_KEY')

settings = Settings()
