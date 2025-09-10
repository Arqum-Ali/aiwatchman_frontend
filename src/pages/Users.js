import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Users.css";
import AddCollaboratorPopup from "../components/AddCollaboratorPopup";

const Users = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    imageUrl: "",
  });
  const [newProfile, setNewProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const defaultAvatar = "/assets/default-avatar.png";
    const [showPopup, setShowPopup] = useState(false);
    const [invites, setInvites] = useState(
      JSON.parse(localStorage.getItem("invites") || "[]")
    );

    const handleClosePopup = () => {
      setShowPopup(false);
      setInvites(JSON.parse(localStorage.getItem("invites") || "[]"));
    };

useEffect(() => {
  const getProfile = async () => {
    try {
      setLoading(true);

      // 🔹 Get current logged in user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      console.log('currentUser', currentUser)

      if (currentUser) {
        // 🔹 Fetch profile data from your user_data table
        const { data, error } = await supabase
          .from("user_data")
          .select("name, phone, imageUrl")
          .eq("userId", currentUser.id) // 👈 match with userId field
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
          toast.error("Failed to fetch profile data.");
        }

        if (data) {
          console.log('data', data)
          // If data found
          setProfile(data);
          setNewProfile({
            name: data.name || "",
            email: currentUser.email || "",
            phone: data.phone || "",
          });
        } else {
          // If no data found → default values
          const defaultName = currentUser.email?.split("@")[0] || "User";
          setProfile({
            name: defaultName,
            phone: "",
            imageUrl: "",
          });
          setNewProfile({
            name: defaultName,
            email: currentUser.email,
            phone: "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  getProfile();
}, []);


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
       localStorage.removeItem("sb-access-token");
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newAvatarUrl = profile.imageUrl;

    try {
      // 1. Upload new avatar if a file is selected
      if (avatarFile) {
        const fileExtension = avatarFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}_avatar.${fileExtension}`;
        const { data, error } = await supabase.storage
          .from("profile_image")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = supabase.storage
          .from("profile_image")
          .getPublicUrl(data.path);

        newAvatarUrl = publicUrlData.publicUrl;
      }

      // 2. Update user data in the database
      const updates = {
        userId: user.id,
        name: newProfile.name,
        phone: newProfile.phone,
        imageUrl: newAvatarUrl,
      };

     const { data: existingProfile } = await supabase
       .from("user_data")
       .select("id")
       .eq("userId", user.id)
       .single();

     if (existingProfile) {
       // 🔹 Update existing row
       const { error } = await supabase
         .from("user_data")
         .update(updates)
         .eq("userId", user.id);

       if (error) throw error;
     } else {
       // 🔹 Insert new row
       const { error } = await supabase.from("user_data").insert(updates);

       if (error) throw error;
     }


      // 3. Update email if it has changed
      if (newProfile.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: newProfile.email,
        });
        if (emailError) {
          throw emailError;
        }
        // Fetch the updated user object to reflect the new email
        const {
          data: { user: updatedUser },
        } = await supabase.auth.getUser();
        setUser(updatedUser);
      }

      setProfile({
        ...profile,
        name: newProfile.name,
        phone: newProfile.phone,
        imageUrl: newAvatarUrl,
      });
      setEditing(false);
      setAvatarFile(null);
      setPreviewUrl(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setAvatarFile(null);
      setPreviewUrl(null);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
    setNewProfile({
      name: profile.name,
      email: user.email,
      phone: profile.phone,
    });
    setPreviewUrl(profile.imageUrl);
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="loading-state">Please log in to view your profile.</div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Page</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="add-collaborator-btn"
        >
          Add Collaborator
        </button>

        {showPopup && <AddCollaboratorPopup onClose={handleClosePopup} />}

        <h2 className="invites-heading">Invites</h2>
        {invites.length === 0 ? (
          <p className="invites-empty">No collaborators added yet.</p>
        ) : (
          <ul className="invite-list">
            {invites.map((inv, i) => (
              <li key={i} className="invite-item">
                <div>
                  <span>{inv.email}</span> — <span>{inv.role}</span>
                  <br />
                  <small>Added by: {inv.addedBy}</small>
                </div>
                <button
                  onClick={() => {
                    const updated = invites.filter((_, idx) => idx !== i);
                    setInvites(updated);
                    localStorage.setItem("invites", JSON.stringify(updated));
                  }}
                  className="remove-btn"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="profile-card">
          <div className="avatar-section">
            <img
              src={profile.imageUrl || defaultAvatar}
              alt="User Avatar"
              className="user-avatar"
            />
          </div>

          <div className="details-section">
            <h2>Hello, {profile.name || "_"} 👋</h2>
            <p>
              <strong>Email:</strong> {user.email || "_"}
            </p>
            <p>
              <strong>phone:</strong> {profile.phone || "_"}
            </p>
            <button onClick={handleEditClick} className="edit-button">
              Edit Profile
            </button>
          </div>
        </div>

        {editing && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label htmlFor="name-input">Name:</label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    value={newProfile.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email-input">Email:</label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    value={newProfile.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone-input">phone:</label>
                  <input
                    id="phone-input"
                    type="text"
                    name="phone"
                    value={newProfile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image:</label>
                  <label htmlFor="file-upload" className="custom-file-label">
                    {avatarFile ? "✅ Image Selected" : "📂 Choose new image"}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                    ref={fileInputRef}
                  />
                  {(previewUrl || profile.imageUrl) && (
                    <img
                      src={previewUrl || profile.imageUrl}
                      alt="Avatar Preview"
                      className="avatar-preview"
                    />
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
