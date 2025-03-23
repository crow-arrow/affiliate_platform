import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, uploadAvatar } from "../redux/features/users/userSlice";

export const Profile = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user || {});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = () => {
    if (!selectedAvatar) return;

    const formData = new FormData();
    formData.append("avatar", selectedAvatar);
    dispatch(uploadAvatar(formData)).then(() => {
      dispatch(fetchUsers());
    });
  };

  const user = users && users.length > 0 ? users[0] : null;

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.first_name}</h1>
          <p>{user.email}</p>

          {/* Превью загружаемого аватара */}
          {preview ? (
            <img src={preview} alt="Avatar Preview" width="100" />
          ) : user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" width="100" />
          ) : (
            <p>Аватар не найден</p>
          )}

          <div className="flex flex-col gap-5 items-start">
             {/* Выбор файла */}
            <input type="file" onChange={handleAvatarChange} accept="image/*" />

            {/* Кнопка загрузки */}
            <button onClick={handleUploadAvatar} disabled={status === "loading"} className="p-2 text-s rounded-md bg-white text-gray-900">
              {status === "loading" ? "loading..." : "upload avatar"}
            </button>
          </div>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
      {status === "failed" && <p>Error: {error}</p>}
    </div>
  );
};