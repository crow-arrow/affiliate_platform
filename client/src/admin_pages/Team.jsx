import React, { useEffect } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../redux/features/users/userSlice'

export const Team = () => {
    console.log('Render List')

    const dispatch = useDispatch()
    const { users, status, error } = useSelector((state) => state.user || [])

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id).then(() => {
            alert('ID copied to clipboard!')
        }).catch((err) => {
            alert('Failed to copy: ' + err)
        })
    }

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'first_name', headerName: 'First Name', editable: true, flex: 1 },
        { field: 'last_name', headerName: 'Last Name', editable: true, flex: 1 },
        { field: 'email', headerName: 'Email', editable: true, flex: 1 },
        { field: 'phone', headerName: 'Phone', editable: true, flex: 1 },
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
                            ${level === 'Bronze' ? 'bg-bronze-500 text-gray-800' : 
                            level === 'Silver' ? 'bg-gray-200 text-gray-800' : 
                            level === 'Gold' ? 'bg-accent text-gray-800' : 'bg-none'}`}                        
                        >
                            <Typography>
                                { level }
                            </Typography>
                    </Box>
                    </Box>
                )
            }
        },
        { field: 'coupon_code', headerName: 'Coupon', editable: true, flex: 1 },
        {
            field: 'affiliate_id',
            headerName: 'Ref Link',
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
    ];

    if (status === 'loading') return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Box 
            sx={{
                "& .MuiDataGrid-cell": {
                    margin: "auto",
                    color: "white",
                },
                "& .MuiDataGrid-footerContainer, .MuiDataGrid-container--top": {
                    backgroundColor: (theme) => `${theme.palette.background.default} !important`,
                },
            }}  
            style={{ height: '100%', width: '100%' }}
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