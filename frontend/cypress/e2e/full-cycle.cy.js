import dayjs from 'dayjs'

describe('Flujo completo de la veterinaria', () => {
  const API_BASE = Cypress.env('apiUrl') || 'http://localhost:8000'

  it('registra dueño, mascota y agenda una hora médica', () => {
    const timestamp = Date.now()
    const owner = {
      name: `Dueño ${timestamp}`,
      email: `dueno-${timestamp}@example.com`,
      phone: `+56 9 ${Math.floor(timestamp % 100000000)}`
    }

    const pet = {
      name: `Mascota ${timestamp}`,
      species: 'Perro',
      breed: 'Labrador'
    }

    const appointment = {
      scheduled_at: dayjs()
        .add(2, 'day')
        .minute(0)
        .second(0)
        .millisecond(0)
        .format('YYYY-MM-DDTHH:mm'),
      reason: 'Chequeo general',
      veterinarian: 'Dra. Ana Pérez',
      notes: 'Paciente en buenas condiciones generales.'
    }

    cy.intercept('POST', `${API_BASE}/owners`).as('createOwner')
    cy.intercept('GET', `${API_BASE}/owners`).as('listOwners')
    cy.intercept('POST', `${API_BASE}/owners/*/pets`).as('createPet')
    cy.intercept('GET', `${API_BASE}/owners/*/pets`).as('listPets')
    cy.intercept('GET', `${API_BASE}/pets/*/appointments`).as('listAppointments')
    cy.intercept('POST', `${API_BASE}/pets/*/appointments`).as('createAppointment')

    cy.visit('/')

    cy.wait('@listOwners')

    cy.get('[data-cy="owner-form"]').within(() => {
      cy.get('input[name="name"]').type(owner.name)
      cy.get('input[name="email"]').type(owner.email)
      cy.get('input[name="phone"]').type(owner.phone)
      cy.contains('button', 'Guardar dueño').click()
    })

    cy.wait('@createOwner').its('response.statusCode').should('eq', 201)
    cy.get('[data-cy="owner-list"]').contains(owner.name).should('be.visible')

    cy.wait('@listPets')
    cy.contains('Registrar mascota para').should('contain', owner.name)

    cy.get('[data-cy="pet-form"]').within(() => {
      cy.get('input[name="name"]').type(pet.name)
      cy.get('input[name="species"]').type(pet.species)
      cy.get('input[name="breed"]').type(pet.breed)
      cy.contains('button', 'Guardar mascota').click()
    })

    cy.wait('@createPet').its('response.statusCode').should('eq', 201)
    cy.get('[data-cy="pet-list"]').contains(`${pet.name} (${pet.species})`).should('be.visible')

    cy.wait('@listAppointments')
    cy.get('[data-cy="appointment-timeline-empty"]').should('be.visible')
    cy.contains('Agendar hora para').should('contain', pet.name)

    cy.get('[data-cy="appointment-form"]').within(() => {
      cy.get('input[name="scheduled_at"]').clear().type(appointment.scheduled_at)
      cy.get('input[name="reason"]').type(appointment.reason)
      cy.get('input[name="veterinarian"]').type(appointment.veterinarian)
      cy.get('textarea[name="notes"]').type(appointment.notes)
      cy.contains('button', 'Agendar hora').click()
    })

    cy.wait('@createAppointment').its('response.statusCode').should('eq', 201)
    cy.get('[data-cy="appointment-timeline"]').should('be.visible')
    cy.get('[data-cy="appointment-timeline"]').contains(appointment.reason).should('be.visible')
    cy.get('[data-cy="appointment-timeline"]').contains(appointment.veterinarian).should('be.visible')
  })
})
