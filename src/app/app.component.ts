import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare module 'html2pdf.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-print';

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
}
