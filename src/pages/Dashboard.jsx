// import { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Box,
//   TextField,
//   MenuItem,
//   IconButton,
//   Select,
//   InputLabel,
//   FormControl,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,   // ⬅️ tambahin ini
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Save as SaveIcon,
//   Close as CloseIcon,
//   Bookmark as BookmarkIcon,
//   BookmarkBorder as BookmarkBorderIcon,
//   Description as DescriptionIcon, // icon for notes
// } from "@mui/icons-material";

// import dayjs from "dayjs";
// import duration from "dayjs/plugin/duration";
// import relativeTime from "dayjs/plugin/relativeTime";

// import axios from "axios";

// dayjs.extend(duration);
// dayjs.extend(relativeTime);

// export default function Dashboard() {
//   const [applications, setApplications] = useState([]);
//   const [company, setCompany] = useState("");
//   const [position, setPosition] = useState("");
//   const [link, setLink] = useState("");
//   const [applicationSource, setApplicationSource] = useState("");
//   const [customSource, setCustomSource] = useState("");

//   const [editId, setEditId] = useState(null);
//   const [editCompany, setEditCompany] = useState("");
//   const [editPosition, setEditPosition] = useState("");
//   const [editLink, setEditLink] = useState("");
//   const [editSource, setEditSource] = useState("");
//   const [editCustomSource, setEditCustomSource] = useState("");

//   // Notes state
//   const [openNote, setOpenNote] = useState(false);
//   const [noteText, setNoteText] = useState("");
//   const [currentNoteId, setCurrentNoteId] = useState(null);

//   // Search & Sort
//   const [search, setSearch] = useState("");
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;

//   const statusOptions = ["Sedang diproses", "Review HR", "Screened", "Review User", "Ditolak", "Posisi ditutup", "Diterima"];
//   const sourceOptions = ["LinkedIn", "Jobstreet", "Kalibrr", "Email", "Other"];

//   // Format
//   const formatDateLong = (date) => {
//     if (!date) return "-";
//     return dayjs(date).format("D MMMM YYYY"); // contoh: 16 Maret 2025
//   };

//   // Hitung selisih Y/M/D antara fromDate dan today
//   const diffYMD = (fromDate, toDate = dayjs()) => {
//     if (!fromDate) return { y: 0, m: 0, d: 0 };
//     const start = dayjs(fromDate);
//     const end = dayjs(toDate);

//     let y = end.year() - start.year();
//     let m = end.month() - start.month();
//     let d = end.date() - start.date();

//     if (d < 0) {
//       // ambil hari terakhir bulan sebelumnya dari `end`
//       const lastDayPrevMonth = dayjs(end).date(1).subtract(1, "day").date();
//       d += lastDayPrevMonth;
//       m -= 1;
//     }
//     if (m < 0) {
//       m += 12;
//       y -= 1;
//     }

//     return { y, m, d };
//   };

//   const formatYMD = ({ y, m, d }) => {
//     const parts = [];
//     if (y) parts.push(`${y}y`);
//     if (m) parts.push(`${m}m`);
//     // selalu tunjukkan hari (jika 0, tampilkan 0d)
//     parts.push(`${d}d`);
//     return parts.join(" ");
//   };

//   const getElapsedLabel = (app) => {
//     const base = app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt;
//     const diff = diffYMD(base);
//     return formatYMD(diff);
//   };

//   // Fetch data
//   const fetchApplications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/applications", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const sorted = res.data.sort((a, b) => {
//         if (a.bookmarked === b.bookmarked) {
//           return new Date(b.updatedAt) - new Date(a.updatedAt);
//         }
//         return b.bookmarked - a.bookmarked;
//       });
//       setApplications(sorted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add application
//   const addApplication = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const finalSource = applicationSource === "Other" ? customSource : applicationSource;

//       await axios.post(
//         "http://localhost:5000/api/applications",
//         { company, position, link, applicationSource: finalSource },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchApplications();
//       setCompany("");
//       setPosition("");
//       setLink("");
//       setApplicationSource("");
//       setCustomSource("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete application
//   const deleteApplication = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/applications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setApplications(applications.filter((app) => app._id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   // Update (edit / status / notes)
//   const updateApplication = async (id, data) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/applications/${id}`,
//         data,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplications(applications.map((app) => (app._id === id ? res.data : app)));
//       setEditId(null); // reset the edit mode
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   // Bookmark toggle
//   const toggleBookmark = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/applications/${id}/bookmark`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplications((prev) => {
//         const updated = prev.map((app) => (app._id === id ? res.data : app));
//         return updated.sort((a, b) => {
//           if (a.bookmarked === b.bookmarked) {
//             return new Date(b.updatedAt) - new Date(a.updatedAt);
//           }
//           return b.bookmarked - a.bookmarked;
//         });
//       });
//     } catch (err) {
//       console.error("Bookmark failed", err);
//     }
//   };

//   // Notes open
//   const handleOpenNote = (app) => {
//     setCurrentNoteId(app._id);
//     setNoteText(app.notes || "");
//     setOpenNote(true);
//   };

//   const handleSaveNote = async () => {
//     try {
//       await updateApplication(currentNoteId, { notes: noteText });
//       setOpenNote(false);
//     } catch (err) {
//       console.error("Failed to save note", err);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   // Filter + Sort
//   const filteredData = applications.filter(
//     (app) =>
//       app.company.toLowerCase().includes(search.toLowerCase()) ||
//       app.position.toLowerCase().includes(search.toLowerCase()) ||
//       (app.applicationSource && app.applicationSource.toLowerCase().includes(search.toLowerCase()))
//   );

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortField) return 0;
//     const valA = a[sortField] || "";
//     const valB = b[sortField] || "";
//     if (sortOrder === "asc") return valA.localeCompare(valB);
//     return valB.localeCompare(valA);
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   // === Upload & Download CV ===
// const [selectedFile, setSelectedFile] = useState(null);
// const [openConfirmUpload, setOpenConfirmUpload] = useState(false);

