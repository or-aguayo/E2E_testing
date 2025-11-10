import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'

export function PetForm({ ownerName, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(form)
      setForm({ name: '', species: '', breed: '' })
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.85)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Registrar mascota para {ownerName}
      </Typography>
      <Box
        component="form"
        data-cy="pet-form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gap: 2 }}
      >
        <TextField
          label="Nombre de la mascota"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Especie (perro, gato, etc.)"
          name="species"
          value={form.species}
          onChange={handleChange}
          required
        />
        <TextField
          label="Raza"
          name="breed"
          value={form.breed}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="secondary">
          Guardar mascota
        </Button>
      </Box>
    </Paper>
  )
}
