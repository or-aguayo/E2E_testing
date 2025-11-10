# Veterinaria Feliz

Aplicación completa para gestionar una veterinaria con backend en FastAPI y frontend en React.

## Características

- Gestión de dueños, mascotas y horas médicas.
- Historial de atenciones por mascota.
- Interfaz moderna construida con React + Material UI.
- API REST construida con FastAPI y persistencia en SQLite.
- Entorno completamente dockerizado listo para levantar con `docker-compose`.

## Requisitos previos

- Docker 20+
- Docker Compose 2+

## Puesta en marcha

```bash
docker-compose up --build
```

La API quedará disponible en `http://localhost:8000/docs` y el frontend en `http://localhost:5173`.

La base de datos SQLite se almacena en `backend/app/vet_clinic.db` y se monta como volumen para mantener los datos.

## Variables de entorno

- `VITE_API_BASE_URL`: URL base para consumir la API desde el frontend (por defecto `http://backend:8000`).

## Desarrollo local sin Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> **Nota:** el archivo `vite.config.js` ya incluye un proxy para `/api` apuntando al servicio del backend.

## Endpoints principales

- `GET /owners`: Lista de dueños registrados.
- `POST /owners`: Crea un nuevo dueño.
- `POST /owners/{owner_id}/pets`: Registra una mascota para un dueño.
- `GET /pets/{pet_id}/appointments`: Historial de horas médicas de una mascota.
- `POST /pets/{pet_id}/appointments`: Agenda una nueva hora médica.

## Licencia

Proyecto educativo sin licencia específica.