// // Saat user pilih file
// const handleFileSelect = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setSelectedFile(file);
//     setOpenConfirmUpload(true); // buka modal konfirmasi
//   }
// };

// // Upload file ke backend
// const handleUploadCV = async () => {
//   if (!selectedFile) return;

//   const formData = new FormData();
//   formData.append("cv", selectedFile);

//   try {
//     const token = localStorage.getItem("token");
//     await axios.post("http://localhost:5000/api/upload-cv", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     alert("CV berhasil diupload!");
//     setOpenConfirmUpload(false);
//     setSelectedFile(null);
//   } catch (err) {
//     console.error("Upload gagal:", err);
//     alert("Gagal upload CV.");
//   }
// };

// // Download file dari backend
// const handleDownloadCV = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.get("http://localhost:5000/api/download-cv", {
//       headers: { Authorization: `Bearer ${token}` },
//       responseType: "blob", // agar bisa didownload
//     });

//     // Buat link blob agar bisa didownload
//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "CV_Updated.pdf");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (err) {
//     console.error("Download gagal:", err);
//     alert("Belum ada CV yang diupload atau terjadi kesalahan.");
//   }
// };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography variant="h4">Dashboard</Typography>
//         <Button variant="contained" color="error" onClick={handleLogout}>
//           Logout
//         </Button>
//       </Box>

// <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//   <Button variant="contained" component="label" color="primary">
//     Upload CV
//     <input
//       type="file"
//       accept=".pdf,.doc,.docx"
//       hidden
//       onChange={(e) => handleFileSelect(e)}
//     />
//   </Button>

//   <Button
//     variant="outlined"
//     color="secondary"
//     onClick={handleDownloadCV}
//   >
//     Download CV
//   </Button>
// </Box>

//       {/* Form for adding applications */}
//       <Box sx={{ mt: 4 }}>
//         <TextField
//           label="Perusahaan"
//           fullWidth
//           margin="normal"
//           value={company}
//           onChange={(e) => setCompany(e.target.value)}
//         />
//         <TextField
//           label="Posisi"
//           fullWidth
//           margin="normal"
//           value={position}
//           onChange={(e) => setPosition(e.target.value)}
//         />
//         <TextField
//           label="Link"
//           fullWidth
//           margin="normal"
//           value={link}
//           onChange={(e) => setLink(e.target.value)}
//         />

//         {/* Dropdown for Source */}
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Aplikasi</InputLabel>
//           <Select
//             value={applicationSource}
//             onChange={(e) => setApplicationSource(e.target.value)}
//             label="Aplikasi"
//           >
//             {sourceOptions.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         {applicationSource === "Other" && (
//           <TextField
//             label="Sumber Lainnya"
//             fullWidth
//             margin="normal"
//             value={customSource}
//             onChange={(e) => setCustomSource(e.target.value)}
//           />
//         )}

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={addApplication}>
//           Tambah Lamaran
//         </Button>
//       </Box>

//       {/* Search + Sort */}
//       <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
//         <TextField
//           label="Search (company, position, aplikasi)"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{ flex: 1 }}
//         />
//         <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Sort by</InputLabel>
//           <Select value={sortField} onChange={(e) => setSortField(e.target.value)} label="Sort by">
//             <MenuItem value="">None</MenuItem>
//             <MenuItem value="status">Status</MenuItem>
//             <MenuItem value="applicationSource">Aplikasi</MenuItem>
//           </Select>
//         </FormControl>
//         <FormControl sx={{ minWidth: 120 }}>
//           <InputLabel>Order</InputLabel>
//           <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Order">
//             <MenuItem value="asc">ASC</MenuItem>
//             <MenuItem value="desc">DESC</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Table with pagination */}
//       <Box sx={{ mt: 4, overflowX: "auto" }}>
//         <Typography variant="h5">Daftar Lamaran</Typography>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "16px",
//             minWidth: "950px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#f0f0f0" }}>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Job Position</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Company</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Link</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Aplikasi</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Status</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Masuk</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Update</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Days</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Actions</th>
//             </tr>
//           </thead>
//          <tbody>
//   {paginatedData.map((app) => {
//     const diff = diffYMD(app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt);
//     const isOverOneMonth = diff.y > 0 || diff.m > 0; // lebih dari 1 bulan
//     const isRejected = app.status === "Ditolak"; // kalau status ditolak

//     return (
//       <tr
//         key={app._id}
//         style={{
//           backgroundColor: isRejected || isOverOneMonth ? "#ffe5e5" : "transparent", // merah muda kalau > 1 bulan
//         }}
//       >
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editPosition}
//               onChange={(e) => setEditPosition(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             app.position
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editCompany}
//               onChange={(e) => setEditCompany(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             app.company
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editLink}
//               onChange={(e) => setEditLink(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             <a href={app.link} target="_blank" rel="noreferrer">
//               {app.link}
//             </a>
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <FormControl fullWidth size="small">
//               <Select
//                 value={editSource}
//                 onChange={(e) => setEditSource(e.target.value)}
//               >
//                 {sourceOptions.map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           ) : (
//             app.applicationSource
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           <TextField
//             select
//             value={app.status}
//             onChange={(e) => updateApplication(app._id, { status: e.target.value })}
//             size="small"
//             fullWidth
//           >
//             {statusOptions.map((s) => (
//               <MenuItem key={s} value={s}>{s}</MenuItem>
//             ))}
//           </TextField>
//         </td>

//         {/* Tanggal Masuk */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {formatDateLong(app.createdAt)}
//         </td>

//         {/* Tanggal Update */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {app.statusUpdatedAt ? formatDateLong(app.statusUpdatedAt) : "-"}
//         </td>

