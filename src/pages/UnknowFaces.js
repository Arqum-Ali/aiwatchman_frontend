import { useEffect, useState } from "react";
import "./Signup.css"; // Reuse existing CSS

export default function UnknownFaces() {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaces = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/unknown-faces");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch unknown faces");
          return;
        }

        setFaces(data.unknown_faces);
      } catch (err) {
        setError("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaces();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div
      className="signup-wrapper"
      style={{
        flexWrap: "wrap",
        display: "flex",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {faces.map((face, index) => (
        <div
          key={index}
          className="signup-card"
          style={{ width: "200px", textAlign: "center" }}
        >
          <img
            src={`http://127.0.0.1:5000/queries/${face.filename}`}
            alt="Unknown Face"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>Unknown</p>

          {/* Time */}
          {face.time && (
            <p style={{ fontSize: "12px", color: "#555" }}>
              Time: {face.time}
            </p>
          )}

          {/* Clickable link to Google Maps */}
          {face.latitude && face.longitude ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${face.latitude},${face.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12px", color: "#007bff", textDecoration: "underline" }}
            >
              View on Map
            </a>
          ) : (
            <p style={{ fontSize: "12px", color: "#555" }}>No location</p>
          )}
        </div>
      ))}
    </div>
  );
}
