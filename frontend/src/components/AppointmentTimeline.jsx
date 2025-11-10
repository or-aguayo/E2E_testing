import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export function AppointmentTimeline({ appointments }) {
  if (!appointments.length) {
    return (
      <Card
        data-cy="appointment-timeline-empty"
        elevation={3}
        sx={{ background: 'rgba(255,255,255,0.9)' }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Historial de horas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aún no hay horas agendadas para esta mascota.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack data-cy="appointment-timeline" spacing={2}>
      {appointments.map((appointment) => (
        <Card key={appointment.id} elevation={4} sx={{ background: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventAvailableIcon color="success" />
              {dayjs(appointment.scheduled_at).format('DD MMMM YYYY · HH:mm')} hrs
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Motivo: {appointment.reason}
            </Typography>
            {appointment.veterinarian && (
              <Typography variant="body2" color="text.secondary">
                Veterinario: {appointment.veterinarian}
              </Typography>
            )}
            {appointment.notes && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Notas: {appointment.notes}
              </Typography>
            )}
            <Chip
              label={`#${appointment.id}`}
              size="small"
              sx={{ mt: 2, backgroundColor: 'primary.light', color: 'primary.dark' }}
            />
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