//         {/* Days */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {getElapsedLabel(app)}
//         </td>

//         {/* Actions */}
//         <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
//           {editId === app._id ? (
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <IconButton
//                 color="primary"
//                 onClick={() =>
//                   updateApplication(app._id, {
//                     company: editCompany,
//                     position: editPosition,
//                     link: editLink,
//                     applicationSource: editSource,
//                   })
//                 }
//               >
//                 <SaveIcon />
//               </IconButton>
//               <IconButton color="error" onClick={() => setEditId(null)}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 1,
//                 justifyItems: "center",
//               }}
//             >
//               <IconButton
//                 color="primary"
//                 onClick={() => {
//                   setEditId(app._id);
//                   setEditCompany(app.company);
//                   setEditPosition(app.position);
//                   setEditLink(app.link);
//                   setEditSource(app.applicationSource);
//                 }}
//               >
//                 <EditIcon />
//               </IconButton>
//               <IconButton color="error" onClick={() => deleteApplication(app._id)}>
//                 <DeleteIcon />
//               </IconButton>
//               <IconButton color="secondary" onClick={() => handleOpenNote(app)}>
//                 <DescriptionIcon />
//               </IconButton>
//               <IconButton onClick={() => toggleBookmark(app._id)}>
//                 {app.bookmarked ? (
//                   <BookmarkIcon color="warning" />
//                 ) : (
//                   <BookmarkBorderIcon />
//                 )}
//               </IconButton>
//             </Box>
//           )}
//         </td>
//       </tr>
//     );
//   })}
// </tbody>

//         </table>
//       </Box>

//       {totalPages > 1 && (
//   <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//     <Pagination
//       count={totalPages}
//       page={page}
//       onChange={(e, value) => setPage(value)}
//       color="primary"
//       showFirstButton
//       showLastButton
//     />
//   </Box>
// )}

//       {/* Modal Notes */}
//       <Dialog open={openNote} onClose={() => setOpenNote(false)} fullWidth>
//         <DialogTitle>Catatan</DialogTitle>
//         <DialogContent>
//           <TextField
//             value={noteText}
//             onChange={(e) => setNoteText(e.target.value)}
//             fullWidth
//             multiline
//             rows={4}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNote(false)}>Cancel</Button>
//           <Button onClick={handleSaveNote} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Modal Konfirmasi Upload */}
// <Dialog open={openConfirmUpload} onClose={() => setOpenConfirmUpload(false)}>
//   <DialogTitle>Konfirmasi Upload CV</DialogTitle>
//   <DialogContent>
//     <Typography>
//       Apakah kamu yakin ingin upload file: <b>{selectedFile?.name}</b>?
//     </Typography>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenConfirmUpload(false)}>Cancel</Button>
//     <Button variant="contained" onClick={handleUploadCV}>Upload</Button>
//   </DialogActions>
// </Dialog>

//     </Container>
//   );
// }

// Cara 2
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   IconButton,
//   Pagination,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputAdornment,
//   Select,
//   Typography,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Save as SaveIcon,
//   Close as CloseIcon,
//   Description as DescriptionIcon,
//   Bookmark as BookmarkIcon,
//   BookmarkBorder as BookmarkBorderIcon,
//   Search as SearchIcon,
//   Sort as SortIcon,
//   Logout as LogoutIcon,
//   UploadFile as UploadFileIcon,
//   Download as DownloadIcon,
// } from "@mui/icons-material";

// import ContentCopyIcon from "@mui/icons-material/ContentCopy";


// const Dashboard = () => {
//   const theme = useTheme();
//   const [applications, setApplications] = useState([]);
//   const [company, setCompany] = useState("");
//   const [position, setPosition] = useState("");
//   const [link, setLink] = useState("");
//   const [applicationSource, setApplicationSource] = useState("");
//   const [customSource, setCustomSource] = useState("");
//   const [status, setStatus] = useState("Sedang diproses");
//   const [startDate, setStartDate] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [customEditSource, setCustomEditSource] = useState("");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 10;

//   // Notes
//   const [openNote, setOpenNote] = useState(false);
//   const [noteText, setNoteText] = useState("");
//   const [currentNoteId, setCurrentNoteId] = useState(null);

//   // Note tidak bisa diedit
//   const [openReadNote, setOpenReadNote] = useState(false);
// const [readNoteText, setReadNoteText] = useState("");


//   // Upload CV
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [openConfirmUpload, setOpenConfirmUpload] = useState(false);

//   // Search & Sort
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("updatedAt");
//   const [sortOrder, setSortOrder] = useState("desc");

//   // Sorting di header table
//   const [sortField, setSortField] = useState("updatedAt");
//   const [sortDirection, setSortDirection] = useState("desc");



//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   useEffect(() => {
//   console.log("DATA:", applications);
// }, [applications]);


//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setApplications(sortApplications(res.data));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const sortApplications = (data) => {
//     return [...data].sort((a, b) => {
//       if (sortBy === "company") {
//         return sortOrder === "asc"
//           ? a.company.localeCompare(b.company)
//           : b.company.localeCompare(a.company);
//       }
//       if (sortBy === "status") {
//         return sortOrder === "asc"
//           ? a.status.localeCompare(b.status)
//           : b.status.localeCompare(a.status);
//       }
//       if (sortBy === "startDate") {
//         return sortOrder === "asc"
//           ? new Date(a.startDate || a.createdAt) -
//               new Date(b.startDate || b.createdAt)
//           : new Date(b.startDate || b.createdAt) -
//               new Date(a.startDate || a.createdAt);
//       }
//       if (sortBy === "bookmarked") {
//         return sortOrder === "asc"
//           ? a.bookmarked - b.bookmarked
//           : b.bookmarked - a.bookmarked;
//       }
//       return sortOrder === "asc"
//         ? new Date(a.updatedAt) - new Date(b.updatedAt)
//         : new Date(b.updatedAt) - new Date(a.updatedAt);
//     });
//   };

