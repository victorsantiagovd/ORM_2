from flask import Blueprint
from flasgger import swag_from
from app.services import (
    categoria_list,
    categoria_detail,
    categoria_add,
    categoria_update,
    categoria_delete
)

categoria_bp = Blueprint("categorias", __name__)

# LISTAR CATEGORIAS
@swag_from({
    "summary": "Consulta general de categorías",
    "responses": {
        200: {"description": "Lista de categorías"}
    }
})
@categoria_bp.route("/categorias", methods=["GET"])
def get_categoria_list():
    return categoria_list()

# DETALLE CATEGORIA
@swag_from({
    "summary": "Consulta individual de categoría",
    "parameters": [
        {
            "name": "categoria_id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "ID de la categoría",
            "example": 1
        }
    ],
    "responses": {
        200: {"description": "Detalle de categoría"},
        404: {"description": "Categoría no encontrada"}
    }
})
@categoria_bp.route("/categorias/<int:categoria_id>", methods=["GET"])
def get_categoria_detail(categoria_id):
    return categoria_detail(categoria_id)

# CREAR CATEGORIA
@swag_from({
    "summary": "Registro de categoría",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "required": ["nombre"],
                "properties": {
                    "nombre": {"type": "string", "example": "Electrónica"},
                    "descripcion": {"type": "string", "example": "Productos electrónicos"}
                }
            }
        }
    ],
    "responses": {
        201: {"description": "Categoría creada correctamente"},
        400: {"description": "Error en el registro"}
    }
})
@categoria_bp.route("/categorias", methods=["POST"])
def get_categoria_add():
    return categoria_add()

# ACTUALIZAR CATEGORIA
@swag_from({
    "summary": "Actualización de categoría",
    "parameters": [
        {
            "name": "categoria_id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "ID de la categoría a actualizar",
            "example": 1
        },
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "nombre": {"type": "string", "example": "Electrónica"},
                    "descripcion": {"type": "string", "example": "Dispositivos y accesorios"}
                }
            }
        }
    ],
    "responses": {
        200: {"description": "Categoría actualizada correctamente"},
        400: {"description": "Error en la actualización"},
        404: {"description": "Categoría no encontrada"}
    }
})
@categoria_bp.route("/categorias/<int:categoria_id>", methods=["PUT"])
def get_categoria_update(categoria_id):
    return categoria_update(categoria_id)

# ELIMINAR CATEGORIA
@swag_from({
    "summary": "Eliminación de categoría",
    "parameters": [
        {
            "name": "categoria_id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "ID de la categoría a eliminar",
            "example": 1
        }
    ],
    "responses": {
        200: {"description": "Categoría eliminada correctamente"},
        400: {"description": "La categoría tiene productos asociados"},
        404: {"description": "Categoría no encontrada"}
    }
})
@categoria_bp.route("/categorias/<int:categoria_id>", methods=["DELETE"])
def get_categoria_delete(categoria_id):
    return categoria_delete(categoria_id)