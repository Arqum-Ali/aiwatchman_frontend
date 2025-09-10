import { useState } from "react";
import { ROLES } from "../config/roles";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

const AddCollaboratorPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [loading, setLoading] = useState(false);

  const handleSendInvite = async () => {
    setLoading(true);
    const invites = JSON.parse(localStorage.getItem("invites") || "[]");

    const newInvite = {
      email,
      role,
      addedBy: localStorage.getItem("user-email") || "currentUser@example.com",
    };

    invites.push(newInvite);
    localStorage.setItem("invites", JSON.stringify(invites));

    const templateParams = {
      role: role, // jo role aapne select kiya
      email: email, // matches {{email}} in template
      name: "Collaborater", // matches {{name}} in template
    };

    try {
      await emailjs.send(
        "service_u92j3n9", // replace with EmailJS service id
        "template_jlb379l", // replace with template id
        templateParams,
        "th7jDISNGhTpPm-Z4" // replace with your public key
      );
      toast.success(`Invitation email sent to ${email} as ${role}`);
      onClose();
    } catch (error) {
      console.error("Email send failed:", error);
      toast.error("Failed to send email, but collaborator added locally.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Add Collaborator</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border w-full p-2 mb-3"
        >
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.OWNER}>Owner</option>
          <option value={ROLES.VIEWER}>Viewer</option>
        </select>
        <button
          onClick={handleSendInvite}
          className="popup-btn"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
        <button
          onClick={onClose}
          className="popup-btn cancel-btn"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCollaboratorPopup;
