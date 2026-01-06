import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import resumeCSS from "./App.css?inline";
import "./App.css";

function App() {
  const [template, setTemplate] = useState("classic");
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    objective: "",
    education: "",
    skills: "",
    experience:"",
    projects: "",
    certifications: ""
  });

  // ---------- INPUT HANDLING ----------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ---------- PDF DOWNLOAD ----------
  const downloadPDF = async () => {
    const resume = document.getElementById("resume");
    const canvas = await html2canvas(resume, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= 297;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= 297;
    }

    pdf.save("resume.pdf");
  };


  // ---------- UI ----------
  return (
    <div className="container">
      <h1>Professional Resume Generator</h1>
      <p className="subtitle">Use Desktop Mode for best preview experience</p>

      <label>Select Resume Template:</label>
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="classic">Classic</option>
        <option value="ats">ATS / Industry</option>
        <option value="placement">Placement Pro</option>
        <option value="split">Modern Split</option>
        <option value="timeline">Timeline Accent</option>

      </select>

      <form className="form">
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="github" placeholder="GitHub URL" onChange={handleChange} />
        <input name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
        <textarea name="objective" placeholder="Career Objective" onChange={handleChange} />
        <textarea name="education" placeholder="Education (one per line)" onChange={handleChange} />
        <textarea name="skills" placeholder="Skills (separate with | )" onChange={handleChange} />
        <textarea name="projects" placeholder="Projects (one per line)" onChange={handleChange} />
        <textarea name="certifications" placeholder="Certifications (one per line)" onChange={handleChange} />
        <textarea name="experience" placeholder="Experience (if any)" onChange={handleChange} />

        <label className="file-label">
          Upload Profile Photo
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>
      </form>

      {/* ---------- RESUME PREVIEW ---------- */}
      <div id="resume" className={`resume ${template} centered`}>
        {/* Classic Template */}
        {template === "classic" && (
          <div className="centered">
            {image && <img src={image} alt="Profile" className="profile-img" />}
            <h1>{formData.name || "Your Name"}</h1>
            <p>{formData.email} | {formData.phone}</p>
            {(formData.github || formData.linkedin) && (
              <p>
                {formData.github && <a href={formData.github} target="_blank" rel="noreferrer">{formData.github}</a>}
                {formData.github && formData.linkedin && " | "}
                {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer">{formData.linkedin}</a>}
              </p>
            )}
            <h3>Career Objective</h3>
            <p>{formData.objective}</p>
            <h3>Education</h3>
            <ul>{formData.education.split("\n").filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}</ul>
            <h3>Technical Skills</h3>
            <p>{formData.skills.split("|").filter(Boolean).map(s => s.trim()).join(" | ")}</p>
            <h3>Projects</h3>
            <ul>{formData.projects.split("\n").filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul>
            <h3>Certifications</h3>
            <ul>{formData.certifications.split("\n").filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}</ul>
            {formData.experience && (
  <section>
    <h3>Experience</h3>
    <p>{formData.experience}</p>
  </section>
)}

          </div>
        )}

        {/* ATS / Industry Template */}
        {template === "ats" && (
          <div className="ats-layout centered">
            <header className="ats-header">
              {image && <img src={image} alt="Profile" className="ats-img" />}
              <div>
                <h1>{formData.name || "Your Name"}</h1>
                <p>{formData.email} | {formData.phone}</p>
              </div>
            </header>
            {(formData.github || formData.linkedin) && (
              <p>
                {formData.github && <a href={formData.github} target="_blank" rel="noreferrer">
    {formData.github}
  </a>
}
                {formData.github && formData.linkedin && " | "}
                {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer">{formData.linkedin}</a>}
              </p>
            )}
            <h3>Career Objective</h3>
            <p>{formData.objective}</p>
            <h3>Education</h3>
            <ul>{formData.education.split("\n").filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}</ul>
            <h3>Technical Skills</h3>
            <p>{formData.skills.split("|").map(s => s.trim()).filter(Boolean).join(" | ")
  }
</p>
            <h3>Projects</h3>
            <ul>{formData.projects.split("\n").filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul>
            <h3>Certifications</h3>
            <ul>{formData.certifications.split("\n").filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}</ul>
            {formData.experience && (
  <section>
    <h3>Professional Experience</h3>
    <p>{formData.experience}</p>
  </section>
)}

          </div>
        )}

        {/* Placement Template */}
        {template === "placement" && (
          <div className="placement-layout centered">
            <div className="placement-header centered">
              <div>
                <h1>{formData.name || "Your Name"}</h1>
                <p>{formData.email} | {formData.phone}</p>
              </div>
              {image && <img src={image} alt="Profile" className="placement-img" />}
            </div>
            {(formData.github || formData.linkedin) && (
              <p>
                {formData.github && <a href={formData.github} target="_blank" rel="noreferrer">{formData.github}</a>}
                {formData.github && formData.linkedin && " | "}
                {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer">{formData.linkedin}</a>}
              </p>
            )}
            <h3>Career Objective</h3>
            <p>{formData.objective}</p>
            <h3>Education</h3>
            <ul>{formData.education.split("\n").filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}</ul>
            <h3>Projects</h3>
            <ul>{formData.projects.split("\n").filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul>
            <h3>Technical Skills</h3>
            <p>{formData.skills.split("|").filter(Boolean).map(s => s.trim()).join(" | ")}</p>
            <h3>Certifications</h3>
            <ul>{formData.certifications.split("\n").filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}</ul>
            {formData.experience && (
  <section>
    <h3>Internships / Experience</h3>
    <p>{formData.experience}</p>
  </section>
)}

          </div>
        )}
        {template === "timeline" && (
    <div className="timeline-layout">
      <div className="timeline-accent"></div>

      <div className="timeline-content">
        {image && <img src={image} className="timeline-img" alt="Profile" />}

        <h1>{formData.name || "Your Name"}</h1>
        <p>{formData.email} | {formData.phone}</p>

        {(formData.github || formData.linkedin) && (
          <p>
            {formData.github && <a href={formData.github}>{formData.github}</a>}
            {formData.github && formData.linkedin && " | "}
            {formData.linkedin && <a href={formData.linkedin}>{formData.linkedin}</a>}
          </p>
        )}

        <h3>Career Objective</h3>
        <p>{formData.objective}</p>

        <h3>Education</h3>
        <ul>
          {formData.education.split("\n").filter(Boolean).map((e,i)=>(
            <li key={i}>{e}</li>
          ))}
        </ul>

        {formData.experience && (
          <>
            <h3>Experience</h3>
            <p style={{whiteSpace:"pre-line"}}>{formData.experience}</p>
          </>
        )}
        {formData.certifications && (
  <section>
    <h3>Certifications</h3>
    <ul>
      {formData.certifications
        .split("\n")
        .filter(Boolean)
        .map((c, i) => (
          <li key={i}>{c}</li>
        ))}
    </ul>
  </section>
)}

        {formData.projects && (
  <section>
    <h3>Projects</h3>
    <ul>
      {formData.projects
        .split("\n")
        .filter(Boolean)
        .map((p, i) => (
          <li key={i}>{p}</li>
        ))}
    </ul>
  </section>
)}

        <h3>Skills</h3>
        <p>{formData.skills.split("|").map(s=>s.trim()).join(" | ")}</p>
      </div>
    </div>
  )}
        {/* Modern Split Template */}
        {template === "split" && (
          <div className="split-layout centered">
            <div className="split-left centered">
              {image && <img src={image} alt="Profile" className="split-img" />}
              <h3>Contact</h3>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
              {(formData.github || formData.linkedin) && (
                <p>
                  {formData.github && <a href={formData.github} target="_blank" rel="noreferrer">{formData.github}</a>}
                  {formData.github && formData.linkedin && " | "}
                  {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer">{formData.linkedin}</a>}
                </p>
              )}
              <h3>Skills</h3>
              <p>{formData.skills.split("|").filter(Boolean).map(s => s.trim()).join(" | ")}</p>
              {formData.certifications && (
              <>
               <h3>Certifications</h3>
               <ul>
               {formData.certifications.split("\n").filter(Boolean).map((cert, i) => (
               <li key={i}>{cert}</li>))}
               </ul>
               </>
              )}

              </div>
              <div className="split-right centered">
              <h1>{formData.name}</h1>
              <h3>Career Objective</h3>
              <p>{formData.objective}</p>
              <h3>Education</h3>
              <ul>{formData.education.split("\n").filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}</ul>
              <h3>Projects</h3>
              <ul>{formData.projects.split("\n").filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul>
              {formData.experience && (
              <section>
              <h3>Experience</h3>
              <p>{formData.experience}</p>
              </section>
              )}

            </div>
          </div>
        )}
        
        
      </div>
      
      {/* ---------- BUTTONS AT BOTTOM ---------- */}
      <div className="buttons centered">
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
}

export default App;