//   // Sorting header
// const handleSort = (field) => {
//   if (sortField === field) {
//     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//   } else {
//     setSortField(field);
//     setSortDirection("asc");
//   }
// };

// const renderSortIcon = (field) => {
//   if (sortField !== field) return "↕"; // bisa ganti icon MUI
//   return sortDirection === "asc" ? "⬆" : "⬇";
// };

// const applySorting = (data) => {
//   return [...data].sort((a, b) => {
//     let x = a[sortField];
//     let y = b[sortField];

//     // if date
//     if (["updatedAt", "startDate"].includes(sortField)) {
//       x = new Date(x);
//       y = new Date(y);
//     }

//     if (x < y) return sortDirection === "asc" ? -1 : 1;
//     if (x > y) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   });
// };


// // function copy link 
// const copyLink = (url) => {
//   navigator.clipboard.writeText(url);
//   alert("Link copied!");
// };


// // Buka note di table
// const handleOpenReadNote = (app) => {
//   setReadNoteText(app.notes || "(Tidak ada catatan)");
//   setOpenReadNote(true);
// };

//   const addApplication = async () => {
//     if (!company || !position) return alert("Lengkapi data dulu!");
//     try {
//       const finalSource =
//         applicationSource === "Other" ? customSource : applicationSource;
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/applications`,
//         {
//           company,
//           position,
//           link,
//           applicationSource: finalSource,
//           startDate,
//           status,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCompany("");
//       setPosition("");
//       setLink("");
//       setApplicationSource("");
//       setCustomSource("");
//       setStartDate("");
//       setStatus("Sedang diproses");
//       fetchApplications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteApplication = async (id) => {
//     if (!window.confirm("Yakin hapus data ini?")) return;
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/applications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchApplications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // const updateApplication = async (id, data) => {
//   //   try {
//   //     const finalData = {
//   //       ...data,
//   //       applicationSource:
//   //         data.applicationSource === "Other"
//   //           ? customEditSource || data.applicationSource
//   //           : data.applicationSource,
//   //     };
//   //     await axios.put(
//   //       `http://localhost:5000/api/applications/${id}`,
//   //       finalData,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     setEditId(null);
//   //     setCustomEditSource("");
//   //     fetchApplications();
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//   const updateApplication = async (id, data) => {
//     try {
//       const finalData = {
//         ...data,
//         applicationSource:
//           data.applicationSource === "Other"
//             ? customEditSource || data.applicationSource
//             : data.applicationSource,
//       };

//       // ✅ Tambah ini:
//       const oldApp = applications.find((a) => a._id === id);
//       if (oldApp && oldApp.status !== data.status) {
//         finalData.statusUpdatedAt = new Date(); // update waktu status berubah
//       }

//       await axios.put(
//          `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
//         finalData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEditId(null);
//       setCustomEditSource("");
//       fetchApplications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const toggleBookmark = async (id) => {
//     try {
//       const res = await axios.put(
//          `${import.meta.env.VITE_API_URL}/api/applications/${id}/bookmark`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplications((prev) => {
//         const updated = prev.map((app) => (app._id === id ? res.data : app));
//         return sortApplications(updated);
//       });
//     } catch (err) {
//       console.error("Bookmark failed", err);
//     }
//   };

//   const formatDate = (date) => (date ? dayjs(date).format("D MMMM YYYY") : "-");

//   const getElapsedLabel = (app) => {
//     const baseDate = app.statusUpdatedAt || app.startDate || app.createdAt;
//     const diffDays = dayjs().diff(dayjs(baseDate), "day");
//     if (diffDays < 1) return "Hari ini";
//     if (diffDays === 1) return "1 hari";
//     return `${diffDays} hari`;
//   };

//   const filteredApps = applications.filter((app) => {
//     const keyword = searchTerm.toLowerCase();
//     return (
//       app.company.toLowerCase().includes(keyword) ||
//       app.position.toLowerCase().includes(keyword) ||
//       app.applicationSource.toLowerCase().includes(keyword)
//     );
//   });

//   const paginatedData = filteredApps.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   const handlePageChange = (e, value) => setPage(value);

//  const getRowColor = (app) => {
//   const baseDate = app.statusUpdatedAt || app.startDate || app.createdAt;
//   const diffDays = dayjs().diff(dayjs(baseDate), "day");

//   const isRejected = app.status === "Ditolak" || diffDays > 30;

//   if (!isRejected) return "transparent";

//   // 🔥 Warna khusus untuk dark mode
//   if (theme.palette.mode === "dark") {
//     // return "#4a1f1f"; // merah gelap elegan
//     return "rgba(255, 80, 80, 0.12)";

//   }

//   // 🔆 Warna untuk light mode
//   // return "#ffcccc"; // pink soft
//   return "rgba(255, 0, 0, 0.2)";

// };


//   const handleOpenNote = (app) => {
//     setCurrentNoteId(app._id);
//     setNoteText(app.notes || "");
//     setOpenNote(true);
//   };

//   const handleSaveNote = async () => {
//     try {
//       await updateApplication(currentNoteId, { notes: noteText });
//       setOpenNote(false);
//     } catch (err) {
//       console.error("Failed to save note", err);
//     }
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//     setApplications((prev) => sortApplications(prev));
//   };

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//     setApplications((prev) => sortApplications(prev));
//   };

//   // === 🧩 Upload & Download CV ===
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setOpenConfirmUpload(true);
//     }
//   };

//   const handleUploadCV = async () => {
//     if (!selectedFile) return;
//     const formData = new FormData();
//     formData.append("cv", selectedFile);
//     try {
//       await axios.post( `${import.meta.env.VITE_API_URL}/api/upload-cv`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("CV berhasil diupload!");
//       setOpenConfirmUpload(false);
//       setSelectedFile(null);
//     } catch (err) {
//       console.error("Upload gagal:", err);
//       alert("Gagal upload CV.");
//     }
//   };

