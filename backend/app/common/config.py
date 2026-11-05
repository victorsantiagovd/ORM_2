import os

class Config:
    # Valores locales (XAMPP), se usan si no existe DATABASE_URL
    USER = 'root'
    PASSWORD = ''
    HOST = 'localhost'
    DATABASE = 'db_products'

    # En Render/Aiven se define DATABASE_URL; en local se usa la de XAMPP
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f'mysql+pymysql://{USER}:{PASSWORD}@{HOST}/{DATABASE}'
    )

    # Aiven exige SSL; en local (XAMPP) no se activa
    if os.environ.get('DATABASE_URL'):
        SQLALCHEMY_ENGINE_OPTIONS = {
            'connect_args': {'ssl': {'check_hostname': False}}
        }

    SQLALCHEMY_TRACK_MODIFICATIONS = False