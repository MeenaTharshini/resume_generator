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
  const [role, setRole] = useState("student");
  const [field, setField] = useState("Computer Science");


  // ---------- INPUT HANDLING ----------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const formatSkills = (skills) => {
  return skills
    .replace(/,/g, "|")     // commas → |
    .split("|")             // split
    .map(s => s.trim())     // remove spaces
    .filter(Boolean)        // remove empty
    .join(" | ");           // join nicely
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
  const generateObjective = () => {
  const templates = {
    student: `Motivated ${field} student seeking opportunities to apply academic knowledge, technical skills, and problem-solving abilities in a professional environment.`,
    
    intern: `Enthusiastic ${field} intern eager to gain hands-on experience and contribute to real-world projects while continuously learning and improving technical skills.`,
    
    developer: `Detail-oriented ${field} professional with a strong foundation in software development, aiming to contribute to innovative projects and deliver scalable solutions.`
  };

  setFormData({
    ...formData,
    objective: templates[role]
  });
};

  //-------------------Project description----------
  const [enhancedProjects, setEnhancedProjects] = useState("");

  const enhanceProjects = () => {
  if (!formData.projects.trim()) return;

  // STEP 1: Extract ONLY real project titles
  const projectTitles = formData.projects
    .split("\n")
    .map(line => line.trim())
    .filter(line =>
      line &&
      !line.startsWith("-") &&
      !line.startsWith("GitHub:") &&
      !line.startsWith("Live Demo:") &&
      !line.startsWith("Tech Stack") &&
      !line.includes(".") // 🚨 KEY FIX
    );

  // STEP 2: Build clean enhanced output
  const enhanced = projectTitles
    .map(project => (
`${project}
GitHub: https://github.com/your-username/${project.toLowerCase().replace(/\s+/g, "-")}
Live Demo: https://your-live-link.com
Tech Stack: Python | React | HTML | CSS
- Designed and developed ${project} using modern technologies.
- Implemented core functionalities with a focus on usability and performance.
- Applied best practices to ensure scalability and maintainability.`
    ))
    .join("\n\n");

  setFormData({ ...formData, projects: enhanced });
};


