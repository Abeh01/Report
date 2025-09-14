import { useState } from "react";
import "./create.css";

function Create() {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    concern: "",
    building: "",
    imageFile: null,
  });
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  // 🔹 Example predefined options
  const concernOptions = [
    "Electrical",
    "Plumbing",
    "Structural",
    "Safety",
    "Other",
  ];

  const buildingOptions = [
    "Main Building",
    "Library",
    "Gymnasium",
    "Science Hall",
    "Canteen",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setFormData({ ...formData, imageFile: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("concern", formData.concern);
    formDataToSend.append("building", formData.building);
    if (formData.imageFile) {
      formDataToSend.append("imageFile", formData.imageFile);
    }

    try {
      const res = await fetch("http://localhost:3000/api/reports", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();

      if (data.success) {
        setMessage("✅ Report submitted successfully!");
        setFormData({
          heading: "",
          description: "",
          concern: "",
          building: "",
          imageFile: null,
        });
        setPreview(null);
      } else {
        setMessage("❌ Failed to submit report.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Server error.");
    }
  };

  return (
    <div className="wrapper">
      <div className="row">
        <div className="card">
          <h1>Create a Report</h1>
          <hr />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Heading</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* 🔹 Concern Dropdown */}
            <div className="form-group">
              <label>Concern</label>
              <select
                name="concern"
                value={formData.concern}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Concern --</option>
                {concernOptions.map((concern, idx) => (
                  <option key={idx} value={concern}>
                    {concern}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔹 Building Dropdown */}
            <div className="form-group">
              <label>Building</label>
              <select
                name="building"
                value={formData.building}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Building --</option>
                {buildingOptions.map((building, idx) => (
                  <option key={idx} value={building}>
                    {building}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="file-upload">
              <label htmlFor="file-upload" className="file-upload-label">
                Upload Image
              </label>
              <input
                id="file-upload"
                type="file"
                name="imageFile"
                onChange={handleChange}
                className="file-upload-input"
              />
              {preview && (
                <div className="file-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit">
              Submit
            </button>
          </form>

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Create;
