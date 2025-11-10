import { Avatar, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'

export function PetList({ pets, selectedPet, onSelect }) {
  return (
    <Paper elevation={3} sx={{ p: 2, background: 'rgba(255,255,255,0.9)', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mascotas del dueño
      </Typography>
      <List sx={{ maxHeight: 280, overflowY: 'auto' }}>
        {pets.map((pet) => (
          <ListItemButton
            key={pet.id}
            selected={selectedPet?.id === pet.id}
            onClick={() => onSelect(pet.id)}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <Avatar sx={{ mr: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
              <PetsIcon />
            </Avatar>
            <ListItemText primary={`${pet.name} (${pet.species})`} secondary={pet.breed || 'Sin raza registrada'} />
          </ListItemButton>
        ))}
        {pets.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Aún no hay mascotas registradas para este dueño.
          </Typography>
        )}
      </List>
    </Paper>
  )
}
