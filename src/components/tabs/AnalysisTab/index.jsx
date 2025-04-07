import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORY_COLORS = {
  'keluarga': '#202020',    // Hitam
  'teman': '#424242',       // Abu-abu gelap
  'tetangga': '#626262',    // Abu-abu sedang
  'teman kerja': '#828282', // Abu-abu terang
  'orang asing': '#9E9E9E'  // Abu-abu paling terang
};

const AnalysisTab = () => {
  const [tamuData, setTamuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTamu, setSelectedTamu] = useState(null);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [allTamu, setAllTamu] = useState([]);

  useEffect(() => {
    fetchTamuData();
  }, []);

  const fetchTamuData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tamu-analysis`);
      setTamuData(response.data);
      // Urutkan data tamu berdasarkan tanggal kunjungan terakhir
      const sortedTamu = (response.data.allTamu || []).sort((a, b) => 
        new Date(b.terakhir_datang) - new Date(a.terakhir_datang)
      );
      setAllTamu(sortedTamu);
    } catch (error) {
      console.error('Error fetching tamu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditKategori = (tamu) => {
    setSelectedTamu(tamu);
    setSelectedKategori(tamu.kategori);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTamu(null);
    setSelectedKategori('');
  };

  const handleSaveKategori = async () => {
    try {
      await axios.put(`${API_URL}/api/tamu/${selectedTamu.nama}/kategori`, {
        kategori: selectedKategori
      });
      fetchTamuData(); // Refresh data
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating kategori:', error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tamuData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading data</Typography>
      </Box>
    );
  }

  const kategoriStats = tamuData.kategoriStats || {};
  const recentVisitors = tamuData.recentVisitors || [];
  const frequentVisitors = tamuData.frequentVisitors || [];

  // Data untuk pie chart
  const pieData = Object.entries(kategoriStats).map(([name, value]) => ({
    name,
    value
  }));

  // Data untuk bar chart kunjungan per bulan
  const monthlyVisits = tamuData.monthlyVisits || [];

  return (
    <Box sx={{ p: 3, bgcolor: '#fffdfd', minHeight: '100vh' }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold', 
        color: '#202020',
        mb: 2 
      }}>
        Analisis Data Tamu
      </Typography>

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: '#e3e3e3', 
        mb: 3 
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          sx={{
            '& .MuiTab-root': {
              color: '#424242',
              fontSize: '0.85rem',
              textTransform: 'none',
              minHeight: 48
            },
            '& .Mui-selected': {
              color: '#202020',
              fontWeight: 500
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#202020'
            }
          }}
        >
          <Tab label="Dashboard" />
          <Tab label="Daftar Tamu" />
          <Tab label="Grafik" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px solid #e3e3e3',
              borderRadius: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  color: '#202020',
                  fontSize: '0.9rem',
                  mb: 2
                }}>
                  Statistik Kunjungan 7 Hari Terakhir
                </Typography>
                <Box sx={{ height: 200, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tamuData.dailyVisits}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                      <XAxis dataKey="hari" stroke="#424242" fontSize={12} />
                      <YAxis stroke="#424242" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fffdfd',
                          border: '1px solid #e3e3e3',
                          borderRadius: 8
                        }}
                      />
                      <Bar dataKey="jumlah" name="Jumlah Kunjungan">
                        {tamuData.dailyVisits.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#202020" fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              boxShadow: 'none',
              border: '1px solid #e3e3e3',
              borderRadius: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  color: '#202020',
                  fontSize: '0.9rem',
                  mb: 2
                }}>
                  Pengunjung Terakhir
                </Typography>
                <List>
                  {recentVisitors.map((visitor, index) => (
                    <React.Fragment key={visitor.nama}>
                      <ListItem 
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 2
                        }}
                      >
                        <Box sx={{ 
                          width: '100%', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 1 
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            color: '#202020'
                          }}>
                            {visitor.nama}
                          </Typography>
                          <Chip 
                            label={visitor.kategori}
                            size="small"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              color: '#202020',
                              fontSize: '0.75rem',
                              height: 24
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ 
                          color: '#757575',
                          fontSize: '0.75rem'
                        }}>
                          {new Date(visitor.terakhir_datang).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </ListItem>
                      {index < recentVisitors.length - 1 && (
                        <Divider sx={{ borderColor: '#e3e3e3' }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              boxShadow: 'none',
              border: '1px solid #e3e3e3',
              borderRadius: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  color: '#202020',
                  fontSize: '0.9rem',
                  mb: 2
                }}>
                  Statistik Kategori
                </Typography>
                <List>
                  {Object.entries(kategoriStats).map(([kategori, jumlah]) => (
                    <ListItem 
                      key={kategori}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2
                      }}
                    >
                      <Box sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: CATEGORY_COLORS[kategori],
                            mr: 2
                          }}
                        />
                        <Typography variant="body1" sx={{
                          fontSize: '0.85rem',
                          color: '#424242'
                        }}>
                          {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: '#202020',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        {jumlah}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Card sx={{ 
          boxShadow: 'none',
          border: '1px solid #e3e3e3',
          borderRadius: 3
        }}>
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#202020',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #e3e3e3'
                    }}>
                      Nama
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#202020',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #e3e3e3'
                    }}>
                      Kategori
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#202020',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #e3e3e3'
                    }}>
                      Jumlah Kunjungan
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#202020',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #e3e3e3'
                    }}>
                      Terakhir Berkunjung
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: '#202020',
                      fontSize: '0.85rem',
                      borderBottom: '1px solid #e3e3e3'
                    }}>
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allTamu
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tamu) => (
                      <TableRow 
                        key={tamu.nama}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          '& td': {
                            borderBottom: '1px solid #e3e3e3',
                            fontSize: '0.85rem',
                            color: '#424242'
                          }
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ 
                            fontWeight: 500,
                            color: '#202020',
                            fontSize: '0.85rem'
                          }}>
                            {tamu.nama}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={tamu.kategori}
                            size="small"
                            sx={{
                              backgroundColor: '#f5f5f5',
                              color: '#202020',
                              fontSize: '0.75rem',
                              height: 24
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {tamu.jumlah_kunjungan} kali
                        </TableCell>
                        <TableCell>
                          {new Date(tamu.terakhir_datang).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditKategori(tamu)}
                            sx={{
                              color: '#424242',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <EditIcon sx={{ fontSize: '1.2rem' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={allTamu.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Baris per halaman"
              sx={{
                color: '#424242',
                '& .MuiTablePagination-select': {
                  color: '#202020'
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#424242'
                }
              }}
            />
          </Box>
        </Card>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px solid #e3e3e3',
              borderRadius: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  color: '#202020',
                  fontSize: '0.9rem',
                  mb: 2
                }}>
                  Distribusi Kategori Tamu
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.name}`} 
                            fill={CATEGORY_COLORS[entry.name]}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fffdfd',
                          border: '1px solid #e3e3e3',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#424242'
                        }}
                      />
                      <Legend 
                        formatter={(value) => (
                          <span style={{ color: '#424242', fontSize: '0.85rem' }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px solid #e3e3e3',
              borderRadius: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  color: '#202020',
                  fontSize: '0.9rem',
                  mb: 2
                }}>
                  Kunjungan per Bulan
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyVisits}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                      <XAxis dataKey="bulan" stroke="#424242" fontSize={12} />
                      <YAxis stroke="#424242" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fffdfd',
                          border: '1px solid #e3e3e3',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#424242'
                        }}
                      />
                      <Legend 
                        formatter={(value) => (
                          <span style={{ color: '#424242', fontSize: '0.85rem' }}>
                            {value}
                          </span>
                        )}
                      />
                      <Bar 
                        dataKey="jumlah" 
                        fill="#202020" 
                        fillOpacity={0.85}
                        name="Jumlah Kunjungan" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#fffdfd'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#202020',
          fontSize: '1rem',
          fontWeight: 500
        }}>
          Ubah Kategori Tamu
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ 
              color: '#424242',
              fontSize: '0.9rem'
            }}>
              Kategori
            </InputLabel>
            <Select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              label="Kategori"
              sx={{
                '& .MuiSelect-select': {
                  fontSize: '0.9rem',
                  color: '#202020'
                }
              }}
            >
              {tamuData.kategoriList?.map((kategori) => (
                <MenuItem 
                  key={kategori} 
                  value={kategori}
                  sx={{
                    fontSize: '0.9rem',
                    color: '#424242'
                  }}
                >
                  {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#424242',
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            Batal
          </Button>
          <Button 
            onClick={handleSaveKategori} 
            variant="contained"
            sx={{
              bgcolor: '#202020',
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: '#424242'
              }
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalysisTab;