//   const handleDownloadCV = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/download-cv`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "CV_Updated.pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("Download gagal:", err);
//       alert("Belum ada CV yang diupload atau terjadi kesalahan.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   const tableStyle = {
//     borderCollapse: "collapse",
//     width: "100%",
//     fontSize: "14px",
//     textAlign: "center",
//     border: "1px solid #ddd",
//   };

//   const cellStyle = {
//     border: "1px solid #ddd",
//     padding: "8px",
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 20,
//         }}
//       >
//         <Typography variant="h4">Dashboard Lamaran</Typography>
//         <div style={{ display: "flex", gap: 10 }}>
//           <Button
//             variant="contained"
//             startIcon={<UploadFileIcon />}
//             component="label"
//           >
//             Upload CV
//             <input
//               type="file"
//               hidden
//               accept=".pdf,.doc,.docx"
//               onChange={handleFileSelect}
//             />
//           </Button>
//           <Button
//             variant="outlined"
//             color="secondary"
//             startIcon={<DownloadIcon />}
//             onClick={handleDownloadCV}
//           >
//             Download CV
//           </Button>
//           {/* <Button
//             variant="contained"
//             color="error"
//             startIcon={<LogoutIcon />}
//             onClick={handleLogout}
//           >
//             Logout
//           </Button> */}
//         </div>
//       </div>

//       {/* FORM INPUT */}
//       <div style={{ marginBottom: 20 }}>
//         <TextField
//           label="Company"
//           value={company}
//           onChange={(e) => setCompany(e.target.value)}
//           size="small"
//           sx={{ mr: 1, mb: 1 }}
//         />
//         <TextField
//           label="Position"
//           value={position}
//           onChange={(e) => setPosition(e.target.value)}
//           size="small"
//           sx={{ mr: 1, mb: 1 }}
//         />
//         <TextField
//           label="Link"
//           value={link}
//           onChange={(e) => setLink(e.target.value)}
//           size="small"
//           sx={{ mr: 1, mb: 1 }}
//         />
//         <TextField
//           select
//           label="Source"
//           value={applicationSource}
//           onChange={(e) => setApplicationSource(e.target.value)}
//           size="small"
//           sx={{ mr: 1, mb: 1, width: 200 }}
//         >
//           <MenuItem value="Jobstreet">Jobstreet</MenuItem>
//           <MenuItem value="LinkedIn">LinkedIn</MenuItem>
//           <MenuItem value="Website">Website</MenuItem>
//           <MenuItem value="Other">Other</MenuItem>
//         </TextField>
//         {applicationSource === "Other" && (
//           <TextField
//             label="Sumber lain"
//             value={customSource}
//             onChange={(e) => setCustomSource(e.target.value)}
//             size="small"
//             sx={{ mr: 1, mb: 1, width: 200 }}
//           />
//         )}
//         <TextField
//           label="Tanggal Masuk"
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           size="small"
//           InputLabelProps={{ shrink: true }}
//           sx={{ mr: 1, mb: 1 }}
//         />
//         <Button variant="contained" onClick={addApplication}>
//           Tambah
//         </Button>
//       </div>

//       {/* SEARCH & SORT */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//         <TextField
//           size="small"
//           variant="outlined"
//           placeholder="Cari perusahaan, posisi, atau sumber..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="action" />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ width: "40%" }}
//         />
//         <Select
//           size="small"
//           value={sortBy}
//           onChange={handleSortChange}
//           sx={{ width: 180 }}
//         >
//           <MenuItem value="updatedAt">Terbaru</MenuItem>
//           <MenuItem value="company">Company</MenuItem>
//           <MenuItem value="status">Status</MenuItem>
//           <MenuItem value="startDate">Tanggal Masuk</MenuItem>
//           <MenuItem value="bookmarked">Bookmark</MenuItem>
//         </Select>
//         <IconButton onClick={toggleSortOrder}>
//           <SortIcon color={sortOrder === "asc" ? "primary" : "action"} />
//         </IconButton>
//       </div>

//       {/* TABLE */}
//     <TableContainer
//   component={Paper}
//   sx={{
//     maxHeight: 600,
//     overflowX: "auto",
//     borderRadius: 2,
//   }}
// >
//  <Table stickyHeader>
//   <TableHead>
//     <TableRow>
//       {[
//         "No",
//         "Company",
//         "Position",
//         "Source",
//         "Link",
//         "Status",
//         "Tanggal Masuk",
//         "Update",
//         "Days",
//         "Actions",
//       ].map((header) => {
//         const fieldMap = {
//           Company: "company",
//           Position: "position",
//           Source: "applicationSource",
//           Status: "status",
//           "Tanggal Masuk": "startDate",
//           Update: "statusUpdatedAt",
//         };
//         const field = fieldMap[header];

//         return (
//           <TableCell
//             key={header}
//             sx={{
//               backgroundColor:
//                 theme.palette.mode === "dark"
//                   ? theme.palette.grey[900]
//                   : theme.palette.grey[200],
//               color: theme.palette.text.primary,
//               fontWeight: "bold",
//               textAlign: "center",
//               whiteSpace: "nowrap",
//               cursor: field ? "pointer" : "default",
//             }}
//             onClick={() => field && handleSort(field)}
//           >
//             {header} {field && renderSortIcon(field)}
//           </TableCell>
//         );
//       })}
//     </TableRow>
//   </TableHead>

//   <TableBody>
//     {applySorting(paginatedData).map((app, index) => (
//       <TableRow
//         key={app._id}
//         hover
//         sx={{
//           backgroundColor: getRowColor(app),
//           cursor: "pointer",
//         }}
//         onClick={() => handleOpenReadNote(app)}
//       >
//         {/* No */}
//         <TableCell align="center">
//           {(page - 1) * itemsPerPage + index + 1}
//         </TableCell>

