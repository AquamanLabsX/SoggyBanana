/* =============================================
   LAYERS.JS - LAYER SYSTEM MANAGEMENT
   ============================================= */

class Layer {
    constructor(name = 'Layer', width = 64, height = 64) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Store pixel data as RGBA array for easier manipulation
        this.pixelData = new Uint8ClampedArray(width * height * 4);
    }

    /**
     * Set pixel color
     */
    setPixel(x, y, color) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;

        // Parse color
        const rgba = this.parseColor(color);
        const index = (y * this.width + x) * 4;
        this.pixelData[index] = rgba.r;
        this.pixelData[index + 1] = rgba.g;
        this.pixelData[index + 2] = rgba.b;
        this.pixelData[index + 3] = rgba.a;

        // Update canvas
        this.updateCanvas();
    }

    /**
     * Get pixel color
     */
    getPixel(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 'rgba(0, 0, 0, 0)';

        const index = (y * this.width + x) * 4;
        const r = this.pixelData[index];
        const g = this.pixelData[index + 1];
        const b = this.pixelData[index + 2];
        const a = this.pixelData[index + 3] / 255;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * Parse color string to RGBA object
     */
    parseColor(color) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        return {
            r: imageData[0],
            g: imageData[1],
            b: imageData[2],
            a: imageData[3]
        };
    }

    /**
     * Update canvas from pixel data
     */
    updateCanvas() {
        const imageData = this.ctx.createImageData(this.width, this.height);
        imageData.data.set(this.pixelData);
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Clear layer
     */
    clear() {
        this.pixelData.fill(0);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Get layer data for saving
     */
    getData() {
        return {
            name: this.name,
            visible: this.visible,
            pixelData: Array.from(this.pixelData)
        };
    }

    /**
     * Load layer data
     */
    setData(data) {
        this.name = data.name;
        this.visible = data.visible;
        this.pixelData = new Uint8ClampedArray(data.pixelData);
        this.updateCanvas();
    }
}

class LayerManager {
    constructor(canvasWidth = 64, canvasHeight = 64) {
        this.layers = [];
        this.activeLayerIndex = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Create default layer
        this.addLayer('Background');
    }

    /**
     * Add new layer
     */
    addLayer(name = null) {
        const layerName = name || `Layer ${this.layers.length + 1}`;
        const layer = new Layer(layerName, this.canvasWidth, this.canvasHeight);
        this.layers.push(layer);
        this.activeLayerIndex = this.layers.length - 1;
        return layer;
    }

    /**
     * Delete layer
     */
    deleteLayer(index) {
        if (this.layers.length <= 1) return false; // Keep at least one layer

        this.layers.splice(index, 1);

        // Adjust active index
        if (this.activeLayerIndex >= this.layers.length) {
            this.activeLayerIndex = this.layers.length - 1;
        }

        return true;
    }

    /**
     * Get active layer
     */
    getActiveLayer() {
        return this.layers[this.activeLayerIndex];
    }

    /**
     * Set active layer
     */
    setActiveLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.activeLayerIndex = index;
        }
    }

    /**
     * Get all layers
     */
    getLayers() {
        return this.layers;
    }

    /**
     * Toggle layer visibility
     */
    toggleLayerVisibility(index) {
        if (index >= 0 && index < this.layers.length) {
            this.layers[index].visible = !this.layers[index].visible;
        }
    }

    /**
     * Render all visible layers to a canvas
     */
    renderToCanvas(targetCanvas) {
        const ctx = targetCanvas.getContext('2d');
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            if (layer.visible) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        }
    }

    /**
     * Get all layers data for saving
     */
    getAllData() {
        return this.layers.map(layer => layer.getData());
    }

    /**
     * Load all layers data
     */
    setAllData(layersData) {
        this.layers = [];
        layersData.forEach(data => {
            const layer = new Layer(data.name, this.canvasWidth, this.canvasHeight);
            layer.setData(data);
            this.layers.push(layer);
        });
        this.activeLayerIndex = Math.min(0, this.layers.length - 1);
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Layer, LayerManager };
}
