import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  discardResponseBodies: false,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
    errors: ['count<10'],
  },
  scenarios: {
    load: {
      executor: 'ramping-arrival-rate',
      startRate: 2,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 50,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '3m', target: 30 },
        { duration: '2m', target: 10 },
      ],
      tags: { test_type: 'load' },
      exec: 'endToEndFlow',
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 60 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
      tags: { test_type: 'stress' },
      exec: 'endToEndFlow',
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const HEADERS = { headers: { 'Content-Type': 'application/json' } };

const ownerCreationTrend = new Trend('owner_creation_duration');
const petCreationTrend = new Trend('pet_creation_duration');
const appointmentCreationTrend = new Trend('appointment_creation_duration');
const errors = new Counter('errors');

function randomSuffix() {
  return `${__VU}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function ensure(res, message, expectedStatus) {
  const ok = check(res, {
    [message]: (r) => r.status === expectedStatus,
  });
  if (!ok) {
    errors.add(1);
  }
  return ok;
}

function createOwner() {
  const suffix = randomSuffix();
  const payload = {
    name: `Dueño ${suffix}`,
    // Algunos validadores de email (como el que usa FastAPI via Pydantic) rechazan
    // dominios reservados como .test, por lo que utilizamos un dominio válido
    // para evitar respuestas 422 por "email inválido" al generar datos sintéticos.
    email: `loadtest+${suffix}@vetfeliz.cl`,
    phone: `+56${Math.floor(100000000 + Math.random() * 899999999)}`,
  };
  const res = http.post(`${BASE_URL}/owners`, JSON.stringify(payload), HEADERS);
  ensure(res, 'owner created', 201);
  ownerCreationTrend.add(res.timings.duration);
  return res.json();
}

function createPet(ownerId) {
  const suffix = randomSuffix();
  const payload = {
    name: `Mascota ${suffix}`,
    species: 'canino',
    breed: 'mestizo',
  };
  const res = http.post(
    `${BASE_URL}/owners/${ownerId}/pets`,
    JSON.stringify(payload),
    HEADERS,
  );
  ensure(res, 'pet created', 201);
  petCreationTrend.add(res.timings.duration);
  return res.json();
}

function createAppointment(petId) {
  const payload = {
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    reason: 'Control preventivo',
    veterinarian: 'Dra. Grafana',
    notes: 'Generado automáticamente por k6',
  };
  const res = http.post(
    `${BASE_URL}/pets/${petId}/appointments`,
    JSON.stringify(payload),
    HEADERS,
  );
  ensure(res, 'appointment created', 201);
  appointmentCreationTrend.add(res.timings.duration);
  return res.json();
}

function verifyListings(ownerId, petId) {
  const ownersRes = http.get(`${BASE_URL}/owners`);
  ensure(ownersRes, 'owners listed', 200);

  const petsRes = http.get(`${BASE_URL}/owners/${ownerId}/pets`);
  ensure(petsRes, 'pets listed', 200);

  const appointmentsRes = http.get(`${BASE_URL}/pets/${petId}/appointments`);
  ensure(appointmentsRes, 'appointments listed', 200);
}

export function endToEndFlow() {
  const owner = createOwner();
  if (!owner?.id) {
    return;
  }

  const pet = createPet(owner.id);
  if (!pet?.id) {
    return;
  }

  createAppointment(pet.id);
  verifyListings(owner.id, pet.id);

  sleep(0.5);
}

export default endToEndFlow;
