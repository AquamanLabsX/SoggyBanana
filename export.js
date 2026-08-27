/* =============================================
   EXPORT.JS - PNG EXPORT FUNCTIONALITY
   ============================================= */

class ExportManager {
    /**
     * Export canvas as PNG
     */
    static exportCanvasPNG(canvas, filename = 'export.png') {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    /**
     * Export with upscaling (for high quality pixel art export)
     */
    static exportCanvasPNGUpscaled(canvas, scale = 2, filename = 'export.png') {
        const upscaledCanvas = document.createElement('canvas');
        upscaledCanvas.width = canvas.width * scale;
        upscaledCanvas.height = canvas.height * scale;
        const ctx = upscaledCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, upscaledCanvas.width, upscaledCanvas.height);

        upscaledCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    /**
     * Get PNG data URL (for preview, etc)
     */
    static getCanvasDataURL(canvas) {
        return canvas.toDataURL('image/png');
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}
