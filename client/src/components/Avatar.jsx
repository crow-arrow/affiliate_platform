import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import PropTypes from "prop-types";
import {
  fetchUsers,
  uploadAvatar,
  resetAvatarStatus,
} from "../redux/features/users/userSlice";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { CustomFileInput } from "./CustomFileInput";
import "react-advanced-cropper/dist/themes/corners.css";

export const CropAvatar = ({ isOpen, onClose }) => {
  console.log("Avatar rendered");

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

  useEffect(() => {
    if (isOpen) dispatch(fetchUsers());
    dispatch(resetAvatarStatus());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (avatarStatus === "succeeded" && message) {
      toast.success(message);
    }
  }, [avatarStatus, message]);

  const handleImageSelected = (imageDataUrl) => {
    setPreview(imageDataUrl);
  };

  const handleClose = () => {
    dispatch(resetAvatarStatus());
    onClose();
  };

  const handleUploadAvatar = async () => {
    if (!preview) {
      alert("Choose a file");
      return;
    }

    setLoading(true);

    const blob = await fetch(preview).then((res) => res.blob());
    const file = new File([blob], "avatar.webp", { type: "image/webp" });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await dispatch(uploadAvatar(formData));

      if (response.payload && response.payload.user) {
        dispatch({
          type: "auth/updateUserAvatar",
          payload: response.payload.user.avatarUrl,
        });
      }
      dispatch(resetAvatarStatus());
      onClose();
    } catch (error) {
      console.error("Error during avatar upload:", error);
      toast.error(
        "Error during uploading avatar:",
        error.response?.data || error.message
      );
    } finally {
      dispatch(resetAvatarStatus());
      setLoading(false);
    }
  };

  const user = users && users.length > 0 ? users[0] : null;
  const isButtonDisabled = loading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="p-6 bg-secondary backdrop-blur-sm rounded-2xl shadow-lg">
        <button
          className="absolute top-4 right-4 text-xl"
          onClick={handleClose}
        >
          <CloseOutlinedIcon />
        </button>
        {user ? (
          <div className="flex flex-col w-full justify-center items-start">
            <div className="flex gap-16 items-start">
              <CustomFileInput
                width={390}
                height={290}
                mimeTypes="image/jpeg, image/png, image/webp, image/avif"
                onImageSelected={handleImageSelected}
                allowedFileTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/avif",
                ]}
              />
            </div>
            <button
              onClick={handleUploadAvatar}
              disabled={isButtonDisabled}
              className="w-[390px] p-2 mt-8 text-s rounded-xl bg-white text-gray-900 
                    disabled:shadow-inset-2 disabled:bg-slate-500 disabled:animate-pulse disabled:cursor-progress"
            >
              {loading ? "Loading..." : "Upload Avatar"}
            </button>
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
        {status === "failed" && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

CropAvatar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
