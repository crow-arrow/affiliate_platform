import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const EmailVerification = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        // Извлекаем токен из URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
        setStatus('error');
        setMessage('Ошибка: Токен не найден.');
        } else {
        // Отправляем запрос на сервер для подтверждения email
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
            if (data.message === 'Email successfully verified') {
                setStatus('success');
                setMessage('Ваш email успешно подтвержден!');
                setTimeout(() => navigate('/my-account'), 3000)
            } else {
                setStatus('error');
                setMessage('Ошибка при подтверждении email. Попробуйте еще раз.');
            }
            })
            .catch((error) => {
            console.error('Error:', error);
            setStatus('error');
            setMessage('Произошла ошибка, попробуйте позже.');
            });
        }
    }, [navigate]);

    return (
        <div style={styles.container}>
        <h2>Подтверждение Email</h2>
        {status === 'loading' ? (
            <>
            <p>Пожалуйста, подождите, пока мы подтверждаем ваш email...</p>
            <div style={styles.loader}></div>
            </>
        ) : (
            <p style={status === 'success' ? styles.success : styles.error}>{message}</p>
        )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        margin: 0,
        textAlign: 'center',
        padding: '20px',
    },
    loader: {
        display: 'inline-block',
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    success: {
        color: 'green',
        fontSize: '18px',
    },
    error: {
        color: 'red',
        fontSize: '18px',
    },
};