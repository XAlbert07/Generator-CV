import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { CVData } from "@/types/cv";

export type ExportFormat = "pdf_visual" | "pdf_ats" | "docx";

export type ExportOptions = {
  format: ExportFormat;
  filename: string; // without extension or with; we normalize
  marginMm: number;
  fontFamily: "sans" | "serif" | "mono";
  fontSizePt: number;
  rasterScale: number; // for visual PDF
};

function withExtension(name: string, ext: "pdf" | "docx") {
  const trimmed = (name || "").trim() || "Mon_CV";
  const normalized = trimmed.replace(/[\\/:*?"<>|]+/g, "_");
  return normalized.toLowerCase().endsWith(`.${ext}`) ? normalized : `${normalized}.${ext}`;
}

function pdfFontFromChoice(choice: ExportOptions["fontFamily"]): "helvetica" | "times" | "courier" {
  if (choice === "serif") return "times";
  if (choice === "mono") return "courier";
  return "helvetica";
}

export async function exportVisualPdfFromElementId(elementId: string, opts: ExportOptions) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element not found: ${elementId}`);

  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;

  try {
    // Force 1:1 for capture (desktop preview is scaled via CSS var)
    element.style.transform = "scale(1)";
    element.style.transformOrigin = "top left";

    const canvas = await html2canvas(element, {
      scale: opts.rasterScale,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = Math.max(0, Number.isFinite(opts.marginMm) ? opts.marginMm : 0);

    const maxW = pdfWidth - margin * 2;
    const maxH = pdfHeight - margin * 2;

    const imgW = canvas.width;
    const imgH = canvas.height;
    const imgRatio = imgW / imgH;

    let drawW = maxW;
    let drawH = drawW / imgRatio;
    if (drawH > maxH) {
      drawH = maxH;
      drawW = drawH * imgRatio;
    }

    const x = margin + (maxW - drawW) / 2;
    const y = margin + (maxH - drawH) / 2;

    pdf.addImage(imgData, "PNG", x, y, drawW, drawH);
    pdf.save(withExtension(opts.filename, "pdf"));
  } finally {
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
}

type PdfCursor = {
  x: number;
  y: number;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  lineHeight: number;
};

function ensureSpace(pdf: jsPDF, c: PdfCursor, needed: number) {
  if (c.y + needed <= c.pageHeight - c.margin) return;
  pdf.addPage();
  c.y = c.margin;
}

function textBlock(pdf: jsPDF, c: PdfCursor, text: string, fontSizePt?: number) {
  const size = fontSizePt ?? pdf.getFontSize();
  pdf.setFontSize(size);
  const lines = pdf.splitTextToSize(text, c.pageWidth - c.margin * 2);
  ensureSpace(pdf, c, lines.length * c.lineHeight);
  pdf.text(lines, c.x, c.y);
  c.y += lines.length * c.lineHeight;
}

function heading(pdf: jsPDF, c: PdfCursor, title: string) {
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(12);
  ensureSpace(pdf, c, c.lineHeight * 2);
  pdf.text(title.toUpperCase(), c.x, c.y);
  c.y += c.lineHeight * 0.9;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.2);
  pdf.line(c.x, c.y, c.pageWidth - c.margin, c.y);
  c.y += c.lineHeight;
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(11);
}

function linkLine(pdf: jsPDF, c: PdfCursor, label: string, value: string, url: string) {
  const text = `${label}: ${value}`;
  ensureSpace(pdf, c, c.lineHeight);
  pdf.text(text, c.x, c.y);
  const w = pdf.getTextWidth(text);
  // Add clickable area over the whole text.
  pdf.link(c.x, c.y - 3.2, w, 4.6, { url });
  c.y += c.lineHeight;
}

export function exportAtsPdf(cvData: CVData, opts: ExportOptions) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = Math.max(8, Number.isFinite(opts.marginMm) ? opts.marginMm : 12);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setTextColor(0);
  pdf.setFont(pdfFontFromChoice(opts.fontFamily), "normal");
  pdf.setFontSize(Math.max(9, opts.fontSizePt));

  const c: PdfCursor = {
    x: margin,
    y: margin,
    pageWidth,
    pageHeight,
    margin,
    lineHeight: 5,
  };

  const { personalInfo, experiences, education, skills, languages } = cvData;

  // Header
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(16);
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "PRÉNOM NOM";
  ensureSpace(pdf, c, 10);
  pdf.text(fullName.toUpperCase(), c.x, c.y);
  c.y += 7;

  pdf.setFont(undefined, "normal");
  pdf.setFontSize(Math.max(10, opts.fontSizePt));
  if (personalInfo.title) {
    pdf.text(personalInfo.title, c.x, c.y);
    c.y += 6;
  }

  // Contact (clickable where relevant)
  const hasContact =
    !!personalInfo.email ||
    !!personalInfo.phone ||
    !!personalInfo.address ||
    !!personalInfo.linkedin ||
    !!personalInfo.website;
  if (hasContact) {
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);
    pdf.line(c.x, c.y, pageWidth - margin, c.y);
    c.y += 5;

    if (personalInfo.email) linkLine(pdf, c, "Email", personalInfo.email, `mailto:${personalInfo.email}`);
    if (personalInfo.phone) linkLine(pdf, c, "Téléphone", personalInfo.phone, `tel:${personalInfo.phone}`);
    if (personalInfo.address) {
      textBlock(pdf, c, `Adresse: ${personalInfo.address}`);
    }
    if (personalInfo.linkedin) {
      const url = personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`;
      linkLine(pdf, c, "LinkedIn", personalInfo.linkedin, url);
    }
    if (personalInfo.website) {
      const url = personalInfo.website.startsWith("http") ? personalInfo.website : `https://${personalInfo.website}`;
      linkLine(pdf, c, "Site web", personalInfo.website, url);
    }
    c.y += 2;
  }

  // Summary
  if (personalInfo.summary) {
    heading(pdf, c, "Résumé professionnel");
    textBlock(pdf, c, personalInfo.summary);
    c.y += 2;
  }

  // Experience
  if (experiences.length) {
    heading(pdf, c, "Expérience");
    for (const exp of experiences) {
      const title = `${exp.position || "Poste"} — ${exp.company || "Entreprise"}`.trim();
      pdf.setFont(undefined, "bold");
      textBlock(pdf, c, title, 11);
      pdf.setFont(undefined, "normal");
      const dates = `${exp.startDate || ""}${exp.startDate || exp.endDate ? " - " : ""}${exp.current ? "Présent" : exp.endDate || ""}`.trim();
      if (dates) {
        textBlock(pdf, c, dates, 10);
      }
      if (exp.description) {
        textBlock(pdf, c, exp.description);
      }
      c.y += 2;
    }
  }

  // Education
  if (education.length) {
    heading(pdf, c, "Formation");
    for (const edu of education) {
      const title = `${edu.degree || "Diplôme"}${edu.field ? ` - ${edu.field}` : ""} — ${edu.school || "Établissement"}`.trim();
      pdf.setFont(undefined, "bold");
      textBlock(pdf, c, title, 11);
      pdf.setFont(undefined, "normal");
      const dates = `${edu.startDate || ""}${edu.startDate || edu.endDate ? " - " : ""}${edu.endDate || ""}`.trim();
      if (dates) textBlock(pdf, c, dates, 10);
      if (edu.description) textBlock(pdf, c, edu.description);
      c.y += 2;
    }
  }

  // Skills
  if (skills.length) {
    heading(pdf, c, "Compétences");
    const line = skills.map((s) => s.name).filter(Boolean).join(" • ");
    if (line) textBlock(pdf, c, line);
    c.y += 2;
  }

  // Languages
  if (languages.length) {
    heading(pdf, c, "Langues");
    for (const lang of languages) {
      const line = `${lang.name || "Langue"}: ${lang.level || ""}`.trim();
      textBlock(pdf, c, line);
    }
  }

  pdf.save(withExtension(opts.filename, "pdf"));
}

