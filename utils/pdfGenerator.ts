import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = async (elementId: string, repoName: string) => {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
        console.error("No se encontró el elemento del reporte para generar el PDF.");
        alert("Error: No se pudo encontrar el contenido del reporte para generar el PDF.");
        return;
    }

    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2, // Aumenta la resolución para mejor calidad
            backgroundColor: '#1f2937', // bg-gray-800
            useCORS: true,
            windowWidth: reportElement.scrollWidth,
            windowHeight: reportElement.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;

        // Set margins for the PDF
        const margin = 40; // 20pt on each side
        const contentWidth = pdfWidth - margin;
        const contentHeight = contentWidth / canvasAspectRatio;
        
        // The available height for content on one page
        const pageContentHeight = pdfHeight - margin;

        let heightLeft = contentHeight;
        let position = 0; // This will track the vertical offset for the image

        // Add the first page
        // The image is added at full height, but it will be clipped by the page boundary
        pdf.addImage(imgData, 'PNG', margin / 2, margin / 2, contentWidth, contentHeight);
        heightLeft -= pageContentHeight;

        // Loop to add new pages if the content is taller than a single page
        while (heightLeft > 0) {
            position -= pageContentHeight; // Move the vertical position up by one page height
            pdf.addPage();
            // Add the same image, but at the new negative vertical position
            pdf.addImage(imgData, 'PNG', margin / 2, position + (margin / 2), contentWidth, contentHeight);
            heightLeft -= pageContentHeight;
        }

        pdf.save(`reporte-evaluacion-${repoName}.pdf`);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al intentar generar el PDF. Revisa la consola para más detalles.");
    }
};
