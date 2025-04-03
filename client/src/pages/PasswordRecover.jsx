import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {resetPassword} from "../redux/features/password/resetPasswordSlice";
import { toast } from "react-toastify";
import logo from '../assets/logo.png'

export const PasswordRecover = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { status, message, errors } = useSelector((state) => state.password)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (status === "succeeded" && message) {
            toast.success(message);
        }

        if (errors && Array.isArray(errors) && errors.length > 0) {
            errors.forEach((err) => {
                toast.error(err.message || "Unknown error");
            });
        }

        if (status === "succeeded" && message) {
            navigate('/login');
        }
    }, [status, errors, message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
    
        const resultAction = await dispatch(resetPassword({
            token,
            newPassword,
            confirmPassword,
        }));
    
        if (resetPassword.fulfilled.match(resultAction)) {
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="flex h-screen flex-1 flex-col justify-center px-6 mx-auto lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img alt="Jinn community" src={logo} className="mx-auto h-10 w-auto" />
                <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">Password Recovery</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form 
                    noValidate
                    onSubmit={handleSubmit}
                    method="POST" 
                    className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        New Password
                        </label>
                        <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder='*********'
                            className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                        />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                            Confirm new password
                        </label>
                        </div>
                        <div className="mt-2">
                        <input
                            id="confirm-password"
                            name="password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder='*********'
                            className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                        />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="flex w-full justify-center rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-90 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
