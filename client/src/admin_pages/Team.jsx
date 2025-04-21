import { useEffect } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, Avatar, CircularProgress } from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../redux/features/users/userSlice'
import { toast } from 'react-toastify';
import {API_URL} from "../config"
import avatarLogo from '../assets/avatar.png'

export const Team = () => {
    console.log('Render List')

    const dispatch = useDispatch()
    const { users, status, error } = useSelector((state) => state.user || [])

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id).then(() => {
            toast.success('ID copied to clipboard!')
        }).catch((err) => {
            toast.error('Failed to copy: ' + err)
        })
    }

    const columns = [
        { 
            field: 'avatarUrl',
            headerName: 'Avatar',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Avatar
                        src={params.value ? `${API_URL}${params.value}` : avatarLogo}
                        alt={params.row.first_name}
                        onError={(e) => {
                            console.error("Error Avatar rendering:", params.value, e);
                            }}
                    />
                </Box>
            ),
            width: 80,
            sortable: false,
            filterable: false,
        },
        { field: 'first_name', headerName: 'First Name', editable: true, flex: 1 },
        { field: 'last_name', headerName: 'Last Name', editable: true, flex: 1 },
        { field: 'email', headerName: 'Email', editable: true, sortable: false, flex: 1 },
        { field: 'phone', headerName: 'Phone', editable: true, sortable: false, flex: 1 },
        { field: 'role', headerName: 'Role', editable: true, width: 100 },
        { 
            field: 'level',
            headerName: 'Level',
            editable: true,
            flex: 1,
            renderCell: ({ row: { level } }) => {
                return (
                    <Box className="w-[100%] h-[100%] flex justify-center items-center">
                        <Box 
                        className={`w-[100%] text-center p-1.5 rounded-md
                            ${level === 'Bronze' ? 'bg-gradient-bronze border-[1px] border-solid border-bronze-border text-bronze-text [text-shadow:0_2px_1px_rgba(205,_127,_50,_1)]' : 
                            level === 'Silver' ? 'bg-gradient-silver border-[1px] border-solid border-silver-border text-gray-700 [text-shadow:0_2px_1px_rgba(187,_187,_187,_1)]' : 
                            level === 'Gold' ? 'bg-gradient-gold border-[1px] border-solid border-gold-border text-gold-text [text-shadow:0_2px_1px_rgba(180,_126,_17,_1)]' : 'bg-none'}`}                        
                        >
                            <Typography>
                                { level }
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        { field: 'coupon_code', headerName: 'Coupon', editable: true, sortable: false, flex: 1 },
        {
            field: 'affiliate_id',
            headerName: 'Ref Link',
            sortable: false,
            renderCell: (params) => {
                if (!params.value) return null;
                const ref = params.value.toString();
                const truncatedRef = ref.length > 5 ? ref.slice(0, 5) + '...' : ref;

                const refLink = `https://jinn-travel.com/?affiliateId=${ref}`;
            
                return (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>
                        <a 
                            href={refLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:underline underline-offset-4 decoration-accent hover:text-accent duration-300"
                        >
                            {truncatedRef}
                        </a>
                    </Typography>
                    <button 
                            onClick={() => handleCopy(refLink)}
                        >
                        <ContentCopyRoundedIcon />
                    </button>
                </Box>
                );
            }
        },
        { field: 'booked_trips_count', headerName: 'Trips'},
        { field: 'number_of_travellers', headerName: 'Nº Travellers'},
    ];

    if (status === 'loading') {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }
        
    if (error) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h6" color="error">Error: {error}</Typography>
        </Box>
        )
    }

    if (users.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h6">No members</Typography>
            </Box>
        )
    }

    return (
        <Box 
            sx={{
                "& .MuiDataGrid-root": {
                    padding: "16px",
                    border: "none",
                },
                "& .css-1bcfz0k-MuiDataGrid-root .MuiDataGrid-cell": {
                    margin: "auto",
                    color: "white",
                    borderTop: "none",
                },
                "& .css-1bcfz0k-MuiDataGrid-root .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
                    borderBottom: "none",
                    borderTop: "none",
                },
                "& .css-1tdeh38": {
                    borderTop: "none",
                },
                "& .MuiDataGrid-columnSeparator": {
                    width: "0.5px"
                },
                "& .MuiDataGrid-filler": {
                    borderTop: "none",
                    border: "none",
                },
                "& .MuiDataGrid-container--top": {
                    backgroundColor: (theme) => `${theme.palette.background.default} !important`,
                    color: "#87888C",
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                },
                "& .css-1hr2sou-MuiTablePagination-root, .MuiButtonBase-root > svg, .MuiTablePagination-actions > button, .MuiInputBase-root > svg": {
                    color: "#87888C",
                    fill: "#87888C",
                },
            }} 
            style={{ height: '100%', width: '100%' }}
            className="p-4 rounded-2xl bg-secondary"
        >
        <DataGrid 
            rows={users}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.id}
        />
        </Box>
    )
}