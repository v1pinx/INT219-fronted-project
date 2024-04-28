const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(__dirname));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission and generate resume PDF
app.post("/generate-resume", (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        title,
        designation,
        address,
        email,
        phoneNo,
        summary,
        skill,
        school,
        degree,
        city,
        startYear,
        endYear,
        eduDescription,
        jobTitle,
        company,
        location,
        startYear2,
        endYear2,
        jobDescription,
        projectName,
        projectLink,
        proDes,
    } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument();
    const outputFilePath = path.join(__dirname, "resume.pdf");

    // Pipe the PDF output to a file
    doc.pipe(fs.createWriteStream(outputFilePath));

    // Add content to the PDF
    doc.font("Helvetica-Bold");
    doc.fontSize(24).text("Resume", { align: "center" });
    doc.moveDown();

    // About Section
    doc.fontSize(18).text("Personal Information", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${firstName} ${middleName || ""} ${lastName}`);
    doc.text(`Title: ${title}`);
    doc.text(`Designation: ${designation}`);
    doc.text(`Address: ${address}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone No: ${phoneNo}`);
    doc.text(`Summary: ${summary}`);
    doc.text(`Skills: ${skill}`);
    doc.moveDown();

    // Education Section
    doc.fontSize(18).text("Education", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`${degree}`);
    doc.text(`${school}, ${city}, Graduation Year: ${endYear}`);
    doc.text(`Description: ${eduDescription}`);
    doc.moveDown();

    // Experience Section
    doc.fontSize(18).text("Experience", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`${jobTitle}`);
    doc.text(`${company}, ${location}, Duration: ${startYear2} - ${endYear2}`);
    doc.text(`Description: ${jobDescription}`);
    doc.moveDown();

    // Projects Section
    doc.fontSize(18).text("Projects", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Project Name: ${projectName}`);
    doc.text(`Project Link: ${projectLink}`);
    doc.text(`Description: ${proDes}`);
    doc.moveDown();

    // Finalize PDF generation
    doc.end();

    // Send the generated PDF file as a response
    res.download(outputFilePath, "resume.pdf", (err) => {
        if (err) {
            console.error("Error sending resume PDF:", err);
            res.status(500).send("Error generating resume PDF");
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
