import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, uploadAvatar } from '../redux/features/users/userSlice'; // Добавил action для загрузки аватара

export const Profile = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user || {});
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers()); // Загружаем пользователей при монтировании компонента
  }, [dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };

  const handleUploadAvatar = () => {
    if (selectedAvatar) {
      // Диспатчим экшен для загрузки аватара
      const formData = new FormData();
      formData.append('avatar', selectedAvatar);
      dispatch(uploadAvatar(formData));
    }
  };

  const user = users && users.length > 0 ? users[0] : null;

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" width="100" />
          ) : (
            <p>Аватар не найден</p>
          )}

          {/* Инпут для загрузки аватара */}
          <input
            type="file"
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <button onClick={handleUploadAvatar}>Загрузить аватар</button>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
      {status === 'failed' && <p>Ошибка: {error}</p>}
    </div>
  );
};