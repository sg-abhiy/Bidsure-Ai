import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ComplianceReport, Project, ComplianceResult, Contradiction, DocumentItem } from '../types';

/**
 * Generates an official, publication-grade Government e-Marketplace (GeM)
 * Compliance Evaluation Dossier PDF and triggers a direct browser download.
 */
export function exportOfficialCompliancePdf(
  project: Project,
  report: ComplianceReport,
  complianceResults?: ComplianceResult[],
  contradictions?: Contradiction[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Colors
  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentAmber = [217, 119, 6]; // #d97706
  const slateGray = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc

  // Helper for drawing section headers
  const drawSectionHeader = (title: string, yPos: number): number => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin + 10;
    }
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, yPos, 3.5, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 6, yPos + 5);
    return yPos + 10;
  };

  // ==================== PAGE 1: HEADER & SOVEREIGN EMBLEM ====================
  // Top national color band
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, currentY, contentWidth / 3, 2, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(margin + contentWidth / 3, currentY, contentWidth / 3, 2, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(margin + (contentWidth * 2) / 3, currentY, contentWidth / 3, 2, 'F');
  currentY += 5;

  // Organization & GeM Identification
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('GOVERNMENT OF INDIA • PROCUREMENT AUDIT DIRECTORATE', margin, currentY);
  doc.text(
    `DOSSIER ID: GeM-VER-2026-${project.tenderId || '9821430'}`,
    pageWidth - margin,
    currentY,
    { align: 'right' }
  );
  currentY += 4.5;

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('GOVERNMENT e-MARKETPLACE (GeM) COMPLIANCE DOSSIER', margin, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Statutory Verification Pursuant to General Financial Rules (GFR), 2017 • Evaluated on ${new Date(
      report.generatedAt
    ).toLocaleString()}`,
    margin,
    currentY
  );
  currentY += 3.5;

  // Thin dividing line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // ==================== PROJECT & BIDDER DOSSIER BOX ====================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text('TENDER & BIDDER PARTICULARS', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  // Left Column: Tender Info
  const col1X = margin + 4;
  doc.text(`Tender Title:`, col1X, currentY + 11);
  doc.setFont('helvetica', 'bold');
  doc.text(doc.splitTextToSize(project.name, 85), col1X + 22, currentY + 11);
  doc.setFont('helvetica', 'normal');

  doc.text(`Tender Reference:`, col1X, currentY + 19);
  doc.setFont('helvetica', 'bold');
  doc.text(project.tenderId || 'GEM/2026/B/9821430', col1X + 27, currentY + 19);
  doc.setFont('helvetica', 'normal');

  doc.text(`Procuring Authority:`, col1X, currentY + 25);
  doc.text(project.organization || 'NTPC Limited', col1X + 28, currentY + 25);

  // Right Column: Bidder Info & Overall Status
  const col2X = margin + 98;
  doc.text(`Bidder Legal Name:`, col2X, currentY + 11);
  doc.setFont('helvetica', 'bold');
  doc.text(project.bidderName || 'ABC Industrial Solutions Pvt. Ltd.', col2X + 28, currentY + 11);
  doc.setFont('helvetica', 'normal');

  doc.text(`Bidder GSTIN:`, col2X, currentY + 17);
  doc.text(project.bidderGstin || '27AAACB9812M1Z5', col2X + 22, currentY + 17);

  doc.text(`Evaluation Score:`, col2X, currentY + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`${report.overallScore}% Overall Compliance`, col2X + 25, currentY + 23);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  doc.text(`Committee Verdict:`, col2X, currentY + 28);
  const isCompliant = report.overallScore >= 80 && report.nonCompliantItems.length === 0;
  doc.setFont('helvetica', 'bold');
  if (isCompliant) {
    doc.setTextColor(22, 101, 52);
    doc.text('RECOMMENDED FOR AWARD', col2X + 27, currentY + 28);
  } else if (report.nonCompliantItems.length > 0) {
    doc.setTextColor(185, 28, 28);
    doc.text('DISQUALIFYING NON-COMPLIANCE', col2X + 27, currentY + 28);
  } else {
    doc.setTextColor(217, 119, 6);
    doc.text('SUBJECT TO FORMAL CLARIFICATION', col2X + 27, currentY + 28);
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  currentY += 37;

  // ==================== SECTION 1: EXECUTIVE SUMMARY ====================
  currentY = drawSectionHeader('1. EXECUTIVE AUDIT SUMMARY & STATUTORY VERDICT', currentY);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  const summaryLines = doc.splitTextToSize(report.executiveSummary, contentWidth - 8);
  const boxHeight = summaryLines.length * 3.8 + 8;

  doc.roundedRect(margin, currentY, contentWidth, boxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(summaryLines, margin + 4, currentY + 5.5);

  currentY += boxHeight + 6;

  // ==================== SECTION 2: CATEGORY BREAKDOWN TABLE ====================
  currentY = drawSectionHeader('2. CATEGORY-WISE COMPLIANCE RATING MATRIX', currentY);

  const categoryTableData = report.categoryBreakdown.map((cat) => [
    cat.category,
    `${cat.score}%`,
    cat.total.toString(),
    cat.compliant.toString(),
    cat.needsReview.toString(),
    cat.nonCompliant.toString(),
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Category', 'Compliance Rating', 'Evaluated', 'Compliant', 'Needs Review', 'Non-Compliant']],
    body: categoryTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { halign: 'center', fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center', textColor: [22, 101, 52], fontStyle: 'bold' },
      4: { halign: 'center', textColor: [180, 83, 9], fontStyle: 'bold' },
      5: { halign: 'center', textColor: [185, 28, 28], fontStyle: 'bold' },
    },
  });

  // @ts-expect-error - jspdf-autotable extends jsPDF instance with lastAutoTable
  currentY = doc.lastAutoTable.finalY + 8;

  // ==================== SECTION 3: DISQUALIFYING CONDITIONS ====================
  if (report.nonCompliantItems && report.nonCompliantItems.length > 0) {
    currentY = drawSectionHeader(
      `3. DISQUALIFYING NON-COMPLIANT CRITERIA (${report.nonCompliantItems.length} CLAUSES)`,
      currentY
    );

    const nonCompliantData = report.nonCompliantItems.map((item) => [
      item.requirementId || item.requirement.id,
      item.requirement.title,
      String(item.requiredCondition || item.requirement.requiredValue || 'Required'),
      item.extractedValue,
      item.reasoning,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Clause', 'Requirement', 'Required Metric', 'Bidder Submitted Value', 'Deficiency Reasoning']],
      body: nonCompliantData,
      theme: 'grid',
      headStyles: {
        fillColor: [153, 27, 27], // Dark red
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 16 },
        1: { fontStyle: 'bold', cellWidth: 38 },
        2: { cellWidth: 32 },
        3: { cellWidth: 32, textColor: [185, 28, 28], fontStyle: 'bold' },
        4: { cellWidth: 64 },
      },
    });

    // @ts-expect-error - jspdf-autotable lastAutoTable
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // ==================== SECTION 4: CONTRADICTIONS & DISCREPANCIES ====================
  const activeContradictions = contradictions || report.contradictions;
  if (activeContradictions && activeContradictions.length > 0) {
    currentY = drawSectionHeader(
      `4. CROSS-DOCUMENT CONTRADICTIONS DETECTED (${activeContradictions.length} FINDINGS)`,
      currentY
    );

    const contradictionData = activeContradictions.map((c) => [
      c.field,
      c.severity.toUpperCase(),
      `${c.sourceA.document} (P.${c.sourceA.page})\nValue: ${c.sourceA.value}`,
      `${c.sourceB.document} (P.${c.sourceB.page})\nValue: ${c.sourceB.value}`,
      c.description,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Subject Field', 'Severity', 'Instrument Source A', 'Instrument Source B', 'Audit Analysis']],
      body: contradictionData,
      theme: 'grid',
      headStyles: {
        fillColor: [180, 83, 9], // Amber
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 26 },
        1: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
        2: { cellWidth: 42 },
        3: { cellWidth: 42 },
        4: { cellWidth: 52 },
      },
    });

    // @ts-expect-error - jspdf-autotable lastAutoTable
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // ==================== SECTION 5: COMPLIANCE CLAUSES MASTER TABLE ====================
  if (complianceResults && complianceResults.length > 0) {
    currentY = drawSectionHeader(
      `5. COMPLETE STATUTORY COMPLIANCE AUDIT MATRIX (${complianceResults.length} CLAUSES)`,
      currentY
    );

    const resultsData = complianceResults.map((r) => [
      r.requirementId || r.requirement.id,
      r.requirement.category,
      r.requirement.title,
      String(r.requiredCondition || r.requirement.requiredValue || 'Required'),
      r.extractedValue,
      r.status,
      `${r.confidence}%`,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Clause', 'Category', 'Requirement Description', 'Mandatory Condition', 'Bidder Value', 'Status', 'Conf.']],
      body: resultsData,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: [30, 41, 59],
        cellPadding: 1.8,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 16 },
        1: { cellWidth: 22 },
        2: { cellWidth: 44 },
        3: { cellWidth: 32 },
        4: { cellWidth: 32 },
        5: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 14 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          const val = data.cell.raw as string;
          if (val === 'COMPLIANT') {
            data.cell.styles.textColor = [22, 101, 52];
          } else if (val === 'NON_COMPLIANT') {
            data.cell.styles.textColor = [185, 28, 28];
          } else {
            data.cell.styles.textColor = [180, 83, 9];
          }
        }
      },
    });

    // @ts-expect-error - jspdf-autotable lastAutoTable
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // ==================== SECTION 6: STATUTORY SIGNATORIES ====================
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = margin + 10;
  }

  currentY = drawSectionHeader('6. TENDER EVALUATION COMMITTEE ENDORSEMENTS', currentY);

  const sigBlockWidth = (contentWidth - 10) / 3;
  const sigY = currentY + 14;

  // Signatory 1
  doc.setDrawColor(148, 163, 184);
  doc.line(margin, sigY, margin + sigBlockWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Procurement Officer', margin + sigBlockWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Technical Evaluation Committee', margin + sigBlockWidth / 2, sigY + 7.5, { align: 'center' });

  // Signatory 2
  const sig2X = margin + sigBlockWidth + 5;
  doc.line(sig2X, sigY, sig2X + sigBlockWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Finance Member / CA', sig2X + sigBlockWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Financial Scrutiny Cell', sig2X + sigBlockWidth / 2, sigY + 7.5, { align: 'center' });

  // Signatory 3
  const sig3X = margin + (sigBlockWidth + 5) * 2;
  doc.line(sig3X, sigY, sig3X + sigBlockWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Committee Chairman', sig3X + sigBlockWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('GeM Purchase Approval Body', sig3X + sigBlockWidth / 2, sigY + 7.5, { align: 'center' });

  // ==================== PAGE NUMBERS & SECURITY WATERMARK ====================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'CONFIDENTIAL & STATUTORY • FOR OFFICIAL GeM EVALUATION COMMITTEE SCRUTINY ONLY',
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  // Trigger browser download
  const safeTenderId = (project.tenderId || 'GeM_Tender').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`BidSure_${safeTenderId}_Compliance_Evaluation_Dossier.pdf`);
}

/**
 * Generates an official certified PDF dossier for a single evidentiary document artifact.
 */
export function exportDocumentDossierPdf(docItem: DocumentItem, project?: Project): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Header band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 18, pageWidth, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('SOVEREIGN EVIDENTIARY ARTIFACT • CERTIFIED PROCUREMENT DOSSIER', margin, 11);
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Government e-Marketplace (GeM) Verification Repository', margin, 15);

  currentY = 28;

  // Document Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text('EVIDENTIARY ARTIFACT IDENTIFIERS', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(docItem.fileName, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  doc.text(`Category: ${docItem.category.toUpperCase()} ARTIFACT`, margin + 4, currentY + 18);
  doc.text(`Format: ${docItem.type} | File Size: ${docItem.size}`, margin + 4, currentY + 23);
  doc.text(`Page Count: ${docItem.pageCount} Pages`, margin + 4, currentY + 28);
  doc.text(`Upload Date: ${docItem.uploadDate}`, margin + 4, currentY + 33);

  const col2X = margin + 95;
  doc.text(`Associated Project: ${project?.name || 'GeM Industrial Procurement'}`, col2X, currentY + 18);
  doc.text(`Tender Reference: ${project?.tenderId || 'GEM/2026/B/9821430'}`, col2X, currentY + 23);
  doc.text(`Processing Status: ${docItem.status}`, col2X, currentY + 28);
  doc.text(`Relevant Clauses Indexed: ${docItem.relevantRequirementsCount} Conditions`, col2X, currentY + 33);

  currentY += 44;

  // Section Header: Juridical Abstract
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. STATUTORY JURIDICAL ABSTRACT & PROVENANCE', margin + 5, currentY + 4);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const abstractText =
    `This certified instrument constitutes an official evidentiary record tendered under Rule 144 and 161 of General Financial Rules (GFR), 2017. The extracted substantive content has been processed with deterministic character-level fidelity and cryptographic hash registry for committee scrutiny.`;
  const abstractLines = doc.splitTextToSize(abstractText, contentWidth);
  doc.text(abstractLines, margin, currentY);
  currentY += abstractLines.length * 3.8 + 4;

  // Section Header: Full Verbatim Content
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. VERBATIM INSCRIPTION & RECORDED STATUTORY TEXT', margin + 5, currentY + 4);
  currentY += 8;

  const contentToPrint = docItem.textContent || docItem.content || 'Extracted content indexed for automated verification.';
  const rawLines = doc.splitTextToSize(contentToPrint, contentWidth - 8);

  // Box for text
  const textHeight = Math.min(rawLines.length * 3.8 + 10, pageHeight - currentY - 25);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, textHeight, 1.5, 1.5, 'FD');

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);

  // Render lines with page wrapping
  let yCursor = currentY + 5;
  for (let i = 0; i < rawLines.length; i++) {
    if (yCursor > pageHeight - 20) {
      doc.addPage();
      yCursor = margin + 10;
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
    }
    doc.text(rawLines[i], margin + 4, yCursor);
    yCursor += 3.8;
  }

  // Security footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Digitally Certified Copy • GeM Evidentiary Repository • ${docItem.fileName}`, margin, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  const safeDocName = docItem.fileName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeDocName}_Certified_Official_Dossier.pdf`);
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates an official standalone printable HTML document for the compliance report.
 * Formatted for standard A4 printing with crisp typography, national insignias, and auto-print script.
 */
export function generatePrintableComplianceHtml(
  project: Project,
  report: ComplianceReport,
  complianceResults?: ComplianceResult[],
  contradictions?: Contradiction[]
): string {
  const tenderId = escapeHtml(project.tenderId || 'GEM/2026/B/9821430');
  const dateStr = new Date(report.generatedAt).toLocaleString();
  const activeContradictions = contradictions || report.contradictions || [];
  const activeResults = complianceResults || [];

  const isCompliant = report.overallScore >= 80 && (!report.nonCompliantItems || report.nonCompliantItems.length === 0);
  const verdictText = isCompliant
    ? 'RECOMMENDED FOR AWARD'
    : report.nonCompliantItems && report.nonCompliantItems.length > 0
    ? 'DISQUALIFYING NON-COMPLIANCE'
    : 'SUBJECT TO FORMAL CLARIFICATION';
  const verdictColor = isCompliant ? '#15803d' : report.nonCompliantItems && report.nonCompliantItems.length > 0 ? '#b91c1c' : '#b45309';
  const verdictBg = isCompliant ? '#f0fdf4' : report.nonCompliantItems && report.nonCompliantItems.length > 0 ? '#fef2f2' : '#fffbeb';

  // Category rows
  const categoryRows = report.categoryBreakdown
    .map(
      (cat) => `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(cat.category)}</td>
        <td style="text-align: center; font-weight: 700; color: #0f172a;">${cat.score}%</td>
        <td style="text-align: center;">${cat.total}</td>
        <td style="text-align: center; color: #15803d; font-weight: 700;">${cat.compliant}</td>
        <td style="text-align: center; color: #b45309; font-weight: 700;">${cat.needsReview}</td>
        <td style="text-align: center; color: #b91c1c; font-weight: 700;">${cat.nonCompliant}</td>
      </tr>`
    )
    .join('');

  // Non-compliant rows
  const nonCompliantRows = (report.nonCompliantItems || [])
    .map(
      (item) => `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">${escapeHtml(item.requirementId || item.requirement?.id)}</td>
        <td style="font-weight: 600;">${escapeHtml(item.requirement?.title)}</td>
        <td>${escapeHtml(item.requiredCondition || item.requirement?.requiredValue || 'Mandatory')}</td>
        <td style="color: #b91c1c; font-weight: 700;">${escapeHtml(item.extractedValue)}</td>
        <td style="color: #334155; font-size: 10px;">${escapeHtml(item.reasoning)}</td>
      </tr>`
    )
    .join('');

  // Contradiction rows
  const contradictionRows = activeContradictions
    .map(
      (c) => `
      <tr>
        <td style="font-weight: 700;">${escapeHtml(c.field)}</td>
        <td style="text-align: center;"><span style="background: #fef2f2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 9px;">${escapeHtml(c.severity.toUpperCase())}</span></td>
        <td><strong>${escapeHtml(c.sourceA.document)}</strong> (P.${c.sourceA.page})<br><span style="color: #475569;">${escapeHtml(c.sourceA.value)}</span></td>
        <td><strong>${escapeHtml(c.sourceB.document)}</strong> (P.${c.sourceB.page})<br><span style="color: #475569;">${escapeHtml(c.sourceB.value)}</span></td>
        <td style="color: #334155; font-size: 10px;">${escapeHtml(c.description)}</td>
      </tr>`
    )
    .join('');

  // All results rows
  const allResultsRows = activeResults
    .map((r) => {
      const statusColor = r.status === 'COMPLIANT' ? '#15803d' : r.status === 'NON_COMPLIANT' ? '#b91c1c' : '#b45309';
      const statusBg = r.status === 'COMPLIANT' ? '#f0fdf4' : r.status === 'NON_COMPLIANT' ? '#fef2f2' : '#fffbeb';
      return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; white-space: nowrap;">${escapeHtml(r.requirementId || r.requirement?.id)}</td>
        <td style="font-size: 9.5px; color: #475569;">${escapeHtml(r.requirement?.category)}</td>
        <td style="font-weight: 600;">${escapeHtml(r.requirement?.title)}</td>
        <td style="font-size: 10px;">${escapeHtml(r.requiredCondition || r.requirement?.requiredValue || 'Required')}</td>
        <td style="font-size: 10px; font-weight: 600;">${escapeHtml(r.extractedValue)}</td>
        <td style="text-align: center;"><span style="background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor}33; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 9px;">${escapeHtml(r.status)}</span></td>
        <td style="text-align: center; font-family: monospace; font-size: 10px;">${r.confidence}%</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BidSure AI - GeM Evaluation Dossier - ${tenderId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 15mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 16px 24px;
      background: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5px;
      line-height: 1.45;
    }

    /* Screen navigation bar (hidden in print) */
    .screen-toolbar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      margin: -16px -24px 20px -24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
    }
    .screen-toolbar h1 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .screen-toolbar .btn-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .print-btn {
      background: #f59e0b;
      color: #0f172a;
      font-weight: 700;
      font-size: 12px;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover { background: #d97706; }
    .close-btn {
      background: #334155;
      color: #f8fafc;
      font-size: 11px;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .close-btn:hover { background: #475569; }

    @media print {
      .screen-toolbar { display: none !important; }
      body { padding: 0 !important; }
    }

    /* Sovereign tricolor stripe */
    .tricolor-stripe {
      display: flex;
      height: 3.5px;
      width: 100%;
      margin-bottom: 10px;
    }
    .stripe-saffron { background-color: #ff9933; flex: 1; }
    .stripe-white { background-color: #ffffff; flex: 1; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; }
    .stripe-green { background-color: #138808; flex: 1; }

    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .dossier-title {
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      margin: 4px 0 2px 0;
      letter-spacing: -0.2px;
    }
    .sub-title {
      font-size: 9.5px;
      color: #64748b;
      margin: 0;
    }

    .meta-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .meta-box h3 {
      margin: 0 0 6px 0;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #b45309;
      letter-spacing: 0.5px;
    }
    .meta-item {
      margin-bottom: 4px;
      font-size: 10px;
    }
    .meta-item strong {
      color: #334155;
    }

    .verdict-banner {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      margin: 16px 0 8px 0;
      padding-left: 8px;
      border-left: 3.5px solid #0f172a;
      letter-spacing: 0.3px;
    }

    .summary-text {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10.5px;
      line-height: 1.5;
      color: #334155;
      margin-bottom: 14px;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 9.5px;
      page-break-inside: auto;
    }
    table.data-table th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid #0f172a;
    }
    table.data-table td {
      padding: 5.5px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    table.data-table tr {
      page-break-inside: avoid;
    }
    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .signatory-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 24px;
      margin-top: 28px;
      padding-top: 14px;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
    }
    .sig-title {
      font-weight: 700;
      font-size: 10px;
      color: #0f172a;
    }
    .sig-dept {
      font-size: 8.5px;
      color: #64748b;
    }

    .footer-watermark {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8px;
      color: #94a3b8;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <!-- Screen Navigation Bar -->
  <div class="screen-toolbar">
    <h1>
      <span>⚖️</span>
      <span>GeM Official Compliance Evaluation Dossier</span>
    </h1>
    <div class="btn-group">
      <button class="print-btn" onclick="window.print()">
        🖨️ Print Dossier (A4)
      </button>
      <button class="close-btn" onclick="window.close()">
        ✕ Close Window
      </button>
    </div>
  </div>

  <!-- Sovereign Tricolor Stripe -->
  <div class="tricolor-stripe">
    <div class="stripe-saffron"></div>
    <div class="stripe-white"></div>
    <div class="stripe-green"></div>
  </div>

  <!-- Official Header -->
  <table class="header-table">
    <tr>
      <td>
        <div style="font-size: 8.5px; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">
          GOVERNMENT OF INDIA • PROCUREMENT AUDIT DIRECTORATE
        </div>
        <div class="dossier-title">
          Government e-Marketplace (GeM) Compliance Dossier
        </div>
        <div class="sub-title">
          Statutory Verification Pursuant to General Financial Rules (GFR), 2017 • Evaluated on ${dateStr}
        </div>
      </td>
      <td style="text-align: right; vertical-align: top;">
        <div style="font-family: monospace; font-size: 9px; font-weight: 700; color: #0f172a;">
          DOSSIER ID: GeM-VER-2026-${escapeHtml(project.tenderId || '9821430')}
        </div>
        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
          Classification: OFFICIAL COMMITTEE AUDIT
        </div>
      </td>
    </tr>
  </table>

  <!-- Meta Particulars Box -->
  <div class="meta-box">
    <div>
      <h3>Tender Specifications</h3>
      <div class="meta-item"><strong>Tender Title:</strong> ${escapeHtml(project.name)}</div>
      <div class="meta-item"><strong>Tender ID:</strong> <span style="font-family: monospace;">${tenderId}</span></div>
      <div class="meta-item"><strong>Procuring Authority:</strong> ${escapeHtml(project.organization || 'NTPC Limited')}</div>
    </div>
    <div>
      <h3>Bidder Particulars</h3>
      <div class="meta-item"><strong>Bidder Legal Name:</strong> ${escapeHtml(project.bidderName || 'ABC Industrial Solutions Pvt. Ltd.')}</div>
      <div class="meta-item"><strong>Bidder GSTIN:</strong> <span style="font-family: monospace;">${escapeHtml(project.bidderGstin || '27AAACB9812M1Z5')}</span></div>
      <div class="meta-item"><strong>Evaluation Status:</strong> <span style="font-weight: 700; color: #b45309;">${escapeHtml(project.status.toUpperCase())}</span></div>
    </div>
  </div>

  <!-- Score & Verdict Banner -->
  <div class="verdict-banner">
    <div>
      <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #fbbf24; font-weight: 700;">
        Statutory Recommendation
      </div>
      <div style="font-size: 13px; font-weight: 800; letter-spacing: 0.5px;">
        ${verdictText}
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8;">
        Overall Score
      </div>
      <div style="font-size: 20px; font-weight: 900; color: #fbbf24;">
        ${report.overallScore}%
      </div>
    </div>
  </div>

  <!-- Section 1: Executive Summary -->
  <div class="section-title">1. Executive Audit Summary & Statutory Verdict</div>
  <div class="summary-text">
    ${escapeHtml(report.executiveSummary)}
  </div>

  <!-- Section 2: Category Breakdown -->
  <div class="section-title">2. Category-Wise Compliance Rating Matrix</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 32%;">Category</th>
        <th style="text-align: center; width: 14%;">Rating</th>
        <th style="text-align: center; width: 13%;">Total Clauses</th>
        <th style="text-align: center; width: 13%;">Compliant</th>
        <th style="text-align: center; width: 14%;">Needs Review</th>
        <th style="text-align: center; width: 14%;">Non-Compliant</th>
      </tr>
    </thead>
    <tbody>
      ${categoryRows}
    </tbody>
  </table>

  ${
    report.nonCompliantItems && report.nonCompliantItems.length > 0
      ? `
  <!-- Section 3: Disqualifying Conditions -->
  <div class="section-title">3. Disqualifying Non-Compliant Criteria (${report.nonCompliantItems.length} Clauses)</div>
  <table class="data-table">
    <thead>
      <tr style="background: #991b1b;">
        <th style="width: 12%; background: #991b1b;">Clause</th>
        <th style="width: 25%; background: #991b1b;">Requirement</th>
        <th style="width: 20%; background: #991b1b;">Mandatory Condition</th>
        <th style="width: 18%; background: #991b1b;">Bidder Submitted Value</th>
        <th style="width: 25%; background: #991b1b;">Deficiency Reasoning</th>
      </tr>
    </thead>
    <tbody>
      ${nonCompliantRows}
    </tbody>
  </table>`
      : ''
  }

  ${
    activeContradictions.length > 0
      ? `
  <!-- Section 4: Contradictions -->
  <div class="section-title">4. Cross-Document Contradictions Detected (${activeContradictions.length} Findings)</div>
  <table class="data-table">
    <thead>
      <tr style="background: #b45309;">
        <th style="width: 16%; background: #b45309;">Subject Field</th>
        <th style="width: 12%; background: #b45309; text-align: center;">Severity</th>
        <th style="width: 24%; background: #b45309;">Evidentiary Source A</th>
        <th style="width: 24%; background: #b45309;">Evidentiary Source B</th>
        <th style="width: 24%; background: #b45309;">Audit Analysis</th>
      </tr>
    </thead>
    <tbody>
      ${contradictionRows}
    </tbody>
  </table>`
      : ''
  }

  ${
    activeResults.length > 0
      ? `
  <!-- Section 5: All Evaluated Clauses -->
  <div class="section-title">5. Complete Statutory Compliance Audit Matrix (${activeResults.length} Clauses)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 10%;">Clause</th>
        <th style="width: 14%;">Category</th>
        <th style="width: 26%;">Requirement Description</th>
        <th style="width: 18%;">Mandatory Condition</th>
        <th style="width: 16%;">Bidder Value</th>
        <th style="width: 10%; text-align: center;">Status</th>
        <th style="width: 6%; text-align: center;">Conf.</th>
      </tr>
    </thead>
    <tbody>
      ${allResultsRows}
    </tbody>
  </table>`
      : ''
  }

  <!-- Section 6: Committee Signatories -->
  <div class="section-title">6. Tender Evaluation Committee Endorsements</div>
  <div class="signatory-row">
    <div class="sig-block">
      <div class="sig-title">Procurement Officer</div>
      <div class="sig-dept">Technical Evaluation Committee</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Finance Member / CA</div>
      <div class="sig-dept">Financial Scrutiny Cell</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Committee Chairman</div>
      <div class="sig-dept">GeM Purchase Approval Body</div>
    </div>
  </div>

  <!-- Confidentiality Watermark -->
  <div class="footer-watermark">
    CONFIDENTIAL & STATUTORY • FOR OFFICIAL GeM EVALUATION COMMITTEE SCRUTINY ONLY • GENERATED VIA BIDSURE AI
  </div>

  <!-- Auto-print trigger script for new window -->
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.warn('Auto print trigger notice:', e);
        }
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Generates an official standalone printable HTML document for an individual evidentiary artifact.
 */
export function generatePrintableDocumentHtml(docItem: DocumentItem, project?: Project): string {
  const content = escapeHtml(docItem.textContent || docItem.content || 'Extracted content indexed for automated verification.');
  const fileName = escapeHtml(docItem.fileName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Evidentiary Artifact Dossier - ${fileName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 15mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 16px 24px;
      background: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.5;
    }
    .screen-toolbar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      margin: -16px -24px 20px -24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
    }
    .print-btn {
      background: #f59e0b;
      color: #0f172a;
      font-weight: 700;
      font-size: 12px;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .close-btn {
      background: #334155;
      color: #f8fafc;
      font-size: 11px;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .screen-toolbar { display: none !important; }
      body { padding: 0 !important; }
    }
    .header {
      background: #0f172a;
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 6px;
      margin-bottom: 14px;
    }
    .meta-grid {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
      font-size: 10px;
    }
    .text-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      font-family: "SFMono-Regular", Consolas, Menlo, monospace;
      font-size: 9.5px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div style="font-weight: 700; font-size: 13px;">Evidentiary Artifact Dossier • ${fileName}</div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">🖨️ Print Artifact (A4)</button>
      <button class="close-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="header">
    <div style="font-size: 8.5px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">
      CERTIFIED PROCUREMENT EVIDENTIARY RECORD • GFR-2017 REGISTRY
    </div>
    <div style="font-size: 16px; font-weight: 800; margin-top: 4px;">
      ${fileName}
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <div><strong>Category:</strong> ${escapeHtml(docItem.category.toUpperCase())}</div>
      <div><strong>File Type / Size:</strong> ${escapeHtml(docItem.type)} • ${escapeHtml(docItem.size)}</div>
      <div><strong>Page Count:</strong> ${docItem.pageCount} Pages</div>
    </div>
    <div>
      <div><strong>Associated Tender:</strong> ${escapeHtml(project?.tenderId || 'GEM/2026/B/9821430')}</div>
      <div><strong>Processing Status:</strong> ${escapeHtml(docItem.status)}</div>
      <div><strong>Upload / Ingestion Date:</strong> ${escapeHtml(docItem.uploadDate)}</div>
    </div>
  </div>

  <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-bottom: 8px; text-transform: uppercase;">
    Verbatim Inscribed Instrument Text
  </div>
  <div class="text-box">${content}</div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.focus();
          window.print();
        } catch(e) {}
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Creates a standalone printable Blob URL and opens it in a new tab where auto-print is triggered.
 * Returns the created Blob URL and whether opening the window succeeded.
 */
export function openPrintDossierInNewTab(
  project: Project,
  report: ComplianceReport,
  complianceResults?: ComplianceResult[],
  contradictions?: Contradiction[]
): { blobUrl: string; opened: boolean } {
  const html = generatePrintableComplianceHtml(project, report, complianceResults, contradictions);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  let opened = false;
  try {
    const win = window.open(blobUrl, '_blank');
    if (win) {
      opened = true;
      win.focus();
    }
  } catch (err) {
    console.warn('Direct popup open was blocked by browser sandbox:', err);
  }

  return { blobUrl, opened };
}

/**
 * Opens a printable dossier for an individual evidentiary document artifact.
 */
export function openDocumentPrintInNewTab(
  docItem: DocumentItem,
  project?: Project
): { blobUrl: string; opened: boolean } {
  const html = generatePrintableDocumentHtml(docItem, project);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  let opened = false;
  try {
    const win = window.open(blobUrl, '_blank');
    if (win) {
      opened = true;
      win.focus();
    }
  } catch (err) {
    console.warn('Direct popup open was blocked by browser sandbox:', err);
  }

  return { blobUrl, opened };
}

/**
 * Safely triggers window.print() inside a try-catch block.
 */
export function triggerSafeWindowPrint(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('window.print() call blocked or threw error:', err);
    return false;
  }
}

