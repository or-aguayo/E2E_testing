import os

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

DEFAULT_SQLITE_URL = "sqlite:///./vet_clinic.db"


def _is_sqlite(url: str) -> bool:
    return url.startswith("sqlite")


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

engine_kwargs = {
    "pool_pre_ping": True,
}

if _is_sqlite(SQLALCHEMY_DATABASE_URL):
    # SQLite struggles with high concurrency when using the default QueuePool.
    # Using NullPool combined with WAL mode provides better behaviour under load
    # in our containerised setup.
    engine_kwargs.update(
        {
            "poolclass": NullPool,
            "connect_args": {
                "check_same_thread": False,
                "timeout": int(os.getenv("SQLITE_TIMEOUT", "30")),
            },
        }
    )
else:
    engine_kwargs.update(
        {
            "pool_size": int(os.getenv("DB_POOL_SIZE", "20")),
            "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "20")),
            "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "30")),
        }
    )

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)

if _is_sqlite(SQLALCHEMY_DATABASE_URL):
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA temp_store=MEMORY")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
