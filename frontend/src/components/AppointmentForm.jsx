import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'

export function AppointmentForm({ petName, onSubmit }) {
  const [form, setForm] = useState({
    scheduled_at: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
    reason: '',
    veterinarian: '',
    notes: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit({
        ...form,
        scheduled_at: dayjs(form.scheduled_at)
      })
      setForm({ ...form, reason: '', notes: '' })
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.92)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Agendar hora para {petName}
      </Typography>
      <Box
        component="form"
        data-cy="appointment-form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gap: 2 }}
      >
        <TextField
          label="Fecha y hora"
          type="datetime-local"
          name="scheduled_at"
          value={form.scheduled_at}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Motivo de la consulta"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <TextField
          label="Veterinario asignado"
          name="veterinarian"
          value={form.veterinarian}
          onChange={handleChange}
        />
        <TextField
          label="Notas adicionales"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <Button type="submit" variant="contained" color="success">
          Agendar hora
        </Button>
      </Box>
    </Paper>
  )
}
