import os
from sqlalchemy import create_engine, MetaData

local = create_engine("mysql+pymysql://root:@localhost/db_products")
remoto = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"ssl": {"check_hostname": False}},
)

meta_local = MetaData()
meta_local.reflect(bind=local)
meta_remoto = MetaData()
meta_remoto.reflect(bind=remoto)

with local.connect() as origen, remoto.begin() as destino:
    # Primero vacía el destino (hijas antes que padres)
    for tabla in reversed(meta_remoto.sorted_tables):
        destino.execute(tabla.delete())
    # Luego copia (padres antes que hijas)
    for tabla in meta_remoto.sorted_tables:
        filas = origen.execute(meta_local.tables[tabla.name].select()).mappings().all()
        if filas:
            destino.execute(tabla.insert(), [dict(f) for f in filas])
        print(tabla.name, len(filas), "filas")