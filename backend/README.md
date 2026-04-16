# Backend

Configuracion base con:

- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic v2

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
cp .env.example .env
uvicorn src.main:app --reload
```

## Docker

Desde la raiz del repositorio:

```bash
docker compose up --build
```

Servicios:

- backend: `http://localhost:8000`
- postgres: `localhost:5432`

La base se inicializa al arrancar el contenedor del backend usando `src.core.init_db`.

## Estado actual

El proyecto contiene solo la estructura base del backend:

- app FastAPI
- configuracion centralizada
- conexion SQLAlchemy
- paquetes vacios para api, models, repositories, schemas y services

No hay rutas de dominio, modelos ORM ni logica de aplicacion cargada.