const renderProjects = () => {
  const lines = formData.projects.split("\n").filter(Boolean);
  let projectCount = 0;

  return lines.map((line, i) => {
    // Project Title → NUMBER IT
    if (
      !line.startsWith("-") &&
      !line.startsWith("GitHub:") &&
      !line.startsWith("Live Demo:") &&
      !line.startsWith("Tech Stack")
    ) {
      projectCount += 1;
      return (
        <div
          key={i}
          style={{ fontWeight: "600", marginTop: "12px" }}
        >
          {projectCount}. {line}
        </div>
      );
    }

    // GitHub link
    if (line.startsWith("GitHub:")) {
      const url = line.replace("GitHub:", "").trim();
      return (
        <div key={i} style={{ marginLeft: "20px" }}>
          <strong>GitHub:</strong>{" "}
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </div>
      );
    }

    // Live demo link
    if (line.startsWith("Live Demo:")) {
      const url = line.replace("Live Demo:", "").trim();
      return (
        <div key={i} style={{ marginLeft: "20px" }}>
          <strong>Live Demo:</strong>{" "}
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </div>
      );
    }

    // Description bullet
    if (line.startsWith("-")) {
      return (
        <div key={i} style={{ marginLeft: "30px" }}>
          {line}
        </div>
      );
    }

    // Tech Stack
    return (
      <div key={i} style={{ marginLeft: "20px" }}>
        {line}
      </div>
    );
  });
};


  // ---------- UI ----------
  return (
    <div className="container">
      <h1>Resume Generator</h1>

      <h4>Select Resume Template:</h4>
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
        <textarea name="education" placeholder="Education (one per line)" onChange={handleChange} />
        <section>
        <textarea name="projects" placeholder="Projects (one per line)" value={formData.projects} onChange={handleChange} />
        <button
           type="button"
           className="enhance-btn"
           onClick={enhanceProjects}
        >Enhance Project Description
        </button>
      

        </section>
    <div className="objective-tools">
        <textarea name="objective" placeholder="Career Objective" onChange={handleChange} />
       
       <select value={role} onChange={(e) => setRole(e.target.value)}>
       <option value="student">Student</option>
       <option value="intern">Intern</option>
       <option value="developer">Developer</option>
       </select>

  <select value={field} onChange={(e) => setField(e.target.value)}>
    <option>Computer Science</option>
    <option>Artificial Intelligence</option>
    <option>Data Science</option>
    <option>Full Stack Development</option>
    <option>Cyber Security</option>
  </select>

  <button type="button" onClick={generateObjective}>
    Generate Objective
  </button>
</div>
         <input name="github" placeholder="GitHub URL" onChange={handleChange} />
        <input name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
        <textarea name="skills" placeholder="Skills (separate with | )" onChange={handleChange} />

        <textarea name="certifications" placeholder="Certifications (one per line)" onChange={handleChange} />
        <textarea name="experience" placeholder="Experience (if any)" onChange={handleChange} />

        <label className="file-label">
          Upload Profile Photo
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>
      </form>

      {/* ---------- RESUME PREVIEW ---------- */}
      <h2>Preview</h2>
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
            <p>{formatSkills(formData.skills)}</p>
            <section>
            <h3>Projects</h3>
            {renderProjects()}
            </section>

             {formData.certifications && (
              <section>
               <h3>Certifications</h3>
               <ul>
               {formData.certifications.split("\n").filter(Boolean).map((cert, i) => (
               <li key={i}>{cert}</li>))}
               </ul>
               </section>
              )}
            {formData.experience && (
          <>
            <h3>Experience</h3>
            <p style={{whiteSpace:"pre-line"}}>{formData.experience}</p>
          </>
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
            <p>{formatSkills(formData.skills)}</p>
            <section>
              <h3>Projects</h3>
              {formData.projects.split("\n").filter(Boolean).map((line, i) => {
              const isDescription = line.startsWith("-");
              return isDescription ? (
              <div key={i} style={{ marginLeft: "20px" }}>{line}
              </div>
              ) : (
              <div key={i} style={{ fontWeight: "600", marginTop: "10px" }}>
              {line}
              </div>
              );
              })}
            </section>
             {formData.certifications && (
              <section>
               <h3>Certifications</h3>
               <ul>
               {formData.certifications.split("\n").filter(Boolean).map((cert, i) => (
               <li key={i}>{cert}</li>))}
               </ul>
               </section>
              )}
            {formData.experience && (
          <>
            <h3>Experience</h3>
            <p style={{whiteSpace:"pre-line"}}>{formData.experience}</p>
          </>
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
            <section>
              <h3>Projects</h3>
              {formData.projects.split("\n").filter(Boolean).map((line, i) => {
              const isDescription = line.startsWith("-");
              return isDescription ? (
              <div key={i} style={{ marginLeft: "20px" }}>{line}
              </div>
              ) : (
              <div key={i} style={{ fontWeight: "600", marginTop: "10px" }}>
              {line}
              </div>
              );
              })}
            </section>
            <h3>Technical Skills</h3>
            <p>{formatSkills(formData.skills)}</p>
            {formData.certifications && (
              <section>
               <h3>Certifications</h3>
               <ul>
               {formData.certifications.split("\n").filter(Boolean).map((cert, i) => (
               <li key={i}>{cert}</li>))}
               </ul>
               </section>
              )}
            {formData.experience && (
          <>
            <h3>Experience</h3>
            <p style={{whiteSpace:"pre-line"}}>{formData.experience}</p>
          </>
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

      <section>
              <h3>Projects</h3>
              {formData.projects.split("\n").filter(Boolean).map((line, i) => {
              const isDescription = line.startsWith("-");
              return isDescription ? (
              <div key={i} style={{ marginLeft: "20px" }}>{line}
              </div>
              ) : (
              <div key={i} style={{ fontWeight: "600", marginTop: "10px" }}>
              {line}
              </div>
              );
              })}
            </section>

        <h3>Skills</h3>
        <p>{formatSkills(formData.skills)}</p>
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
              <p>{formatSkills(formData.skills)}</p>
              {formData.certifications && (
              <section>
               <h3>Certifications</h3>
               <ul>
               {formData.certifications.split("\n").filter(Boolean).map((cert, i) => (
               <li key={i}>{cert}</li>))}
               </ul>
               </section>
              )}

              </div>
              <div className="split-right centered">
              <h1>{formData.name}</h1>
              <h3>Career Objective</h3>
              <p>{formData.objective}</p>
              <h3>Education</h3>
              <ul>{formData.education.split("\n").filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}</ul>
              <section>
              <h3>Projects</h3>
              {formData.projects.split("\n").filter(Boolean).map((line, i) => {
              const isDescription = line.startsWith("-");
              return isDescription ? (
              <div key={i} style={{ marginLeft: "20px" }}>{line}
              </div>
              ) : (
              <div key={i} style={{ fontWeight: "600", marginTop: "10px" }}>
              {line}
              </div>
              );
              })}
            </section>
              {formData.experience && (
          <>
            <h3>Experience</h3>
            <p style={{whiteSpace:"pre-line"}}>{formData.experience}</p>
          </>
        )}
            </div>
          </div>
        )}
        
        
      </div>
      
      {/* ---------- BUTTONS AT BOTTOM ---------- */}
      <div className="buttons centered">
        <h4>*Kindly Use Desktop Mode for best preview and download experience*</h4>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
}

export default App;
