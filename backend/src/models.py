from datetime import datetime

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass

class Habit(Base):
    __tablename__ = 'habits'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column()
    count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow())
    is_done: Mapped[bool] = mapped_column(default=False)
    # is_done_by_partner: Mapped[bool] = mapped_column(default=False)
    created_by:Mapped[str] = mapped_column()


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    habits: Mapped[int] = mapped_column(default=0)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    jwt_token: Mapped[str]