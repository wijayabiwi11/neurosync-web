import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputBase,
  Paper,
  InputAdornment,
  Stack,
  Menu,
  MenuItem as MenuItemMui
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MessageTab = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    pesan: '',
    status: 'di rumah',
    status_penyampaian: 'belum disampaikan'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/guests`);
      // Urutkan berdasarkan tanggal dan waktu terbaru
      const sortedGuests = response.data.sort((a, b) => {
        const dateA = new Date(`${a.tanggal} ${a.waktu}`);
        const dateB = new Date(`${b.tanggal} ${b.waktu}`);
        return dateB - dateA;
      });
      setGuests(sortedGuests);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setSnackbar({
        open: true,
        message: 'Gagal mengambil data pesan',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // Fungsi untuk mengkapitalisasi huruf pertama
  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleOpenDialog = (guest = null) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        nama: guest.nama,
        pesan: guest.pesan || '',
        status: guest.status || 'di rumah',
        status_penyampaian: guest.status_penyampaian || 'belum disampaikan'
      });
    } else {
      setEditingGuest(null);
      setFormData({
        nama: '',
        pesan: '',
        status: 'di rumah',
        status_penyampaian: 'belum disampaikan'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGuest(null);
    setFormData({
      nama: '',
      pesan: '',
      status: 'di rumah',
      status_penyampaian: 'belum disampaikan'
    });
  };

  const handleSubmit = async () => {
    try {
      const submittedData = {
        ...formData,
        nama: capitalizeFirstLetter(formData.nama)
      };

      if (editingGuest) {
        await axios.put(`${API_URL}/api/guests/${editingGuest.nama}`, submittedData);
        setSnackbar({
          open: true,
          message: 'Data tamu berhasil diperbarui',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_URL}/api/guests`, {
          ...submittedData,
          tanggal: new Date().toLocaleDateString(),
          waktu: new Date().toLocaleTimeString()
        });
        setSnackbar({
          open: true,
          message: 'Tamu berhasil ditambahkan',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchGuests();
    } catch (error) {
      console.error('Error saving guest:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Gagal menyimpan data tamu',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (nama) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tamu ini?')) {
      try {
        await axios.delete(`${API_URL}/api/guests/${nama}`);
        setSnackbar({
          open: true,
          message: 'Tamu berhasil dihapus',
          severity: 'success'
        });
        fetchGuests();
      } catch (error) {
        console.error('Error deleting guest:', error);
        setSnackbar({
          open: true,
          message: 'Gagal menghapus tamu',
          severity: 'error'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'di rumah':
        return '#757575';
      case 'di luar':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (date, time) => {
    const now = new Date();
    const messageDate = new Date(`${date} ${time}`);
    
    // Format untuk hari ini
    if (messageDate.toDateString() === now.toDateString()) {
      return time.substring(0, 5); // HH:MM format
    }
    
    // Format untuk tanggal lain
    return `${date} ${time.substring(0, 5)}`;
  };

  const getStatusDeliveryStyle = (status_penyampaian) => {
    return {
      fontSize: '0.75rem',
      color: '#202020',
      backgroundColor: '#e3e3e3',
      padding: '2px 8px',
      borderRadius: '12px',
      marginLeft: '8px'
    };
  };

  const handleMenuOpen = (event, guest) => {
    setAnchorEl(event.currentTarget);
    setSelectedGuest(guest);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGuest(null);
  };

  const handleMenuEdit = () => {
    handleOpenDialog(selectedGuest);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    handleDelete(selectedGuest.nama);
    handleMenuClose();
  };

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
          Pesan
        </Typography>
        <IconButton 
          size="small"
          onClick={() => handleOpenDialog()}
          sx={{
            color: '#202020',
            '&:hover': {
              bgcolor: 'transparent',
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <SearchIcon sx={{ color: '#424242', mr: 1 }} />
          <InputBase
            sx={{ 
              flex: 1,
              fontSize: '0.95rem',
              color: '#202020',
              '&::placeholder': {
                color: '#424242',
                opacity: 1
              }
            }}
            placeholder="Cari pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </Box>

      {/* Message List */}
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
          {guests
            .filter(guest => 
              guest.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
              guest.pesan?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((guest) => (
              <ListItem 
                key={guest.nama}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  '&:last-child': { mb: 0 },
                  position: 'relative',
                  border: '1px solid #e3e3e3',
                  bgcolor: '#fffdfd'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'medium',
                          fontSize: '0.95rem',
                          color: '#202020'
                        }}
                      >
                        {guest.nama}
                      </Typography>
                      <Typography 
                        component="span"
                        sx={getStatusDeliveryStyle(guest.status_penyampaian)}
                      >
                        {guest.status_penyampaian === 'sudah disampaikan' ? 'sudah disampaikan' : 'belum disampaikan'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, guest)}
                      sx={{ 
                        padding: 0.5,
                        marginRight: -1,
                        marginTop: -0.5,
                        color: '#424242'
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#424242',
                      fontSize: '0.9rem',
                      mb: 0.5
                    }}
                  >
                    {guest.pesan || 'Tidak ada pesan'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#757575',
                      fontSize: '0.75rem',
                      display: 'block'
                    }}
                  >
                    {guest.status} • {formatDate(guest.tanggal, guest.waktu)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          {guests.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="#424242">
                Tidak ada pesan
              </Typography>
            </Box>
          )}
        </List>
      )}

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1,
            borderRadius: 2,
            minWidth: 120,
            bgcolor: '#fffdfd',
            '& .MuiMenuItem-root': {
              color: '#202020'
            }
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItemMui onClick={handleMenuEdit} sx={{ py: 1 }}>
          <EditIcon fontSize="small" sx={{ mr: 1, color: '#424242' }} />
          Edit
        </MenuItemMui>
        <MenuItemMui onClick={handleMenuDelete} sx={{ py: 1 }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: '#424242' }} />
          Hapus
        </MenuItemMui>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGuest ? 'Edit Pesan' : 'Tambah Pesan Baru'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama Tamu"
            fullWidth
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            disabled={!!editingGuest}
          />
          <TextField
            margin="dense"
            label="Pesan"
            fullWidth
            multiline
            rows={4}
            value={formData.pesan}
            onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="di rumah">Di Rumah</MenuItem>
              <MenuItem value="di luar">Di Luar</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status Penyampaian</InputLabel>
            <Select
              value={formData.status_penyampaian}
              onChange={(e) => setFormData({ ...formData, status_penyampaian: e.target.value })}
              label="Status Penyampaian"
            >
              <MenuItem value="belum disampaikan">Belum Disampaikan</MenuItem>
              <MenuItem value="sudah disampaikan">Sudah Disampaikan</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGuest ? 'Perbarui' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessageTab; 