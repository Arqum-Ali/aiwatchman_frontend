import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.user_metadata?.avatar || "");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    let avatarUrl = preview;

    // Agar user ne nayi image upload ki
    if (image) {
      const { data, error } = await supabase.storage
        .from("avatars") // apna bucket name
        .upload(`avatars/${user.id}-${Date.now()}.png`, image, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(data.path);
        avatarUrl = publicUrl;
      }
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name, phone, avatar: avatarUrl },
    });

    if (updateError) {
      console.error("Update error:", updateError.message);
    } else {
      onSave(); // parent ko refresh karne ka signal
      onClose(); // modal band karna
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="upload-card w-[400px] relative">
        <h2 className="upload-title">Edit Profile</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold text-lg"
        >
          ✕
        </button>

        <div className="upload-form space-y-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <label htmlFor="avatar-upload" className="custom-file-label">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                "📂 Upload Avatar"
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-file-input"
            />
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            className="upload-btn w-full bg-green-500 hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
