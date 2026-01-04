import { useState } from 'react'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import './App.css';

function App() {
  const [template, setTemplate] = useState("classic");
  const [image, setImage] = useState(null);
  const handleDownloadPDF = async () => {
  const resume = document.getElementById("resume");

  const canvas = await html2canvas(resume, {
    scale: 3,          // higher scale for better quality
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("resume.pdf");
};

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
  const handleDownloadWord = async () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun({ text: formData.name, bold: true, size: 32 })] }),
          new Paragraph({ children: [new TextRun({ text: `${formData.email} | ${formData.phone}`, size: 22 })] }),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Career Objective", bold: true })] }),
          new Paragraph(formData.objective || " "),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Education", bold: true })] }),
          new Paragraph(formData.education || " "),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Technical Skills", bold: true })] }),
          new Paragraph(formData.skills || " "),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Projects", bold: true })] }),
          ...formData.projects.split("\n").map(p => new Paragraph(`• ${p}`)),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Certifications", bold: true })] }),
          new Paragraph(formData.certifications || " "),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "resume.docx");
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
        <h2>*Kindly Put Your Device in Desktop Mode*</h2>
        <label>Select Resume Template:</label>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="classic">Classic Engineering</option>
          <option value="ats">ATS / Industry</option>
          <option value="placement">Placement Pro</option>
          <option value="split">Modern Split</option>
          <option value="minimal">Minimal Pro</option>

        </select>

        <form className="form">
          <input type="file" accept="image/*" placeholder="Choose your photo" onChange={handleImageUpload} />

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />

          <textarea name="objective" placeholder="Career Objective" onChange={handleChange} />
          <textarea name="education" placeholder="Education" onChange={handleChange} />
          <textarea name="projects" placeholder="Projects" onChange={handleChange} />
          <textarea name="skills" placeholder="Skills(seperate with |)" onChange={handleChange} />
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
                <ul>
  {formData.education.split("\n").map((edu, i) => (
    <li key={i}>{edu}</li>
  ))}
</ul>
              </section>

              <section>
                <h3>Technical Skills</h3>
                <p>{formData.skills}</p>
              </section>

              <section>
                <h3>Projects</h3>
                <ul>
        {formData.projects.split("\n").map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
              </section>

              <section>
                <h3>Certifications</h3>
                <ul>
        {formData.certifications.split("\n").map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
              </section>
            </>
          )}
          
          {/* ATS / INDUSTRY TEMPLATE */}
          {template === "ats" && (
          <div className="ats-layout">

    <header className="ats-header">
      {image && <img src={image} alt="Profile" className="ats-img" />}
      <div>
        <h2>{formData.name}</h2>
        <p>{formData.email} | {formData.phone}</p>
      </div>
    </header>

    <section>
      <h3>Career Objective</h3>
      <p>{formData.objective}</p>
    </section>

    <section>
      <h3>Education</h3>
      <ul>
  {formData.education.split("\n").map((edu, i) => (
    <li key={i}>{edu}</li>
  ))}
</ul>
    </section>

    <section>
      <h3>Technical Skills</h3>
      <ul>
  {formData.skills
    .split("|")
    .map(s => s.trim())
    .filter(Boolean)
    .map((s, i) => (
      <li key={i}>{s}</li>
    ))}
</ul>
    </section>

    <section>
      <h3>Projects</h3>
      <ul>
        {formData.projects.split("\n").map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>

    <section>
      <h3>Certifications</h3>
      <ul>
        {formData.certifications.split("\n").map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
    </section>

  </div>
          )}

          {/* PLACEMENT / CAMPUS TEMPLATE */}
          {template === "placement" && (
  <div className="placement-layout">

    <div className="placement-header">
      <div>
        <h2>{formData.name}</h2>
        <p>{formData.email} | {formData.phone}</p>
      </div>
      {image && <img src={image} alt="Profile" className="placement-img" />}
    </div>

    <section>
      <h3>Career Objective</h3>
      <p>{formData.objective}</p>
    </section>

    <section>
      <h3>Education</h3>
      <ul>
  {formData.education.split("\n").map((edu, i) => (
    <li key={i}>{edu}</li>
  ))}
</ul>
    </section>

    <section>
      <h3>Projects</h3>
      <ul>
        {formData.projects.split('\n').map((proj, i) => (
          <li key={i}>{proj}</li>
        ))}
      </ul>
    </section>

    <section className="two-column">
      <div>
        <h3>Technical Skills</h3>
        <ul>
  {formData.skills
    .split("|")
    .map(s => s.trim())
    .filter(Boolean)
    .map((s, i) => (
      <li key={i}>{s}</li>
    ))}
</ul>
      </div>

      <div>
        <h3>Certifications</h3>
        <ul>
        {formData.certifications.split("\n").map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
      </div>
    </section>

  </div>
          )}

          {/* MODERN SPLIT TEMPLATE */}
          {template === "split" && (
  <div className="split-layout">

    <div className="split-left">
      {image && <img src={image} alt="Profile" className="split-img" />}

      <h3>Contact</h3>
      <p>{formData.email}</p>
      <p>{formData.phone}</p>

      <h3>Skills</h3>
      <ul>
  {formData.skills
    .split("|")
    .map(s => s.trim())
    .filter(Boolean)
    .map((s, i) => (
      <li key={i}>{s}</li>
    ))}
</ul>

      <h3>Certifications</h3>
      <p>{formData.certifications}</p>
    </div>

    <div className="split-right">
      <h1>{formData.name}</h1>

      <section>
        <h3>Career Objective</h3>
        <p>{formData.objective}</p>
      </section>

      <section>
        <h3>Education</h3>
        <ul>
  {formData.education.split("\n").map((edu, i) => (
    <li key={i}>{edu}</li>
  ))}
</ul>
      </section>

      <section>
        <h3>Projects</h3>
        <ul>
          {formData.projects.split('\n').map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
    </div>

  </div>
          )}

          {template === "minimal" && (
  <div className="minimal-layout">

    <div className="minimal-header">
      {image && <img src={image} alt="Profile" className="minimal-img" />}
      <div>
        <h1>{formData.name}</h1>
        <p>{formData.email} | {formData.phone}</p>
      </div>
    </div>

    <section>
      <h3>Career Objective</h3>
      <p>{formData.objective}</p>
    </section>

    <section>
      <h3>Education</h3>
      <ul>
  {formData.education.split("\n").map((edu, i) => (
    <li key={i}>{edu}</li>
  ))}
</ul>

    </section>

    <section>
      <h3>Technical Skills</h3>
      <ul>
  {formData.skills
    .split("|")
    .map(s => s.trim())
    .filter(Boolean)
    .map((s, i) => (
      <li key={i}>{s}</li>
    ))}
</ul>

    </section>

    <section>
      <h3>Projects</h3>
      <ul>
        {formData.projects.split("\n").map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>

    <section>
      <h3>Certifications</h3>
      <ul>
        {formData.certifications.split("\n").map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
    </section>

  </div>
          )}

        </div>

        <button onClick={handleDownload} style={{ marginTop: '10px' }}>
          Download as PDF
        </button>
        <button onClick={handleDownloadWord}>
         Download as Word (Editable)
        </button>

      </div>
    </>
  );
}

export default App;
