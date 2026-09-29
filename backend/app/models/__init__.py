from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Estos imports van DESPUÉS de crear db, porque los modelos hacen `from . import db`
from .producto import Producto
from .categoria import Categoria
from .entrada import Entrada

__all__ = ["db", "Producto", "Categoria", "Entrada"]