/* =============================================
   CANVAS.JS - CANVAS & PIXEL GRID MANAGEMENT
   ============================================= */

class CanvasManager {
    constructor(canvasElement, width = 64, height = 64, pixelSize = 8) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.pixelSize = pixelSize;
        this.zoomLevel = 1;
        this.showGrid = true;
        this.gridOverlay = null;

        // Set canvas size
        this.updateCanvasSize();

        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * Update canvas display size based on zoom and pixel size
     */
    updateCanvasSize() {
        const displayWidth = this.width * this.pixelSize * this.zoomLevel;
        const displayHeight = this.height * this.pixelSize * this.zoomLevel;

        this.canvas.width = displayWidth;
        this.canvas.height = displayHeight;

        // Re-enable pixel-perfect rendering after resize
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * Set zoom level
     * @param {number} level - Zoom multiplier (1, 2, 4, etc)
     */
    setZoom(level) {
        this.zoomLevel = Math.max(0.5, Math.min(8, level));
        this.updateCanvasSize();
        return this.zoomLevel;
    }

    /**
     * Get zoom level percentage
     */
    getZoomPercentage() {
        return Math.round(this.zoomLevel * 100);
    }

    /**
     * Zoom in
     */
    zoomIn() {
        return this.setZoom(this.zoomLevel + 0.5);
    }

    /**
     * Zoom out
     */
    zoomOut() {
        return this.setZoom(this.zoomLevel - 0.5);
    }

    /**
     * Convert screen coordinates to pixel coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} {pixelX, pixelY} or null if outside canvas
     */
    screenToPixel(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = screenX - rect.left;
        const canvasY = screenY - rect.top;

        const pixelX = Math.floor(canvasX / (this.pixelSize * this.zoomLevel));
        const pixelY = Math.floor(canvasY / (this.pixelSize * this.zoomLevel));

        if (pixelX < 0 || pixelY < 0 || pixelX >= this.width || pixelY >= this.height) {
            return null;
        }

        return { pixelX, pixelY };
    }

    /**
     * Draw a single pixel
     * @param {number} x - Pixel X
     * @param {number} y - Pixel Y
     * @param {string} color - Color (hex or rgba)
     */
    drawPixel(x, y, color) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;

        const displayX = x * this.pixelSize * this.zoomLevel;
        const displayY = y * this.pixelSize * this.zoomLevel;
        const displaySize = this.pixelSize * this.zoomLevel;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(displayX, displayY, displaySize, displaySize);
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw grid overlay
     */
    drawGrid(color = 'rgba(255, 255, 255, 0.1)') {
        if (!this.showGrid) return;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;

        const pixelDisplaySize = this.pixelSize * this.zoomLevel;

        // Vertical lines
        for (let x = 0; x <= this.width; x++) {
            const displayX = x * pixelDisplaySize;
            this.ctx.beginPath();
            this.ctx.moveTo(displayX, 0);
            this.ctx.lineTo(displayX, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.height; y++) {
            const displayY = y * pixelDisplaySize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, displayY);
            this.ctx.lineTo(this.canvas.width, displayY);
            this.ctx.stroke();
        }
    }

    /**
     * Get canvas image data as array
     * @returns {Array} Pixel data [r, g, b, a, r, g, b, a, ...]
     */
    getImageData() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return Array.from(imageData.data);
    }

    /**
     * Put image data back to canvas
     * @param {Array} data - Pixel data array
     */
    putImageData(data) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        imageData.data.set(data);
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Export canvas as PNG blob
     */
    exportPNG(callback) {
        this.canvas.toBlob(callback, 'image/png');
    }

    /**
     * Get canvas as data URL
     */
    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }

    /**
     * Resize canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        const oldCanvas = document.createElement('canvas');
        oldCanvas.width = this.canvas.width;
        oldCanvas.height = this.canvas.height;
        const oldCtx = oldCanvas.getContext('2d');
        oldCtx.drawImage(this.canvas, 0, 0);

        this.width = width;
        this.height = height;
        this.updateCanvasSize();

        // Draw old content back
        this.ctx.drawImage(oldCanvas, 0, 0);
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasManager;
}
