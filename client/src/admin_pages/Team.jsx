import React, { useEffect } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../redux/features/users/userSlice'

export const Team = () => {
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
            width: 100,
            renderCell: ({ row: { level } }) => {
                return (
                    <Box className='flex h-12 my-0.5 justify-center items-center'>
                        <Box 
                            className={`w-[100%] my-0 mx-auto p-1.5 rounded-md
                                ${level === 'Bronze' ? 'bg-bronze-500' : 
                                level === 'Silver' ? 'bg-gray-200' : 
                                level === 'Gold' ? 'bg-accent' : 'bg-none'}`}                        
                            >
                            <p className="text-center text-sm text-gray-800">
                                { level }
                            </p>
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
                const ref = params.value.toString()
                const truncatedRef = ref.length > 5 ? ref.slice(0, 5) + '...' : ref
                            
                return (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography>{truncatedRef}</Typography>
                        <button 
                            onClick={() => handleCopy(params.value)}
                        >
                            <ContentCopyRoundedIcon />
                        </button>
                    </Box>
                )
            }
        },
        { field: 'booked_trips_count', headerName: 'Trips'},
    ];

    if (status === 'loading') return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Box style={{ height: '100%', width: '100%' }}>
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