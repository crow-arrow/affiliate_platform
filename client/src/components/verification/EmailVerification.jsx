import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../../redux/features/verification/emailVerificationSlice.js'
import { toast } from 'react-toastify';

export const EmailVerification = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { token } = useParams();
    const { status, message, error } = useSelector((state) => state.verification);

    useEffect(() => {
        if (token) {
            dispatch(verifyEmail(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (status === "succeeded") {
            toast.success(message);
            setTimeout(() => navigate('/my-account'), 2000);
        } else if (status === 'failed') {
            toast.error(error || 'An error occurred');
        }
    }, [status, message, error, navigate]);

    return (
        <div style={styles.container}>
        <h2>Подтверждение Email</h2>
        {status === 'loading' ? (
            <>
            <p>Пожалуйста, подождите, пока мы подтверждаем ваш email...</p>
            <div style={styles.loader}></div>
            </>
        ) : (
            <p style={status === 'succeeded' ? styles.success : styles.error}>
                {message || 'Something went wrong'}
            </p>
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