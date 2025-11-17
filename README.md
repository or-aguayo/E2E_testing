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

## Pruebas E2E con Cypress

Las pruebas de extremo a extremo viven en `frontend/cypress/e2e/full-cycle.cy.js` y automatizan el flujo completo de la aplicación: registro de dueños, registro de mascotas y agendamiento de horas médicas.

Para ejecutarlas de forma local:

1. Inicia los servicios necesarios. Puedes utilizar `docker-compose up --build` desde la raíz del repositorio o levantar backend y frontend manualmente:
   - Backend: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - Frontend: `cd frontend && npm install && npm run dev -- --host 0.0.0.0 --port 5173`
2. En otra terminal, ejecuta las pruebas desde el directorio `frontend`:

```bash
cd frontend
npm install
npm run test:e2e
```

Por defecto Cypress asume que el frontend está disponible en `http://localhost:5173`. Si necesitas apuntar a otra URL puedes definir `CYPRESS_BASE_URL`. Para conectar con una API alojada en otro host expón la variable `CYPRESS_apiUrl` antes de ejecutar las pruebas.

## Pruebas de carga y estrés con Grafana k6

Para validar el rendimiento de los flujos críticos (registro de dueños, mascotas y horas médicas) se agregó un script de k6 en [`performance/k6-load-test.js`](performance/k6-load-test.js). El archivo define escenarios de carga progresiva y estrés que pueden ejecutarse localmente o desde el contenedor oficial `grafana/k6`, enviando métricas a Grafana mediante `experimental-prometheus-rw`.

Pasos rápidos:

```bash
# Backend en marcha (por ejemplo con docker-compose up)
BASE_URL=http://localhost:8000 \
k6 run performance/k6-load-test.js
```

No es obligatorio contar con Prometheus o Grafana para correr el script: si solo exportas `BASE_URL`, k6 imprimirá todas las métricas
en la terminal. Si quieres persistirlas, Grafana Cloud ofrece un endpoint de **remote write** listo para recibir las métricas; consulta
[performance/README.md](performance/README.md) para ver los pasos concretos de integración y ejemplos para instancias propias.

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
