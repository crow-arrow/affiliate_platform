import React, { useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../redux/features/users/userSlice' // Экшен для всех пользователей

export const Team = () => {
    const dispatch = useDispatch()
    const { users, status, error } = useSelector((state) => state.user) // ✅ Исправлено

    useEffect(() => {
        dispatch(fetchUsers()) // Загружаем всех пользователей при монтировании
    }, [dispatch])

    const columns = [
        { field: '_id', headerName: 'ID', width: 250 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'status', headerName: 'Status', width: 200 },
        { field: 'couponCode', headerName: 'Coupon', width: 100 },
    ];

    if (status === 'loading') return <p>Загрузка...</p>
    if (error) return <p>Ошибка: {error}</p>

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={users} columns={columns} getRowId={(row) => row._id} pageSize={5} />
        </div>
    )
}