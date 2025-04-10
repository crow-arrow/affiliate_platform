import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { fetchUsers, uploadAvatar} from "../redux/features/users/userSlice";
import avatarLogo from '../assets/avatar.png';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {CustomFileInput} from '../components/CustomFileInput'
import 'react-advanced-cropper/dist/themes/corners.css';

export const CropAvatarTest = ({ isOpen, onClose }) => {

  console.log('Avatar rendered')

  const dispatch = useDispatch();
    const { users, avatarStatus, status, message, error } = useSelector(
    (state) => ({
      users: state.user.users,
      avatarStatus: state.user.avatarStatus,
      status: state.user.status,
      message: state.user.message,
      error: state.user.error,
    }),
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

//   const [cropImage, setCropImage] = useState(null);
//   const cropperRef = useRef(null);

  useEffect(() => {
    if (isOpen) dispatch(fetchUsers());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (avatarStatus === "succeeded" && message) {
      toast.success(message);
  }
  }, [avatarStatus, message]);

//   const handleImageSelected = (imageDataUrl) => {
//     setCropImage(imageDataUrl);
//     setPreview(null);
//   };

  const handleImageCropped = (croppedImageDataUrl) => {
    setPreview(croppedImageDataUrl); // Обновляем превью обрезанным изображением
  };

  const handleUploadAvatar = async () => {
    if (!preview) {
      alert("Choose a file");
      return;
    }
  
    setLoading(true);
  
    const blob = await fetch(preview).then((res) => res.blob());
    const file = new File([blob], "avatar.png", { type: "image/png" });
  
    const formData = new FormData();
    formData.append("avatar", file);
  
    try {
      const response = await dispatch(uploadAvatar(formData));

      if (response.payload && response.payload.user) {
        dispatch({
          type: 'auth/updateUserAvatar', 
          payload: response.payload.user.avatarUrl
        });
      }
      onClose();
    } catch (error) {
      console.error('Error during avatar upload:', error)
      toast.error('Error during uploading avatar:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const user = users && users.length > 0 ? users[0] : null;
  const isButtonDisabled = loading

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
          <CloseOutlinedIcon />
        </button>
        {user ? (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex gap-16 items-start">
              <div>
                <CustomFileInput 
                  width={390}
                  height={295}
                  mimeTypes="image/jpeg, image/png, image/webp, image/avif"
                //   onImageSelected={handleImageSelected}
                  onImageCropped={handleImageCropped}
                  maxFileSize={10 * 1024 * 1024}
                  allowedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/avif']}
                />
                <button
                  onClick={handleUploadAvatar}
                  disabled={isButtonDisabled}
                  className="w-[390px] p-2 mt-8 text-s rounded-3xl bg-white text-gray-900 disabled:shadow-inset-2 disabled:bg-slate-500"
                >
                  {loading ? "Loading..." : "Upload Avatar"}
                </button>
              </div>
              <div className="flex flex-col gap-6 justify-between">
                <span className="text-center w-20 text-xl">Preview</span>
                {preview ? (
                    <img key={preview} className="w-28 h-28 object-cover rounded-full" src={preview} alt="Preview" />
                ) : (
                    <img key={avatarLogo} className="w-28 h-28 object-cover rounded-full" src={avatarLogo} alt="Preview" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
        {status === "failed" && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

CropAvatarTest.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};