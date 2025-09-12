import jsPDF from 'jspdf';

export interface CertificateData {
  userName: string;
  userEmail: string;
  score: number;
  level: string;
  listeningScore: number;
  grammarScore: number;
  readingScore: number;
  certificateNumber: string;
  date: string;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Colors
  const blueColor = [0, 84, 164]; // RGB for blue
  const purpleColor = [102, 51, 153]; // RGB for purple
  const redColor = [239, 65, 54]; // RGB for red
  const grayColor = [128, 128, 128]; // RGB for gray

  // Header - French Republic Block
  pdf.setFillColor(blueColor[0], blueColor[1], blueColor[2]);
  pdf.rect(15, 15, 45, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RÉPUBLIQUE', 17, 25);
  pdf.text('FRANÇAISE', 17, 30);
  
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Liberté', 17, 35);
  pdf.text('Égalité', 17, 37);
  pdf.text('Fraternité', 17, 39);

  // France Education International
  pdf.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FRANCE', pageWidth/2 - 15, 25, { align: 'center' });
  pdf.text('ÉDUCATION', pageWidth/2 - 15, 30, { align: 'center' });
  
  pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  pdf.setFontSize(10);
  pdf.text('INTERNATIONAL', pageWidth/2 - 15, 35, { align: 'center' });

  // TCF Logo
  pdf.setTextColor(redColor[0], redColor[1], redColor[2]);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TCF', pageWidth - 30, 35);

  // Title
  pdf.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Attestation TCF', pageWidth/2, 70, { align: 'center' });

  // Personal Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  
  const personalInfoY = 100;
  const labelX = 20;
  const valueX = 50;
  
  pdf.text('Nom:', labelX, personalInfoY);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.userName.toUpperCase(), valueX, personalInfoY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Prénom:', labelX, personalInfoY + 15);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.userEmail.split('@')[0], valueX, personalInfoY + 15);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('N° de certificat:', labelX, personalInfoY + 30);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.certificateNumber, valueX + 50, personalInfoY + 30);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Date:', labelX, personalInfoY + 45);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.date, valueX, personalInfoY + 45);

  // Results Table Title
  pdf.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Résultats des épreuves', 20, 180);

  // Table Header
  const tableY = 190;
  const tableHeight = 12;
  
  pdf.setFillColor(purpleColor[0], purpleColor[1], purpleColor[2]);
  pdf.rect(20, tableY, pageWidth - 40, tableHeight, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Épreuve', 25, tableY + 8);
  pdf.text('Score', pageWidth/2 - 10, tableY + 8, { align: 'center' });
  pdf.text('Niveau', pageWidth - 50, tableY + 8, { align: 'center' });

  // Table Rows
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const rowHeight = 15;
  let currentY = tableY + tableHeight + 5;
  
  // Row 1 - Listening
  pdf.rect(20, currentY, pageWidth - 40, rowHeight);
  pdf.text('Compréhension orale', 25, currentY + 10);
  pdf.text(`${data.listeningScore} pts`, pageWidth/2 - 10, currentY + 10, { align: 'center' });
  pdf.text(data.level, pageWidth - 50, currentY + 10, { align: 'center' });
  
  currentY += rowHeight;
  
  // Row 2 - Grammar
  pdf.rect(20, currentY, pageWidth - 40, rowHeight);
  pdf.text('Maîtrise des structures de la langue', 25, currentY + 10);
  pdf.text(`${data.grammarScore} pts`, pageWidth/2 - 10, currentY + 10, { align: 'center' });
  pdf.text(data.level, pageWidth - 50, currentY + 10, { align: 'center' });
  
  currentY += rowHeight;
  
  // Row 3 - Reading
  pdf.rect(20, currentY, pageWidth - 40, rowHeight);
  pdf.text('Compréhension écrite', 25, currentY + 10);
  pdf.text(`${data.readingScore} pts`, pageWidth/2 - 10, currentY + 10, { align: 'center' });
  pdf.text(data.level, pageWidth - 50, currentY + 10, { align: 'center' });
  
  currentY += rowHeight;
  
  // Total Row
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, currentY, pageWidth - 40, rowHeight, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
  pdf.text('Score Global', 25, currentY + 10);
  pdf.text(`${data.score} / 699 pts`, pageWidth/2 - 10, currentY + 10, { align: 'center' });
  pdf.text(data.level, pageWidth - 50, currentY + 10, { align: 'center' });

  // Footer - Brixel Academy
  const footerY = pageHeight - 60;
  
  pdf.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BRIXEL', pageWidth/2, footerY, { align: 'center' });
  pdf.text('ACADEMY', pageWidth/2, footerY + 10, { align: 'center' });
  
  pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Ce certificat est délivré par', pageWidth/2, footerY + 25, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Brixel Academy', pageWidth/2, footerY + 35, { align: 'center' });

  return pdf;
};

export const downloadCertificatePDF = (data: CertificateData) => {
  const pdf = generateCertificatePDF(data);
  const fileName = `Certificat_TCF_${data.userName}_${data.certificateNumber}.pdf`;
  pdf.save(fileName);
};

export const printCertificatePDF = (data: CertificateData) => {
  const pdf = generateCertificatePDF(data);
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const printWindow = window.open(pdfUrl);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};