import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import MessageIcon from '@mui/icons-material/Message'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import InsightsIcon from '@mui/icons-material/Insights'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SettingsIcon from '@mui/icons-material/Settings'

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (event, newValue) => {
    navigate(newValue)
  }

  return (
    <MuiBottomNavigation
      value={location.pathname}
      onChange={handleChange}
      showLabels
      sx={{
        height: 48,
        bgcolor: '#fffdfd',
        borderTop: '1px solid #e3e3e3',
        '& .MuiBottomNavigationAction-root': {
          minWidth: 'auto',
          padding: '6px 8px',
          color: '#424242',
          '&.Mui-selected': {
            color: '#202020',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.2rem',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            '&.Mui-selected': {
              fontSize: '0.65rem'
            }
          }
        },
      }}
    >
      <BottomNavigationAction
        label="Pesan"
        value="/"
        icon={location.pathname === "/" ? <MessageIcon /> : <MessageOutlinedIcon />}
      />
      <BottomNavigationAction
        label="Aktivitas"
        value="/activity"
        icon={location.pathname === "/activity" ? <NotificationsIcon /> : <NotificationsOutlinedIcon />}
      />
      <BottomNavigationAction
        label="Analisis"
        value="/analysis"
        icon={location.pathname === "/analysis" ? <InsightsIcon /> : <InsightsOutlinedIcon />}
      />
      <BottomNavigationAction
        label="Pengaturan"
        value="/settings"
        icon={location.pathname === "/settings" ? <SettingsIcon /> : <SettingsOutlinedIcon />}
      />
    </MuiBottomNavigation>
  )
}

export default BottomNavigation 