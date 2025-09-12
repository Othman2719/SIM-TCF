import { showSaveDialog, showMessageBox, isElectron } from './electronUtils';

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

export const downloadCertificatePDF = async (data: CertificateData): Promise<void> => {
  if (isElectron()) {
    // Electron-specific save dialog
    const result = await showSaveDialog();
    if (!result.canceled && result.filePath) {
      // Here you would implement actual PDF generation and saving
      await showMessageBox({
        type: 'info',
        title: 'Certificat sauvegardé',
        message: `Le certificat a été sauvegardé avec succès !`,
        detail: `Fichier: ${result.filePath}`
      });
    }
  } else {
    // Web fallback
    console.log('Downloading certificate PDF for:', data.userName);
    alert('Fonctionnalité de téléchargement PDF en cours de développement');
  }
};

export const printCertificatePDF = (data: CertificateData): void => {
  // Placeholder implementation for PDF printing
  console.log('Printing certificate PDF for:', data.userName);
  
  // Create a simple printable certificate
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificat TCF - ${data.userName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              text-align: center;
            }
            .certificate {
              border: 3px solid #2563eb;
              padding: 40px;
              margin: 20px 0;
            }
            .header {
              color: #2563eb;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .recipient {
              font-size: 24px;
              margin: 30px 0;
              color: #1f2937;
            }
            .score {
              font-size: 20px;
              color: #059669;
              font-weight: bold;
              margin: 20px 0;
            }
            .details {
              margin: 30px 0;
              text-align: left;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">CERTIFICAT TCF</div>
            <div class="header" style="font-size: 18px;">Test de Connaissance du Français</div>
            
            <div class="recipient">
              Certifie que<br>
              <strong>${data.userName}</strong><br>
              a obtenu le niveau <strong>${data.level}</strong>
            </div>
            
            <div class="score">
              Score: ${data.score} points sur 699
            </div>
            
            <div class="details">
              <strong>Détail des scores par section:</strong><br>
              • Compréhension Orale: ${data.listeningScore} points<br>
              • Structures de la Langue: ${data.grammarScore} points<br>
              • Compréhension Écrite: ${data.readingScore} points
            </div>
            
            <div class="footer">
              Certificat N°: ${data.certificateNumber}<br>
              Délivré le: ${data.date}<br>
              Brixel Academy - Simulateur TCF
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};