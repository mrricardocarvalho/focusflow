import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import '../styles/UserProfile.css';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editedProfile.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