//         {/* Company */}
//         <TableCell align="center">{app.company}</TableCell>

//         {/* Position */}
//         <TableCell align="center">{app.position}</TableCell>

//         {/* Source */}
//         <TableCell align="center">{app.applicationSource}</TableCell>

//         {/* Link */}
//         <TableCell align="center">
//           {app.link ? (
//             <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
//               <a
//                 href={app.link.startsWith("http") ? app.link : `https://${app.link}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#1976d2", textDecoration: "none", wordBreak: "break-all" }}
//                 onClick={(e) => e.stopPropagation()} // klik link tidak trigger row
//               >
//                 {app.link.length > 20
//                   ? app.link.slice(0, 20) + "..."
//                   : app.link}
//               </a>
//               <IconButton
//                 size="small"
//                 onClick={(e) => {
//                   e.stopPropagation(); // jangan buka popup note
//                   copyLink(app.link);
//                 }}
//               >
//                 <ContentCopyIcon fontSize="small" />
//               </IconButton>
//             </div>
//           ) : (
//             "-"
//           )}
//         </TableCell>

//         {/* Status */}
//         <TableCell align="center">{app.status}</TableCell>

//         {/* Tanggal Masuk */}
//         <TableCell align="center">{formatDate(app.startDate)}</TableCell>

//         {/* Update */}
//         <TableCell align="center">
//           {app.statusUpdatedAt ? formatDate(app.statusUpdatedAt) : "-"}
//         </TableCell>

//         {/* Days */}
//         <TableCell align="center">{getElapsedLabel(app)}</TableCell>

//         {/* Actions */}
//         <TableCell align="center" onClick={(e) => e.stopPropagation()}>
//           <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
//             <IconButton size="small" onClick={() => toggleBookmark(app._id)}>
//               {app.bookmarked ? <BookmarkIcon color="warning" /> : <BookmarkBorderIcon />}
//             </IconButton>
//             <IconButton size="small" color="primary" onClick={() => handleOpenNote(app)}>
//               <DescriptionIcon />
//             </IconButton>
//             <IconButton size="small" color="primary" onClick={() => { setEditId(app._id); setEditedData(app); }}>
//               <EditIcon />
//             </IconButton>
//             <IconButton size="small" color="error" onClick={() => deleteApplication(app._id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         </TableCell>
//       </TableRow>
//     ))}
//   </TableBody>
// </Table>

// </TableContainer>;

      

//       {/* PAGINATION */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
//         <Pagination
//           count={Math.ceil(filteredApps.length / itemsPerPage)}
//           page={page}
//           onChange={handlePageChange}
//           color="primary"
//         />
//       </div>

//       {/* DIALOG NOTE */}
//       <Dialog open={openNote} onClose={() => setOpenNote(false)} fullWidth>
//         <DialogTitle>Catatan</DialogTitle>
//         <DialogContent>
//           <TextField
//             multiline
//             rows={5}
//             fullWidth
//             value={noteText}
//             onChange={(e) => setNoteText(e.target.value)}
//             placeholder="Tulis catatan tentang aplikasi ini..."
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNote(false)}>Batal</Button>
//           <Button variant="contained" onClick={handleSaveNote}>
//             Simpan
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* DIALOG UPLOAD CV */}
//       <Dialog
//         open={openConfirmUpload}
//         onClose={() => setOpenConfirmUpload(false)}
//       >
//         <DialogTitle>Upload CV</DialogTitle>
//         <DialogContent>
//           <Typography>
//             File: <b>{selectedFile ? selectedFile.name : "Tidak ada file"}</b>
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             Apakah kamu yakin ingin mengupload CV ini? File sebelumnya akan
//             diganti.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmUpload(false)}>Batal</Button>
//           <Button
//             variant="contained"
//             onClick={handleUploadCV}
//             disabled={!selectedFile}
//           >
//             Upload
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Dialog Note Read Only */}
//      <Dialog open={openReadNote} onClose={() => setOpenReadNote(false)} fullWidth>
//   <DialogTitle>Catatan</DialogTitle>
//   <DialogContent>
//     <Typography sx={{ whiteSpace: "pre-wrap", minHeight: 120 }}>
//       {readNoteText}
//     </Typography>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenReadNote(false)}>Tutup</Button>
//   </DialogActions>
// </Dialog>


//     </div>
//   );
// };

// export default Dashboard;

// cara 3
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Select,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Logout as LogoutIcon,
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const statusOptions = [
  "Sedang diproses",
  "Review HR",
  "Screened",
  "Review User",
  "Ditolak",
  "Posisi ditutup",
  "Diterima",
];

const sourceOptions = ["Jobstreet", "LinkedIn", "Website", "Kalibrr", "Email", "Other"];

