import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import api from '../services/api'

export function useVeterinaryData() {
  const [owners, setOwners] = useState([])
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOwners = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/owners')
      setOwners(data)
    } catch (err) {
      setError('No se pudieron cargar los dueños.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPets = useCallback(
    async (ownerId) => {
      if (!ownerId) {
        setPets([])
        return
      }
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get(`/owners/${ownerId}/pets`)
        setPets(data)
      } catch (err) {
        setError('No se pudieron cargar las mascotas.')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchAppointments = useCallback(async (petId) => {
    if (!petId) {
      setAppointments([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(`/pets/${petId}/appointments`)
      const sorted = data.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
      setAppointments(sorted)
    } catch (err) {
      setError('No se pudo cargar el historial de horas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOwners()
  }, [fetchOwners])

  useEffect(() => {
    if (selectedOwner) {
      fetchPets(selectedOwner.id)
    }
  }, [selectedOwner, fetchPets])

  useEffect(() => {
    if (selectedPet) {
      fetchAppointments(selectedPet.id)
    }
  }, [selectedPet, fetchAppointments])

  const selectOwner = useCallback((ownerId) => {
    const owner = owners.find((o) => o.id === ownerId) || null
    setSelectedOwner(owner)
    setSelectedPet(null)
    setAppointments([])
  }, [owners])

  const selectPet = useCallback((petId) => {
    const pet = pets.find((p) => p.id === petId) || null
    setSelectedPet(pet)
  }, [pets])

  const createOwner = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/owners', payload)
      setOwners((prev) => [...prev, data])
      setSelectedOwner(data)
      return data
    } catch (err) {
      setError('No se pudo crear el dueño. Revisa que el correo no esté en uso.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPet = useCallback(
    async (ownerId, payload) => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.post(`/owners/${ownerId}/pets`, payload)
        setPets((prev) => [...prev, data])
        setSelectedPet(data)
        return data
      } catch (err) {
        setError('No se pudo crear la mascota.')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createAppointment = useCallback(async (petId, payload) => {
    setLoading(true)
    setError(null)
    try {
      const formattedPayload = {
        ...payload,
        scheduled_at: dayjs(payload.scheduled_at).toISOString()
      }
      const { data } = await api.post(`/pets/${petId}/appointments`, formattedPayload)
      setAppointments((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError('No se pudo agendar la hora médica.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return useMemo(
    () => ({
      owners,
      selectedOwner,
      selectOwner,
      createOwner,
      pets,
      selectedPet,
      selectPet,
      createPet,
      appointments,
      createAppointment,
      loading,
      error
    }),
    [
      owners,
      selectedOwner,
      selectOwner,
      createOwner,
      pets,
      selectedPet,
      selectPet,
      createPet,
      appointments,
      createAppointment,
      loading,
      error
    ]
  )
}
