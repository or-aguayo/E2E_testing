import {
  Alert,
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useVeterinaryData } from './hooks/useVeterinaryData'
import { OwnerForm } from './components/OwnerForm'
import { OwnerList } from './components/OwnerList'
import { PetForm } from './components/PetForm'
import { PetList } from './components/PetList'
import { AppointmentForm } from './components/AppointmentForm'
import { AppointmentTimeline } from './components/AppointmentTimeline'

function HeroHeader() {
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 },
        mb: 5,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))'
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800, color: '#0b4f8f' }}
      >
        <LocalHospitalIcon fontSize="inherit" color="primary" /> Veterinaria Feliz
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary', maxWidth: 640 }}>
        Gestiona dueños, mascotas y el historial de atenciones desde una sola vista moderna y colorida.
      </Typography>
    </Paper>
  )
}

export default function App() {
  const {
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
  } = useVeterinaryData()

  const handleCreateOwner = async (values) => {
    await createOwner(values)
  }

  const handleCreatePet = async (values) => {
    if (!selectedOwner) return
    await createPet(selectedOwner.id, values)
  }

  const handleCreateAppointment = async (values) => {
    if (!selectedPet) return
    await createAppointment(selectedPet.id, values)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <HeroHeader />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <OwnerForm onSubmit={handleCreateOwner} />
          <OwnerList owners={owners} selectedOwner={selectedOwner} onSelect={selectOwner} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedOwner ? (
            <Box>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FavoriteIcon color="error" /> Dueño seleccionado
                </Typography>
                <Typography variant="subtitle1">{selectedOwner.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOwner.email} · {selectedOwner.phone || 'Sin teléfono registrado'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <PetForm ownerName={selectedOwner.name} onSubmit={handleCreatePet} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <PetList pets={pets} selectedPet={selectedPet} onSelect={selectPet} />
                  </Grid>
                </Grid>
              </Paper>

              {selectedPet && (
                <Box>
                  <AppointmentForm petName={selectedPet.name} onSubmit={handleCreateAppointment} />
                  <AppointmentTimeline appointments={appointments} />
                </Box>
              )}
            </Box>
          ) : (
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Selecciona o registra un dueño
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Para comenzar, agrega un dueño y luego registra sus mascotas para agendar horas médicas.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {loading && (
        <Alert severity="info" sx={{ mt: 4 }}>
          Cargando información, por favor espera...
        </Alert>
      )}
    </Container>
  )
}
