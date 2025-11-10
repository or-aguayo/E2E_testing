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
- `VITE_API_BASE_URL`: URL base para consumir la API desde el frontend (por defecto `http://localhost:8000`).

## Pruebas E2E con Checksum

El archivo `checksum.yml` describe el orquestador de servicios y el flujo de Cypress para validar el ciclo completo de la veterinaria.

1. Asegúrate de contar con la [CLI de Checksum](https://checksum.ai/) instalada y autenticada.
2. Ejecuta `checksum run --check "Flujo completo: dueño, mascota y hora"` desde la raíz del repositorio.

La configuración levanta el backend de FastAPI y el frontend de Vite, ejecuta las pruebas de Cypress incluidas en `frontend/cypress/e2e/full-cycle.cy.js` y finaliza reportando el resultado en Checksum.

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

> **Nota:** el frontend apunta por defecto a `http://localhost:8000`. Si necesitas utilizar otra URL (por ejemplo en despliegues remotos), define `VITE_API_BASE_URL`. Para escenarios de desarrollo avanzados puedes ajustar el proxy del dev server mediante `VITE_PROXY_TARGET`.

## Endpoints principales

- `GET /owners`: Lista de dueños registrados.
- `POST /owners`: Crea un nuevo dueño.
- `POST /owners/{owner_id}/pets`: Registra una mascota para un dueño.
- `GET /pets/{pet_id}/appointments`: Historial de horas médicas de una mascota.
- `POST /pets/{pet_id}/appointments`: Agenda una nueva hora médica.

## Licencia

Proyecto educativo sin licencia específica.
