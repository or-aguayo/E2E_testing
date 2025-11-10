import { Avatar, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'

function initials(name = '') {
  return name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export function OwnerList({ owners, selectedOwner, onSelect }) {
  return (
    <Paper
      data-cy="owner-list"
      elevation={3}
      sx={{ p: 2, background: 'rgba(255,255,255,0.85)', height: '100%' }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Dueños registrados
      </Typography>
      <List sx={{ maxHeight: 320, overflowY: 'auto' }}>
        {owners.map((owner) => (
          <ListItemButton
            key={owner.id}
            selected={selectedOwner?.id === owner.id}
            onClick={() => onSelect(owner.id)}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <Avatar sx={{ mr: 2 }}>{initials(owner.name)}</Avatar>
            <ListItemText primary={owner.name} secondary={`${owner.email}${owner.phone ? ' · ' + owner.phone : ''}`} />
          </ListItemButton>
        ))}
        {owners.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Aún no hay dueños registrados.
          </Typography>
        )}
      </List>
    </Paper>
  )
}
