import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'

export function OwnerForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(form)
      setForm({ name: '', email: '', phone: '' })
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.85)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Registrar nuevo dueño
      </Typography>
      <Box
        component="form"
        data-cy="owner-form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gap: 2 }}
      >
        <TextField
          label="Nombre completo"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Teléfono de contacto"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Guardar dueño
        </Button>
      </Box>
    </Paper>
  )
}
