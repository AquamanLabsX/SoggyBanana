/* =============================================
   TOOLS.JS - DRAWING TOOLS
   ============================================= */

class ToolManager {
    constructor() {
        this.currentTool = 'pencil';
        this.currentColor = '#000000';
        this.backgroundColor = '#ffffff';
        this.isDrawing = false;
    }

    /**
     * Set active tool
     * @param {string} tool - Tool name ('pencil', 'eraser', 'eyedropper')
     */
    setTool(tool) {
        this.currentTool = tool;
    }

    /**
     * Get active tool
     */
    getTool() {
        return this.currentTool;
    }

    /**
     * Set foreground color
     */
    setColor(color) {
        this.currentColor = color;
    }

    /**
     * Set background color
     */
    setBackgroundColor(color) {
        this.backgroundColor = color;
    }

    /**
     * Swap foreground and background colors
     */
    swapColors() {
        [this.currentColor, this.backgroundColor] = [this.backgroundColor, this.currentColor];
    }

    /**
     * Execute pencil tool - draw pixel
     */
    pencil(pixelX, pixelY, canvasManager, currentLayer) {
        if (!currentLayer) return;
        canvasManager.drawPixel(pixelX, pixelY, this.currentColor);
        currentLayer.setPixel(pixelX, pixelY, this.currentColor);
    }

    /**
     * Execute eraser tool - clear pixel
     */
    eraser(pixelX, pixelY, canvasManager, currentLayer) {
        if (!currentLayer) return;
        canvasManager.drawPixel(pixelX, pixelY, 'rgba(0, 0, 0, 0)');
        currentLayer.setPixel(pixelX, pixelY, 'rgba(0, 0, 0, 0)');
    }

    /**
     * Execute eyedropper tool - pick color
     */
    eyedropper(pixelX, pixelY, canvasManager) {
        const imageData = canvasManager.ctx.getImageData(
            pixelX * canvasManager.pixelSize * canvasManager.zoomLevel,
            pixelY * canvasManager.pixelSize * canvasManager.zoomLevel,
            1,
            1
        );
        const data = imageData.data;
        const color = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        return color;
    }

    /**
     * Start drawing
     */
    startDrawing() {
        this.isDrawing = true;
    }

    /**
     * Stop drawing
     */
    stopDrawing() {
        this.isDrawing = false;
    }

    /**
     * Check if currently drawing
     */
    isCurrentlyDrawing() {
        return this.isDrawing;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolManager;
}
