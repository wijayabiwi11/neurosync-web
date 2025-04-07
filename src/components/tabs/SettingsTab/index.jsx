import React from 'react'
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ScheduleIcon from '@mui/icons-material/Schedule'

function SettingsTab() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pengaturan
      </Typography>
      
      <List>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Profil Owner"
            secondary="Ubah nama dan status"
          />
        </ListItem>
        
        <ListItem button>
          <ListItemIcon>
            <LockIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Password"
            secondary="Ubah password admin"
          />
        </ListItem>
        
        <ListItem button>
          <ListItemIcon>
            <ScheduleIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Jadwal Ketersediaan"
            secondary="Atur jadwal bertemu"
          />
        </ListItem>
        
        <ListItem button>
          <ListItemIcon>
            <NotificationsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Notifikasi"
            secondary="Pengaturan notifikasi"
          />
        </ListItem>
      </List>
    </Box>
  )
}

export default SettingsTab 