const Dashboard = () => {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [link, setLink] = useState("");
  const [applicationSource, setApplicationSource] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [status, setStatus] = useState("Sedang diproses");
  const [startDate, setStartDate] = useState("");

  // ✅ state edit (sudah ada di kode 1, kita manfaatkan)
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [customEditSource, setCustomEditSource] = useState("");

  // ✅ dialog edit
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Notes
  const [openNote, setOpenNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // Note tidak bisa diedit
  const [openReadNote, setOpenReadNote] = useState(false);
  const [readNoteText, setReadNoteText] = useState("");

  // Upload CV
  const [selectedFile, setSelectedFile] = useState(null);
  const [openConfirmUpload, setOpenConfirmUpload] = useState(false);

  // Search & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Sorting di header table
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    console.log("DATA:", applications);
  }, [applications]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(sortApplications(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const sortApplications = (data) => {
    return [...data].sort((a, b) => {
      if (sortBy === "company") {
        return sortOrder === "asc"
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
      if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortBy === "startDate") {
        return sortOrder === "asc"
          ? new Date(a.startDate || a.createdAt) -
              new Date(b.startDate || b.createdAt)
          : new Date(b.startDate || b.createdAt) -
              new Date(a.startDate || a.createdAt);
      }
      if (sortBy === "bookmarked") {
        return sortOrder === "asc"
          ? a.bookmarked - b.bookmarked
          : b.bookmarked - a.bookmarked;
      }
      return sortOrder === "asc"
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  };

  // Sorting header
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "⬆" : "⬇";
  };

  const applySorting = (data) => {
    return [...data].sort((a, b) => {
      let x = a[sortField];
      let y = b[sortField];

      if (["updatedAt", "startDate", "statusUpdatedAt", "createdAt"].includes(sortField)) {
        x = x ? new Date(x) : new Date(0);
        y = y ? new Date(y) : new Date(0);
      }

      if (x < y) return sortDirection === "asc" ? -1 : 1;
      if (x > y) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // function copy link
  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  // Buka note di table (read only)
  const handleOpenReadNote = (app) => {
    setReadNoteText(app.notes || "(Tidak ada catatan)");
    setOpenReadNote(true);
  };

  const addApplication = async () => {
    if (!company || !position) return alert("Lengkapi data dulu!");
    try {
      const finalSource =
        applicationSource === "Other" ? customSource : applicationSource;
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          company,
          position,
          link,
          applicationSource: finalSource,
          startDate,
          status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany("");
      setPosition("");
      setLink("");
      setApplicationSource("");
      setCustomSource("");
      setStartDate("");
      setStatus("Sedang diproses");
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ updateApplication sudah ada, kita biarkan tapi pakai juga untuk edit
  const updateApplication = async (id, data) => {
    try {
      const finalData = {
        ...data,
        applicationSource:
          data.applicationSource === "Other"
            ? customEditSource || data.applicationSource
            : data.applicationSource,
      };

      const oldApp = applications.find((a) => a._id === id);
      if (oldApp && data.status && oldApp.status !== data.status) {
        finalData.statusUpdatedAt = new Date();
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        finalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      setCustomEditSource("");
      setOpenEditDialog(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) => {
        const updated = prev.map((app) => (app._id === id ? res.data : app));
        return sortApplications(updated);
      });
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("D MMMM YYYY") : "-";

  const getElapsedLabel = (app) => {
    const baseDate = app.statusUpdatedAt || app.startDate || app.createdAt;
    const diffDays = dayjs().diff(dayjs(baseDate), "day");
    if (diffDays < 1) return "Hari ini";
    if (diffDays === 1) return "1 hari";
    return `${diffDays} hari`;
  };

  const filteredApps = applications.filter((app) => {
    const keyword = searchTerm.toLowerCase();
    return (
      app.company.toLowerCase().includes(keyword) ||
      app.position.toLowerCase().includes(keyword) ||
      (app.applicationSource || "").toLowerCase().includes(keyword)
    );
  });

  const paginatedData = filteredApps.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (e, value) => setPage(value);

  const getRowColor = (app) => {
    const baseDate = app.statusUpdatedAt || app.startDate || app.createdAt;
    const diffDays = dayjs().diff(dayjs(baseDate), "day");

    const isRejected = app.status === "Ditolak" || diffDays > 30;

    if (!isRejected) return "transparent";

    if (theme.palette.mode === "dark") {
      return "rgba(255, 80, 80, 0.12)";
    }

    return "rgba(255, 0, 0, 0.2)";
  };

  const handleOpenNote = (app) => {
    setCurrentNoteId(app._id);
    setNoteText(app.notes || "");
    setOpenNote(true);
  };

  const handleSaveNote = async () => {
    try {
      await updateApplication(currentNoteId, { notes: noteText });
      setOpenNote(false);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setApplications((prev) => sortApplications(prev));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setApplications((prev) => sortApplications(prev));
  };

  // === Upload & Download CV ===
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenConfirmUpload(true);
    }
  };

  const handleUploadCV = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("cv", selectedFile);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-cv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("CV berhasil diupload!");
      setOpenConfirmUpload(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload gagal:", err);
      alert("Gagal upload CV.");
    }
  };

  const handleDownloadCV = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/download-cv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CV_Updated.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download gagal:", err);
      alert("Belum ada CV yang diupload atau terjadi kesalahan.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ✅ buka dialog edit
  const handleOpenEdit = (app) => {
    setEditId(app._id);
    setEditedData({
      company: app.company || "",
      position: app.position || "",
      link: app.link || "",
      applicationSource: app.applicationSource || "",
      status: app.status || "Sedang diproses",
      startDate: app.startDate ? app.startDate.slice(0, 10) : "",
    });
    if (app.applicationSource === "Other") {
      setCustomEditSource("");
    }
    setOpenEditDialog(true);
  };

  const handleChangeEdited = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!editId) return;
    const payload = {
      ...editedData,
      applicationSource:
        editedData.applicationSource === "Other"
          ? customEditSource || editedData.applicationSource
          : editedData.applicationSource,
    };
    updateApplication(editId, payload);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Typography variant="h4">Dashboard Lamaran</Typography>
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            component="label"
          >
            Upload CV
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCV}
          >
            Download CV
          </Button>
          {/* <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button> */}
        </div>
      </div>

      {/* FORM INPUT */}
      <div style={{ marginBottom: 20 }}>
        <TextField
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
        <TextField
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
        <TextField
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
        <TextField
          select
          label="Source"
          value={applicationSource}
          onChange={(e) => setApplicationSource(e.target.value)}
          size="small"
          sx={{ mr: 1, mb: 1, width: 200 }}
        >
          {sourceOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        {applicationSource === "Other" && (
          <TextField
            label="Sumber lain"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            size="small"
            sx={{ mr: 1, mb: 1, width: 200 }}
          />
        )}
        <TextField
          label="Tanggal Masuk"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 1, mb: 1 }}
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          size="small"
          sx={{ mr: 1, mb: 1, width: 180 }}
        >
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={addApplication}>
          Tambah
        </Button>
      </div>

      {/* SEARCH & SORT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Cari perusahaan, posisi, atau sumber..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: "40%" }}
        />
        <Select
          size="small"
          value={sortBy}
          onChange={handleSortChange}
          sx={{ width: 180 }}
        >
          <MenuItem value="updatedAt">Terbaru</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="startDate">Tanggal Masuk</MenuItem>
          <MenuItem value="bookmarked">Bookmark</MenuItem>
        </Select>
        <IconButton onClick={toggleSortOrder}>
          <SortIcon color={sortOrder === "asc" ? "primary" : "action"} />
        </IconButton>
      </div>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 600,
          overflowX: "auto",
          borderRadius: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "No",
                "Company",
                "Position",
                "Source",
                "Link",
                "Status",
                "Tanggal Masuk",
                "Update",
                "Days",
                "Actions",
              ].map((header) => {
                const fieldMap = {
                  Company: "company",
                  Position: "position",
                  Source: "applicationSource",
                  Status: "status",
                  "Tanggal Masuk": "startDate",
                  Update: "statusUpdatedAt",
                };
                const field = fieldMap[header];

                return (
                  <TableCell
                    key={header}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[900]
                          : theme.palette.grey[200],
                      color: theme.palette.text.primary,
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      cursor: field ? "pointer" : "default",
                    }}
                    onClick={() => field && handleSort(field)}
                  >
                    {header} {field && renderSortIcon(field)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {applySorting(paginatedData).map((app, index) => (
              <TableRow
                key={app._id}
                hover
                sx={{
                  backgroundColor: getRowColor(app),
                  cursor: "pointer",
                }}
                onClick={() => handleOpenReadNote(app)}
              >
                {/* No */}
                <TableCell align="center">
                  {(page - 1) * itemsPerPage + index + 1}
                </TableCell>

                {/* Company */}
                <TableCell align="center">{app.company}</TableCell>

                {/* Position */}
                <TableCell align="center">{app.position}</TableCell>

                {/* Source */}
                <TableCell align="center">
                  {app.applicationSource || "-"}
                </TableCell>

                {/* Link */}
                <TableCell align="center">
                  {app.link ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      <a
                        href={
                          app.link.startsWith("http")
                            ? app.link
                            : `https://${app.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          wordBreak: "break-all",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {app.link.length > 20
                          ? app.link.slice(0, 20) + "..."
                          : app.link}
                      </a>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLink(app.link);
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Status */}
                <TableCell align="center">{app.status}</TableCell>

                {/* Tanggal Masuk */}
                <TableCell align="center">
                  {formatDate(app.startDate || app.createdAt)}
                </TableCell>

                {/* Update */}
                <TableCell align="center">
                  {app.statusUpdatedAt ? formatDate(app.statusUpdatedAt) : "-"}
                </TableCell>

                {/* Days */}
                <TableCell align="center">{getElapsedLabel(app)}</TableCell>

                {/* Actions */}
                <TableCell
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => toggleBookmark(app._id)}
                    >
                      {app.bookmarked ? (
                        <BookmarkIcon color="warning" />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenNote(app)}
                    >
                      <DescriptionIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(app)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteApplication(app._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Pagination
          count={Math.ceil(filteredApps.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* DIALOG NOTE EDIT */}
      <Dialog open={openNote} onClose={() => setOpenNote(false)} fullWidth>
        <DialogTitle>Catatan</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Tulis catatan tentang aplikasi ini..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNote(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSaveNote}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG UPLOAD CV */}
      <Dialog
        open={openConfirmUpload}
        onClose={() => setOpenConfirmUpload(false)}
      >
        <DialogTitle>Upload CV</DialogTitle>
        <DialogContent>
          <Typography>
            File:{" "}
            <b>{selectedFile ? selectedFile.name : "Tidak ada file"}</b>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Apakah kamu yakin ingin mengupload CV ini? File sebelumnya akan
            diganti.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmUpload(false)}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleUploadCV}
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Note Read Only */}
      <Dialog
        open={openReadNote}
        onClose={() => setOpenReadNote(false)}
        fullWidth
      >
        <DialogTitle>Catatan</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-wrap", minHeight: 120 }}>
            {readNoteText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReadNote(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Dialog Edit Application */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setEditId(null);
        }}
        fullWidth
      >
        <DialogTitle>Edit Lamaran</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Company"
              value={editedData.company || ""}
              onChange={(e) =>
                handleChangeEdited("company", e.target.value)
              }
              fullWidth
            />
            <TextField
              label="Position"
              value={editedData.position || ""}
              onChange={(e) =>
                handleChangeEdited("position", e.target.value)
              }
              fullWidth
            />
            <TextField
              label="Link"
              value={editedData.link || ""}
              onChange={(e) => handleChangeEdited("link", e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                label="Source"
                value={editedData.applicationSource || ""}
                onChange={(e) =>
                  handleChangeEdited("applicationSource", e.target.value)
                }
              >
                {sourceOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {editedData.applicationSource === "Other" && (
              <TextField
                label="Sumber Lainnya"
                value={customEditSource}
                onChange={(e) => setCustomEditSource(e.target.value)}
                fullWidth
              />
            )}

            <TextField
              select
              label="Status"
              value={editedData.status || "Sedang diproses"}
              onChange={(e) => handleChangeEdited("status", e.target.value)}
              fullWidth
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Tanggal Masuk"
              type="date"
              value={editedData.startDate || ""}
              onChange={(e) =>
                handleChangeEdited("startDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditId(null);
            }}
          >
            Batal
          </Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;

