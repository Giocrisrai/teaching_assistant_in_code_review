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
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        // Ajustar el ancho de la imagen al ancho del PDF con un pequeño margen
        const imgWidth = pdfWidth - 40;
        const imgHeight = imgWidth / ratio;
        let heightLeft = imgHeight;
        let position = 20; // Margen superior inicial

        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 40);

        // Si el contenido es más alto que una página, agregar páginas adicionales
        while (heightLeft > 0) {
            pdf.addPage();
            position = -heightLeft - 20; // Mover la imagen hacia arriba
            pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 40);
        }

        pdf.save(`reporte-evaluacion-${repoName}.pdf`);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al intentar generar el PDF. Revisa la consola para más detalles.");
    }
};
