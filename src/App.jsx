import { useState } from 'react'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [template, setTemplate] = useState("classic");
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    objective: '',
    education: '',
    skills: '',
    projects: '',
    certifications: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async () => {
  const resume = document.getElementById("resume");

  const canvas = await html2canvas(resume, {
    scale: 2,          // 🔥 VERY IMPORTANT (improves quality & size)
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("resume.pdf");
};


  return (
    <>
      <div className="container">
        <h1>Professional Resume Generator</h1>

        <label>Select Resume Template:</label>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="classic">Classic Engineering</option>
          <option value="modern">Modern Tech</option>
        </select>

        <form className="form">
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />

          <textarea name="objective" placeholder="Career Objective" onChange={handleChange} />
          <textarea name="education" placeholder="Education" onChange={handleChange} />
          <textarea name="projects" placeholder="Projects" onChange={handleChange} />
          <textarea name="skills" placeholder="Skills" onChange={handleChange} />
          <textarea name="certifications" placeholder="Certifications" onChange={handleChange} />
        </form>

        {/* RESUME PREVIEW */}
        <div id="resume" className={`resume ${template}`}>

          {/* CLASSIC TEMPLATE */}
          {template === "classic" && (
            <>
              {image && <img src={image} alt="Profile" className="profile-img" />}

              <h2>{formData.name}</h2>
              <p>{formData.email} | {formData.phone}</p>

              <section>
                <h3>Career Objective</h3>
                <p>{formData.objective}</p>
              </section>

              <section>
                <h3>Education</h3>
                <p>{formData.education}</p>
              </section>

              <section>
                <h3>Technical Skills</h3>
                <p>{formData.skills}</p>
              </section>

              <section>
                <h3>Projects</h3>
                <p>{formData.projects}</p>
              </section>

              <section>
                <h3>Certifications</h3>
                <p>{formData.certifications}</p>
              </section>
            </>
          )}

          {/* MODERN TEMPLATE */}
          {template === "modern" && (
            <div className="modern-layout">
              <div className="left">
                {image && <img src={image} alt="Profile" className="profile-img modern-img" />}

                <h2>{formData.name}</h2>
                <p>{formData.email}</p>
                <p>{formData.phone}</p>

                <h4>Skills</h4>
                <p>{formData.skills}</p>

                <h4>Certifications</h4>
                <p>{formData.certifications}</p>
              </div>

              <div className="right">
                <h3>Objective</h3>
                <p>{formData.objective}</p>

                <h3>Education</h3>
                <p>{formData.education}</p>

                <h3>Projects</h3>
                <p>{formData.projects}</p>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleDownload} style={{ marginTop: '10px' }}>
          Download as PDF
        </button>
      </div>
    </>
  );
}

export default App;