export async function exportDocx(cvData: CVData, opts: ExportOptions) {
  // Dynamic import to keep bundle lighter until used
  const docx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink } = docx;

  const font =
    opts.fontFamily === "serif" ? "Times New Roman" : opts.fontFamily === "mono" ? "Courier New" : "Calibri";
  const sizeHalfPoints = Math.max(18, Math.round(opts.fontSizePt * 2));

  const { personalInfo, experiences, education, skills, languages } = cvData;

  const children: any[] = [];

  const name = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "PRÉNOM NOM";
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: name, bold: true, font, size: sizeHalfPoints + 8 })],
    })
  );

  if (personalInfo.title) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.title, font, size: sizeHalfPoints })],
        spacing: { after: 200 },
      })
    );
  }

  const contactLines: any[] = [];
  if (personalInfo.email) {
    contactLines.push(
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: `mailto:${personalInfo.email}`,
            children: [new TextRun({ text: personalInfo.email, font, size: sizeHalfPoints, underline: {} })],
          }),
        ],
      })
    );
  }
  if (personalInfo.phone) {
    contactLines.push(
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: `tel:${personalInfo.phone}`,
            children: [new TextRun({ text: personalInfo.phone, font, size: sizeHalfPoints, underline: {} })],
          }),
        ],
      })
    );
  }
  if (personalInfo.website) {
    const url = personalInfo.website.startsWith("http") ? personalInfo.website : `https://${personalInfo.website}`;
    contactLines.push(
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: url,
            children: [new TextRun({ text: personalInfo.website, font, size: sizeHalfPoints, underline: {} })],
          }),
        ],
      })
    );
  }
  if (personalInfo.linkedin) {
    const url = personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`;
    contactLines.push(
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: url,
            children: [new TextRun({ text: personalInfo.linkedin, font, size: sizeHalfPoints, underline: {} })],
          }),
        ],
      })
    );
  }
  if (personalInfo.address) {
    contactLines.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.address, font, size: sizeHalfPoints })],
      })
    );
  }
  if (contactLines.length) {
    children.push(...contactLines);
    children.push(new Paragraph({ children: [new TextRun({ text: "", font })], spacing: { after: 240 } }));
  }

  const sectionTitle = (t: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: t, bold: true, font, size: sizeHalfPoints })],
      spacing: { before: 240, after: 120 },
    });

  if (personalInfo.summary) {
    children.push(sectionTitle("Résumé"));
    children.push(new Paragraph({ children: [new TextRun({ text: personalInfo.summary, font, size: sizeHalfPoints })] }));
  }

  if (experiences.length) {
    children.push(sectionTitle("Expérience"));
    for (const exp of experiences) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.position || "Poste"} — ${exp.company || "Entreprise"}`,
              bold: true,
              font,
              size: sizeHalfPoints,
            }),
          ],
          spacing: { after: 80 },
        })
      );
      const dates = `${exp.startDate || ""}${exp.startDate || exp.endDate ? " - " : ""}${exp.current ? "Présent" : exp.endDate || ""}`.trim();
      if (dates) {
        children.push(new Paragraph({ children: [new TextRun({ text: dates, font, size: sizeHalfPoints - 2 })] }));
      }
      if (exp.description) {
        children.push(new Paragraph({ children: [new TextRun({ text: exp.description, font, size: sizeHalfPoints })] }));
      }
    }
  }

  if (education.length) {
    children.push(sectionTitle("Formation"));
    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree || "Diplôme"}${edu.field ? ` - ${edu.field}` : ""} — ${edu.school || "Établissement"}`,
              bold: true,
              font,
              size: sizeHalfPoints,
            }),
          ],
          spacing: { after: 80 },
        })
      );
      const dates = `${edu.startDate || ""}${edu.startDate || edu.endDate ? " - " : ""}${edu.endDate || ""}`.trim();
      if (dates) {
        children.push(new Paragraph({ children: [new TextRun({ text: dates, font, size: sizeHalfPoints - 2 })] }));
      }
      if (edu.description) {
        children.push(new Paragraph({ children: [new TextRun({ text: edu.description, font, size: sizeHalfPoints })] }));
      }
    }
  }

  if (skills.length) {
    children.push(sectionTitle("Compétences"));
    const line = skills.map((s) => s.name).filter(Boolean).join(" • ");
    children.push(new Paragraph({ children: [new TextRun({ text: line, font, size: sizeHalfPoints })] }));
  }

  if (languages.length) {
    children.push(sectionTitle("Langues"));
    for (const lang of languages) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${lang.name || "Langue"}: ${lang.level || ""}`.trim(), font, size: sizeHalfPoints })],
        })
      );
    }
  }

  // Margins in twips: 1 inch = 1440 twips, 1 mm = 56.6929 twips
  const mmToTwips = (mm: number) => Math.max(0, Math.round(mm * 56.6929));
  const marginTwips = mmToTwips(Math.max(0, opts.marginMm));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = withExtension(opts.filename, "docx");
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

