import React, { useState, useEffect } from 'react'
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper, CircularProgress, IconButton, Fab, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MessageIcon from '@mui/icons-material/Message'
import ReplyIcon from '@mui/icons-material/Reply'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import SendIcon from '@mui/icons-material/Send'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { getActivities, getActivityIcon, getActivityColor } from '../../../services/activityService'
import axios from 'axios'

// Gunakan IP komputer Anda
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ActivityTab() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [currentRecording, setCurrentRecording] = useState(null)

  const fetchActivities = async () => {
    try {
      const data = await getActivities()
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchActivities()
  }

  const handleReplyClick = (activity) => {
    setSelectedActivity(activity)
    setReplyMessage('')
    setReplyDialogOpen(true)
  }

  const handleReplyClose = () => {
    setReplyDialogOpen(false)
    setSelectedActivity(null)
    setReplyMessage('')
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedActivity) return

    setSending(true)
    try {
      // Kirim balasan ke backend
      await axios.post(`${API_URL}/api/reply`, {
        guest_name: selectedActivity.guest_name,
        message: replyMessage
      })
      
      // Refresh aktivitas setelah mengirim balasan
      await fetchActivities()
      handleReplyClose()
    } catch (error) {
      console.error('Error sending reply:', error)
    } finally {
      setSending(false)
    }
  }

  const getIcon = (activityType) => {
    const iconStyle = { fontSize: '1.2rem' };
    switch (getActivityIcon(activityType)) {
      case 'notifications':
        return <NotificationsIcon sx={iconStyle} />
      case 'message':
        return <MessageIcon sx={iconStyle} />
      case 'reply':
        return <ReplyIcon sx={iconStyle} />
      case 'check_circle':
        return <CheckCircleIcon sx={iconStyle} />
      case 'warning':
        return <WarningIcon sx={iconStyle} />
      default:
        return <InfoIcon sx={iconStyle} />
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canReply = (activity) => {
    // Hanya bisa membalas aktivitas tipe 'guest_message' atau 'ai_notification'
    return activity.type === 'guest_message' || activity.type === 'ai_notification'
  }

  const handleActivityClick = (activity) => {
    if (activity.rekaman) {
      setCurrentRecording(activity.rekaman)
      setVideoDialogOpen(true)
    }
  }

  const handleCloseVideoDialog = () => {
    setVideoDialogOpen(false)
    setCurrentRecording(null)
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fffdfd' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202020' }}>
          Aktivitas Terbaru
        </Typography>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          sx={{ 
            color: '#202020',
            '&:hover': {
              bgcolor: 'transparent',
            },
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress sx={{ color: '#202020' }} />
        </Box>
      ) : (
        <List sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: 2,
          pb: 2
        }}>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="#424242">
                Tidak ada aktivitas
              </Typography>
            </Box>
          ) : (
            activities.map((activity, index) => (
              <ListItem 
                key={index}
                onClick={() => handleActivityClick(activity)}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  '&:last-child': { mb: 0 },
                  position: 'relative',
                  border: '1px solid #e3e3e3',
                  bgcolor: '#fffdfd',
                  cursor: activity.rekaman ? 'pointer' : 'default',
                  '&:hover': activity.rekaman ? {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  } : {}
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ 
                    display: 'flex',
                    width: '100%',
                    alignItems: 'flex-start'
                  }}>
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 28,
                        mt: 0.2,
                        mr: -0.5,
                        color: '#202020',
                        opacity: 0.85
                      }}
                    >
                      {getIcon(activity.type)}
                    </ListItemIcon>
                    <Box sx={{ 
                      flex: 1,
                      width: '100%',
                      position: 'relative'
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          color: '#202020',
                          lineHeight: 1.4,
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {activity.guest_name}
                        {activity.rekaman && (
                          <PlayCircleOutlineIcon sx={{ fontSize: '1rem', color: '#424242' }} />
                        )}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#424242',
                          fontSize: '0.85rem',
                          mb: 0.5,
                          lineHeight: 1.5,
                          width: '100%',
                          pr: canReply(activity) ? 8 : 0
                        }}
                      >
                        {activity.message}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#757575',
                          fontSize: '0.75rem',
                          display: 'block'
                        }}
                      >
                        {formatTimestamp(activity.timestamp)}
                      </Typography>
                      {canReply(activity) && (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<ReplyIcon sx={{ fontSize: '1rem' }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplyClick(activity);
                          }}
                          sx={{
                            fontSize: '0.75rem',
                            color: '#424242',
                            p: '4px 8px',
                            minWidth: 'auto',
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.03)'
                            }
                          }}
                        >
                          Balas
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      )}

      <Dialog 
        open={replyDialogOpen} 
        onClose={handleReplyClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#fffdfd'
          }
        }}
      >
        <DialogTitle sx={{ color: '#202020' }}>
          Balas Pesan untuk {selectedActivity?.guest_name}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Pesan Balasan"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleReplyClose} sx={{ color: '#424242' }}>
            Batal
          </Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
            disabled={!replyMessage.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              bgcolor: '#202020',
              '&:hover': {
                bgcolor: '#424242'
              }
            }}
          >
            Kirim
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#fffdfd'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#202020',
          display: 'flex',
          alignItems: 'center',
          gap: 1 
        }}>
          <PlayCircleOutlineIcon sx={{ fontSize: '1.2rem' }} />
          Rekaman {currentRecording}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: '100%',
              height: 400,
              bgcolor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <Typography sx={{ color: '#fff' }}>
              Simulasi Rekaman Video {currentRecording}
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 2
              }}
            >
              <Box
                sx={{
                  width: '60%',
                  height: '100%',
                  bgcolor: '#fff',
                  borderRadius: 2
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseVideoDialog} 
            variant="contained"
            sx={{
              bgcolor: '#202020',
              '&:hover': {
                bgcolor: '#424242'
              }
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ActivityTab
