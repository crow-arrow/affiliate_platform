import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const EmailSentMessage = () => {

    return (
        <div className='flex w-full h-screen bg-gradient-primary justify-center items-center'>
            <div className='flex flex-col bg-white  px-40 py-20 gap-8 justify-between items-center rounded-xl shadow-custom'>
                <h1 className='text-3xl -mt-10'>Email Confirmation</h1>
                    <p className='w-full text-base text-center text-green-400'>
                        <CheckCircleIcon />
                        <span className='ml-2'>Email sent successfully</span>
                    </p>
            </div>
        </div>
    );
};