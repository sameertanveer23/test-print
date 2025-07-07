import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

declare module 'html2pdf.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-print';
  loading = false;
  showPrintSection = false;

  // Download PDF only
  downloadPdf() {
    console.log('[Download PDF] Starting PDF generation...');
    import('html2pdf.js').then((html2pdf) => {
      const element = document.getElementById('print-section');
      if (element) {
        console.log('[Download PDF] Element found, generating PDF...');
        html2pdf
          .default(element, {
            margin: 10,
            filename: 'demo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .then(() => {
            console.log('[Download PDF] PDF download complete.');
          })
          .catch((err: any) => {
            console.error('[Download PDF] Error:', err);
          });
      } else {
        console.error('[Download PDF] Element not found!');
      }
    });
  }

  // Print only
  printPage() {
    console.log('[Print] Preparing to print...');
    const element = document.getElementById('print-section');
    if (element) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(
          '<html><head><title>Print</title></head><body>' +
            element.innerHTML +
            '</body></html>'
        );
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          console.log('[Print] Opening print dialog...');
          printWindow.print();
          printWindow.close();
          console.log('[Print] Print dialog closed.');
        }, 500);
      } else {
        console.error('[Print] Could not open print window.');
      }
    } else {
      console.error('[Print] Element not found!');
    }
  }

  /**
   * Download or print the content of #print-section as PDF
   * @param isPrint If true, will print the PDF, otherwise download
   */
  async handlePdf(isPrint = false) {
    this.showPrintSection = true;
    console.log(`[PDF] Preparing to ${isPrint ? 'print' : 'download'}...`);
    setTimeout(async () => {
      this.loading = true;
      const element = document.getElementById('print-section');
      if (!element) {
        console.error('[PDF] Element not found!');
        this.loading = false;
        this.showPrintSection = false;
        return;
      }
      const options = {
        filename: 'Demo_Report.pdf',
        margin: [10, 7, 10, 7],
        html2canvas: { scale: 3, x: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      try {
        console.log('[PDF] Generating PDF...');
        const html2pdfmod = await import('html2pdf.js');
        const worker = html2pdfmod.default().set(options).from(element);
        const pdfBlob = await worker.outputPdf('blob');
        console.log('[PDF] PDF Blob generated.');
        const url = window.URL.createObjectURL(pdfBlob);
        if (isPrint) {
          console.log('[PDF] Opening print dialog for PDF...');
          const printWindow = window.open(url, '_blank');
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
              printWindow.onafterprint = () => {
                printWindow.close();
                window.URL.revokeObjectURL(url);
                console.log('[PDF] Print dialog closed and blob revoked.');
              };
            };
          } else {
            console.error('[PDF] Could not open print window.');
          }
        } else {
          console.log('[PDF] Triggering download...');
          const a = document.createElement('a');
          a.href = url;
          a.download = options.filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            console.log('[PDF] Download complete and blob revoked.');
          }, 100);
        }
      } catch (error) {
        console.error('[PDF] Error:', error);
      } finally {
        this.loading = false;
        this.showPrintSection = false;
      }
    }, 1);
  }
}
