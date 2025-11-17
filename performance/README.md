# Pruebas de carga y estrés con Grafana k6

Este directorio contiene los artefactos necesarios para ejecutar pruebas de rendimiento sobre los flujos críticos del backend de la Veterinaria Feliz (registro de dueños, mascotas y horas médicas) utilizando [Grafana k6](https://grafana.com/oss/k6/).

## Escenarios cubiertos

El script [`k6-load-test.js`](./k6-load-test.js) automatiza un flujo de extremo a extremo:

1. **Registro de dueño** (`POST /owners`).
2. **Registro de mascota** asociada al dueño creado (`POST /owners/{owner_id}/pets`).
3. **Agendamiento de hora médica** para la mascota (`POST /pets/{pet_id}/appointments`).
4. Validación de las lecturas (`GET /owners`, `GET /owners/{owner_id}/pets`, `GET /pets/{pet_id}/appointments`).

Dentro del mismo archivo se declaran dos escenarios de ejecución:

- `load`: rampa progresiva de solicitudes para validar el comportamiento sostenido del sistema.
- `stress`: incremento agresivo de usuarios virtuales para encontrar el punto de quiebre.

Además, se exponen métricas personalizadas (`owner_creation_duration`, `pet_creation_duration`, `appointment_creation_duration` y `errors`) que pueden graficarse en Grafana junto con las métricas estándar de k6.

## Prerrequisitos

- Servicios del backend corriendo en `http://localhost:8000` (puedes iniciar todo con `docker-compose up --build`).
- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) instalado localmente **o** el contenedor oficial `grafana/k6`.
- (Opcional) Una instancia de Grafana + Prometheus/Grafana Agent para recibir métricas mediante `experimental-prometheus-rw`.

> **¿Necesito Prometheus o Grafana para ejecutar las pruebas?**
>
> No. El script puede correrse únicamente con k6 y un backend accesible; en ese caso k6 imprimirá el resumen (p95, error rate, etc.)
> directamente en la terminal. La integración con Grafana es solo para quienes quieren almacenar las métricas históricamente.

## Ejecución local básica

```bash
# Desde la raíz del repositorio
BASE_URL=http://localhost:8000 \
k6 run performance/k6-load-test.js
```

El `BASE_URL` apunta al backend de FastAPI y puede personalizarse para apuntar a entornos remotos. Si ya tienes los servicios
levantados mediante `docker-compose up --build`, basta con dejar `BASE_URL` apuntando a `http://localhost:8000` y ejecutar el
comando anterior: las pruebas generarán carga contra tu máquina local y el resultado se verá en la consola.

## Ejecución con Docker + salida hacia Grafana

Si prefieres no instalar k6 en tu máquina, ejecuta el contenedor oficial y expón la salida hacia Grafana (ya sea Grafana Cloud o una instancia propia con endpoint compatible con `prometheus remote write`). Sustituye las variables con tus datos reales:

```bash
export BASE_URL=http://host.docker.internal:8000
export K6_OUT=experimental-prometheus-rw
export K6_PROMETHEUS_RW_SERVER_URL=https://<tu_endpoint>/api/v1/push
export K6_PROMETHEUS_RW_USERNAME=<usuario_o_instance_id>
export K6_PROMETHEUS_RW_PASSWORD=<token_o_password>

docker run --rm -i \
  -e BASE_URL \
  -e K6_OUT \
  -e K6_PROMETHEUS_RW_SERVER_URL \
  -e K6_PROMETHEUS_RW_USERNAME \
  -e K6_PROMETHEUS_RW_PASSWORD \
  -v $(pwd)/performance:/scripts \
  grafana/k6 run /scripts/k6-load-test.js
```

### Conectando k6 con Grafana Cloud

Si ya creaste una cuenta en Grafana Cloud no necesitas desplegar tu propio Prometheus: cada _stack_ incluye un endpoint de _remote write_ que acepta las métricas exportadas por k6. Sigue estos pasos:

1. En el portal de Grafana Cloud, ingresa a **Connections → Add new connection → Prometheus** y haz clic en **Send metrics** para tu stack.
2. Copia los valores que aparecen en la sección **Send via remote write**:
   - `Remote write endpoint`: úsalo en `K6_PROMETHEUS_RW_SERVER_URL`.
   - `Username`: corresponde al **Instance ID** del Prometheus gestionado y debe asignarse a `K6_PROMETHEUS_RW_USERNAME`.
   - `Password`: genera o reutiliza un **API Token** con permisos para métricas y asígnalo a `K6_PROMETHEUS_RW_PASSWORD`.
3. Exporta esas variables junto con `BASE_URL` y `K6_OUT=experimental-prometheus-rw` antes de ejecutar k6. Puedes hacerlo tanto en tu máquina como dentro del contenedor oficial:

   ```bash
   export BASE_URL=http://localhost:8000
   export K6_OUT=experimental-prometheus-rw
   export K6_PROMETHEUS_RW_SERVER_URL=https://prometheus-prod-XX.grafana.net/api/prom/push
   export K6_PROMETHEUS_RW_USERNAME=123456
   export K6_PROMETHEUS_RW_PASSWORD=glc_XXXXXXXXXXXXXXXXXX

   k6 run performance/k6-load-test.js
   ```

4. Vuelve al portal de Grafana Cloud y agrega el data source **Prometheus** (si no existe) apuntando al mismo endpoint. Crea o edita un dashboard y selecciona las métricas `k6_*` o las personalizadas (`owner_creation_duration`, etc.) para graficarlas en tiempo real.

> Consejo: para distinguir múltiples ejecuciones puedes añadir etiquetas dinámicas a k6 con `-e K6_TAGS="env=qa,owner=grafana-cloud"` y utilizarlas como filtros en tus paneles.

Con esta configuración las métricas se enviarán directamente a tu data source en Grafana, permitiéndote construir dashboards de rendimiento y alertas.

## Consejos de interpretación

- **`http_req_failed`**: debe mantenerse por debajo del 1 % en escenarios de carga. Si aumenta durante el escenario de estrés, identifica cuellos de botella (DB, CPU, etc.).
- **Duraciones personalizadas**: cada `Trend` muestra el tiempo dedicado exclusivamente a cada operación crítica de negocio.
- **Errores**: el contador `errors` facilita detectar respuestas no esperadas por endpoint sin revisar cada log.
- Ajusta los `thresholds` declarados en `options.thresholds` según los SLA definidos para la veterinaria.

## Extensiones posibles

- Añadir escenarios diferenciados para lectura masiva de citas o cancelaciones.
- Integrar `k6-operator` o pipelines CI para ejecutar estas pruebas en cada despliegue.
- Publicar dashboards y alertas listos para usar dentro de Grafana.
