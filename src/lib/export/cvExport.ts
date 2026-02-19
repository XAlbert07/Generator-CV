import jsPDF from "jspdf";
import type { CVData, CVTemplate } from "@/types/cv";

export type ExportFormat = "pdf_ats" | "docx";

export type ExportOptions = {
  format: ExportFormat;
  filename: string; // without extension or with; we normalize
  marginMm: number;
  fontFamily: "sans" | "serif" | "mono";
  fontSizePt: number;
  rasterScale: number; // for visual PDF (deprecated, kept for backward compatibility)
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

type DocxTheme = {
  accent: string;
  headerFill: string;
  headerText: string;
  sidebarFill: string;
  useTwoColumns: boolean;
};

const DOCX_THEME_BY_TEMPLATE: Record<CVTemplate, DocxTheme> = {
  modern: {
    accent: "2563EB",
    headerFill: "1D4ED8",
    headerText: "FFFFFF",
    sidebarFill: "EFF6FF",
    useTwoColumns: false,
  },
  classic: {
    accent: "374151",
    headerFill: "FFFFFF",
    headerText: "111827",
    sidebarFill: "F9FAFB",
    useTwoColumns: false,
  },
  creative: {
    accent: "7C3AED",
    headerFill: "5B21B6",
    headerText: "FFFFFF",
    sidebarFill: "F3E8FF",
    useTwoColumns: true,
  },
  executive: {
    accent: "1F2937",
    headerFill: "111827",
    headerText: "FFFFFF",
    sidebarFill: "F3F4F6",
    useTwoColumns: false,
  },
  minimalist: {
    accent: "111827",
    headerFill: "FFFFFF",
    headerText: "111827",
    sidebarFill: "F9FAFB",
    useTwoColumns: false,
  },
  professional: {
    accent: "334155",
    headerFill: "334155",
    headerText: "FFFFFF",
    sidebarFill: "F1F5F9",
    useTwoColumns: true,
  },
  corporate: {
    accent: "1E3A8A",
    headerFill: "1E3A8A",
    headerText: "FFFFFF",
    sidebarFill: "EFF6FF",
    useTwoColumns: true,
  },
  elegant: {
    accent: "7C2D12",
    headerFill: "7C2D12",
    headerText: "FFFFFF",
    sidebarFill: "FFF7ED",
    useTwoColumns: false,
  },
  ats: {
    accent: "111111",
    headerFill: "111111",
    headerText: "FFFFFF",
    sidebarFill: "F4F4F5",
    useTwoColumns: false,
  },
  swiss: {
    accent: "B91C1C",
    headerFill: "18181B",
    headerText: "FFFFFF",
    sidebarFill: "F5F5F4",
    useTwoColumns: true,
  },
  editorial: {
    accent: "78716C",
    headerFill: "F5F5F4",
    headerText: "292524",
    sidebarFill: "FFFBEB",
    useTwoColumns: true,
  },
  techmono: {
    accent: "10B981",
    headerFill: "0A0A0A",
    headerText: "A7F3D0",
    sidebarFill: "18181B",
    useTwoColumns: true,
  },
};

const DOCX_FONT_BY_TEMPLATE: Record<CVTemplate, string> = {
  modern: "Calibri",
  classic: "Times New Roman",
  creative: "Calibri",
  executive: "Calibri",
  minimalist: "Calibri",
  professional: "Calibri",
  corporate: "Calibri",
  elegant: "Garamond",
  ats: "Calibri",
  swiss: "Arial",
  editorial: "Garamond",
  techmono: "Courier New",
};

const FRENCH_MONTHS_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function hasContent(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

function splitLines(value?: string) {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeUrl(value?: string) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (/^[a-z]+:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatMonthYear(value?: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year) return "";
  if (!month) return year;
  const monthIndex = Number(month) - 1;
  if (!Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex > 11) return year;
  return `${FRENCH_MONTHS_SHORT[monthIndex]} ${year}`;
}

function formatDateRange(start?: string, end?: string, current?: boolean) {
  const startLabel = formatMonthYear(start);
  const endLabel = current ? "Présent" : formatMonthYear(end);
  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  if (startLabel) return startLabel;
  if (endLabel) return endLabel;
  return "";
}

function dataUrlToBytes(dataUrl?: string) {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) return null;
  if (typeof atob !== "function") return null;
  const [, payload] = dataUrl.split(",");
  if (!payload) return null;
  try {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

export async function exportDocx(cvData: CVData, opts: ExportOptions, template: CVTemplate = "modern") {
  // Dynamic import to keep bundle lighter until used
  const docx = await import("docx");
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ExternalHyperlink,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    TableBorders,
    TableLayoutType,
    WidthType,
    BorderStyle,
    ShadingType,
    AlignmentType,
  } = docx;

  const theme = DOCX_THEME_BY_TEMPLATE[template];
  const font =
    opts.fontFamily === "serif"
      ? "Times New Roman"
      : opts.fontFamily === "mono"
        ? "Courier New"
        : DOCX_FONT_BY_TEMPLATE[template];
  const bodySize = Math.max(20, Math.round(opts.fontSizePt * 2));
  const titleSize = bodySize + 2;
  const nameSize = bodySize + 12;
  const smallSize = Math.max(16, bodySize - 2);
  const cellNoBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const { personalInfo } = cvData;
  const experiences = cvData.experiences.filter(
    (exp) =>
      hasContent(exp.company) ||
      hasContent(exp.position) ||
      hasContent(exp.description) ||
      hasContent(exp.startDate) ||
      hasContent(exp.endDate) ||
      exp.current
  );
  const education = cvData.education.filter(
    (edu) =>
      hasContent(edu.school) ||
      hasContent(edu.degree) ||
      hasContent(edu.field) ||
      hasContent(edu.description) ||
      hasContent(edu.startDate) ||
      hasContent(edu.endDate)
  );
  const skills = cvData.skills.filter((skill) => hasContent(skill.name));
  const languages = cvData.languages.filter((lang) => hasContent(lang.name));

  const createSectionTitle = (title: string) =>
    new Paragraph({
      spacing: { before: 180, after: 100 },
      border: {
        bottom: { style: BorderStyle.SINGLE, color: theme.accent, size: 8 },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          color: theme.accent,
          font,
          size: titleSize,
        }),
      ],
    });

  const createTextParagraph = (
    text: string,
    options?: {
      bold?: boolean;
      italics?: boolean;
      color?: string;
      size?: number;
      spacingAfter?: number;
      spacingBefore?: number;
      leftIndent?: number;
    }
  ) =>
    new Paragraph({
      spacing: {
        before: options?.spacingBefore ?? 0,
        after: options?.spacingAfter ?? 80,
      },
      indent: options?.leftIndent ? { left: options.leftIndent } : undefined,
      children: [
        new TextRun({
          text,
          bold: options?.bold,
          italics: options?.italics,
          color: options?.color ?? "222222",
          font,
          size: options?.size ?? bodySize,
        }),
      ],
    });

  const createContactParagraph = (
    items: Array<{ label: string; value: string; url?: string }>,
    color: string
  ) => {
    const children = [];
    items.forEach((item, index) => {
      if (index > 0) {
        children.push(new TextRun({ text: "   •   ", color, font, size: smallSize }));
      }
      const text = `${item.label}: ${item.value}`;
      if (item.url) {
        children.push(
          new ExternalHyperlink({
            link: item.url,
            children: [
              new TextRun({
                text,
                color,
                underline: {},
                font,
                size: smallSize,
              }),
            ],
          })
        );
      } else {
        children.push(
          new TextRun({
            text,
            color,
            font,
            size: smallSize,
          })
        );
      }
    });

    return new Paragraph({
      spacing: { after: 70 },
      children,
    });
  };

  const headerLeftChildren = [];
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "PRÉNOM NOM";
  headerLeftChildren.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: fullName,
          bold: true,
          color: theme.headerText,
          font,
          size: nameSize,
        }),
      ],
    })
  );

  if (hasContent(personalInfo.title)) {
    headerLeftChildren.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: personalInfo.title.trim(),
            color: theme.headerText,
            italics: template === "classic",
            font,
            size: bodySize,
          }),
        ],
      })
    );
  }

  const primaryContacts = [];
  if (hasContent(personalInfo.email)) {
    primaryContacts.push({
      label: "Email",
      value: personalInfo.email.trim(),
      url: `mailto:${personalInfo.email.trim()}`,
    });
  }
  if (hasContent(personalInfo.phone)) {
    primaryContacts.push({
      label: "Téléphone",
      value: personalInfo.phone.trim(),
      url: `tel:${personalInfo.phone.trim()}`,
    });
  }
  if (hasContent(personalInfo.address)) {
    primaryContacts.push({
      label: "Adresse",
      value: personalInfo.address.trim(),
    });
  }
  if (primaryContacts.length) {
    headerLeftChildren.push(createContactParagraph(primaryContacts, theme.headerText));
  }

  const secondaryContacts = [];
  if (hasContent(personalInfo.linkedin)) {
    secondaryContacts.push({
      label: "LinkedIn",
      value: personalInfo.linkedin.trim(),
      url: normalizeUrl(personalInfo.linkedin),
    });
  }
  if (hasContent(personalInfo.website)) {
    secondaryContacts.push({
      label: "Site",
      value: personalInfo.website.trim(),
      url: normalizeUrl(personalInfo.website),
    });
  }
  if (secondaryContacts.length) {
    headerLeftChildren.push(createContactParagraph(secondaryContacts, theme.headerText));
  }

  const headerCells = [
    new TableCell({
      width: {
        size: hasContent(personalInfo.photo || "") ? 78 : 100,
        type: WidthType.PERCENTAGE,
      },
      shading: { type: ShadingType.CLEAR, fill: theme.headerFill },
      margins: { top: 240, bottom: 220, left: 240, right: 180 },
      borders: cellNoBorder,
      children: headerLeftChildren,
    }),
  ];

  const photoBytes = dataUrlToBytes(personalInfo.photo || "");
  if (photoBytes) {
    headerCells.push(
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: theme.headerFill },
        margins: { top: 220, bottom: 220, left: 120, right: 180 },
        borders: cellNoBorder,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: photoBytes,
                transformation: { width: 95, height: 95 },
              }),
            ],
          }),
        ],
      })
    );
  }

  const children = [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: TableBorders.NONE,
      rows: [new TableRow({ children: headerCells })],
    }),
  ];

  const mainContentChildren = [];
  const sidebarChildren = [];

  if (hasContent(personalInfo.summary)) {
    mainContentChildren.push(createSectionTitle("Résumé professionnel"));
    const summaryLines = splitLines(personalInfo.summary);
    summaryLines.forEach((line, lineIndex) => {
      mainContentChildren.push(
        createTextParagraph(line, {
          spacingAfter: lineIndex === summaryLines.length - 1 ? 120 : 50,
        })
      );
    });
  }

  if (experiences.length) {
    mainContentChildren.push(createSectionTitle("Expérience professionnelle"));
    experiences.forEach((exp) => {
      const role = hasContent(exp.position) ? exp.position.trim() : "Poste";
      const company = hasContent(exp.company) ? exp.company.trim() : "Entreprise";
      mainContentChildren.push(
        createTextParagraph(`${role} - ${company}`, {
          bold: true,
          color: "111827",
          spacingAfter: 30,
        })
      );

      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current);
      if (dateRange) {
        mainContentChildren.push(
          createTextParagraph(dateRange, {
            italics: true,
            color: "6B7280",
            size: smallSize,
            spacingAfter: 40,
          })
        );
      }

      if (hasContent(exp.description)) {
        const descriptionLines = splitLines(exp.description);
        descriptionLines.forEach((line, lineIndex) => {
          mainContentChildren.push(
            createTextParagraph(line, {
              spacingAfter: lineIndex === descriptionLines.length - 1 ? 90 : 30,
              leftIndent: 140,
            })
          );
        });
      }
      mainContentChildren.push(createTextParagraph("", { spacingAfter: 20, size: smallSize }));
    });
  }

  if (education.length) {
    mainContentChildren.push(createSectionTitle("Formation"));
    education.forEach((edu) => {
      const degreePart = hasContent(edu.degree) ? edu.degree.trim() : "Diplôme";
      const fieldPart = hasContent(edu.field) ? ` - ${edu.field.trim()}` : "";
      const schoolPart = hasContent(edu.school) ? edu.school.trim() : "Établissement";
      mainContentChildren.push(
        createTextParagraph(`${degreePart}${fieldPart} - ${schoolPart}`, {
          bold: true,
          color: "111827",
          spacingAfter: 30,
        })
      );

      const dateRange = formatDateRange(edu.startDate, edu.endDate, false);
      if (dateRange) {
        mainContentChildren.push(
          createTextParagraph(dateRange, {
            italics: true,
            color: "6B7280",
            size: smallSize,
            spacingAfter: 40,
          })
        );
      }

      if (hasContent(edu.description)) {
        const descriptionLines = splitLines(edu.description);
        descriptionLines.forEach((line, lineIndex) => {
          mainContentChildren.push(
            createTextParagraph(line, {
              spacingAfter: lineIndex === descriptionLines.length - 1 ? 90 : 30,
              leftIndent: 140,
            })
          );
        });
      }
      mainContentChildren.push(createTextParagraph("", { spacingAfter: 20, size: smallSize }));
    });
  }

  if (skills.length) {
    sidebarChildren.push(createSectionTitle("Compétences"));
    skills.forEach((skill) => {
      sidebarChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 45 },
          children: [
            new TextRun({
              text: skill.name.trim(),
              font,
              size: bodySize,
              color: "1F2937",
            }),
          ],
        })
      );
    });
  }

  if (languages.length) {
    sidebarChildren.push(createSectionTitle("Langues"));
    languages.forEach((language) => {
      sidebarChildren.push(
        createTextParagraph(`${language.name.trim()}${hasContent(language.level) ? ` - ${language.level.trim()}` : ""}`, {
          spacingAfter: 45,
        })
      );
    });
  }

  if (!mainContentChildren.length && !sidebarChildren.length) {
    mainContentChildren.push(
      createTextParagraph("Ajoutez du contenu dans le formulaire pour générer un CV complet.", {
        color: "6B7280",
        spacingAfter: 0,
      })
    );
  }

  if (theme.useTwoColumns) {
    if (!sidebarChildren.length) {
      sidebarChildren.push(
        createTextParagraph("Ajoutez des compétences ou des langues pour enrichir cette colonne.", {
          color: "6B7280",
          spacingAfter: 0,
          size: smallSize,
        })
      );
    }
    if (!mainContentChildren.length) {
      mainContentChildren.push(createTextParagraph("", { spacingAfter: 0 }));
    }

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: TableBorders.NONE,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 32, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: theme.sidebarFill },
                margins: { top: 150, bottom: 120, left: 180, right: 120 },
                borders: cellNoBorder,
                children: sidebarChildren,
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                margins: { top: 150, bottom: 120, left: 180, right: 120 },
                borders: cellNoBorder,
                children: mainContentChildren,
              }),
            ],
          }),
        ],
      })
    );
  } else {
    children.push(...mainContentChildren, ...sidebarChildren);
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
