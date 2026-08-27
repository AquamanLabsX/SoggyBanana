/* =============================================
   APP.JS - MAIN APPLICATION CONTROLLER
   ============================================= */

class SoggyBananaApp {
    constructor() {
        // Initialize managers
        this.canvasManager = new CanvasManager(
            document.getElementById('pixel-canvas'),
            64, 64, 8
        );
        this.toolManager = new ToolManager();
        this.layerManager = new LayerManager(64, 64);
        this.timelineManager = new TimelineManager(64, 64);
        this.storageManager = new StorageManager();
        this.historyManager = new HistoryManager();

        // Render canvases for each frame layer
        this.initializeFrameLayers();

        // DOM elements
        this.elements = {
            canvas: document.getElementById('pixel-canvas'),
            colorInput: document.getElementById('color-input'),
            currentColorBox: document.getElementById('current-color-box'),
            zoomLevel: document.getElementById('zoom-level'),
            layersList: document.getElementById('layers-list'),
            framesList: document.getElementById('frames-timeline'),
            projectName: document.getElementById('project-name'),
            statusMessage: document.getElementById('status-message'),
            gridToggle: document.getElementById('toggle-grid'),
            fpsInput: document.getElementById('fps-input')
        };

        // Bind events
        this.bindCanvasEvents();
        this.bindToolEvents();
        this.bindColorEvents();
        this.bindZoomEvents();
        this.bindLayerEvents();
        this.bindTimelineEvents();
        this.bindStorageEvents();
        this.bindHistoryEvents();
        this.bindKeyboardShortcuts();

        // Initial render
        this.render();

        this.setStatus('Ready');
    }

    /**
     * Initialize layers for current frame
     */
    initializeFrameLayers() {
        const frame = this.timelineManager.getActiveFrame();
        frame.layers = [];
        this.layerManager.getLayers().forEach(layer => {
            frame.layers.push(layer);
        });
    }

    /**
     * Render canvas with all layers
     */
    render() {
        this.canvasManager.clear();

        // Render layers from bottom to top
        const frame = this.timelineManager.getActiveFrame();
        for (let i = frame.layers.length - 1; i >= 0; i--) {
            const layer = frame.layers[i];
            if (layer.visible) {
                // Draw layer pixels directly on canvas
                const imageData = this.canvasManager.ctx.createImageData(
                    this.canvasManager.width,
                    this.canvasManager.height
                );
                imageData.data.set(layer.pixelData);

                // Create temp canvas for this layer
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.canvasManager.width;
                tempCanvas.height = this.canvasManager.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.putImageData(imageData, 0, 0);

                // Scale and draw on main canvas
                const displayWidth = this.canvasManager.width * this.canvasManager.pixelSize * this.canvasManager.zoomLevel;
                const displayHeight = this.canvasManager.height * this.canvasManager.pixelSize * this.canvasManager.zoomLevel;
                this.canvasManager.ctx.drawImage(tempCanvas, 0, 0, displayWidth, displayHeight);
            }
        }

        this.canvasManager.drawGrid();
        this.renderLayers();
        this.renderTimeline();
    }

    /**
     * Bind canvas mouse events
     */
    bindCanvasEvents() {
        this.elements.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.elements.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.elements.canvas.addEventListener('mouseup', () => this.handleCanvasMouseUp());
        this.elements.canvas.addEventListener('mouseleave', () => this.handleCanvasMouseUp());
    }

    /**
     * Handle canvas mouse down
     */
    handleCanvasMouseDown(e) {
        this.toolManager.startDrawing();
        this.saveHistoryState();
        this.handleCanvasMouseMove(e);
    }

    /**
     * Handle canvas mouse move
     */
    handleCanvasMouseMove(e) {
        if (!this.toolManager.isCurrentlyDrawing()) return;

        const pixel = this.canvasManager.screenToPixel(e.clientX, e.clientY);
        if (!pixel) return;

        const currentLayer = this.layerManager.getActiveLayer();
        const tool = this.toolManager.getTool();

        switch (tool) {
            case 'pencil':
                this.toolManager.pencil(pixel.pixelX, pixel.pixelY, this.canvasManager, currentLayer);
                break;
            case 'eraser':
                this.toolManager.eraser(pixel.pixelX, pixel.pixelY, this.canvasManager, currentLayer);
                break;
            case 'eyedropper':
                const color = this.toolManager.eyedropper(pixel.pixelX, pixel.pixelY, this.canvasManager);
                this.toolManager.setColor(color);
                this.updateColorUI();
                this.toolManager.stopDrawing();
                return;
        }

        this.render();
    }

    /**
     * Handle canvas mouse up
     */
    handleCanvasMouseUp() {
        this.toolManager.stopDrawing();
    }

    /**
     * Bind tool button events
     */
    bindToolEvents() {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.toolManager.setTool(btn.dataset.tool);
                this.setStatus(`Tool: ${btn.textContent}`);
            });
        });
    }

    /**
     * Bind color events
     */
    bindColorEvents() {
        this.elements.colorInput.addEventListener('change', (e) => {
            this.toolManager.setColor(e.target.value);
            this.updateColorUI();
        });

        this.elements.currentColorBox.addEventListener('click', () => {
            this.elements.colorInput.click();
        });

        document.getElementById('btn-swap-colors').addEventListener('click', () => {
            this.toolManager.swapColors();
            this.updateColorUI();
            this.setStatus('Colors swapped');
        });

        this.renderPalette();
    }

    /**
     * Update color UI
     */
    updateColorUI() {
        this.elements.colorInput.value = this.rgbaToHex(this.toolManager.currentColor);
        this.elements.currentColorBox.style.backgroundColor = this.toolManager.currentColor;
    }

    /**
     * Convert RGBA to HEX
     */
    rgbaToHex(rgba) {
        if (rgba.startsWith('#')) return rgba;
        const match = rgba.match(/\d+/g);
        if (!match || match.length < 3) return '#000000';
        return '#' + [match[0], match[1], match[2]].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    /**
     * Render palette
     */
    renderPalette() {
        const paletteContainer = document.getElementById('palette-colors');
        const defaultPalette = [
            '#000000', '#ffffff', '#ff0000', '#00ff00',
            '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#ff8800', '#8800ff', '#00ff88', '#ff0088'
        ];

        paletteContainer.innerHTML = '';
        defaultPalette.forEach(color => {
            const colorEl = document.createElement('div');
            colorEl.className = 'palette-color';
            colorEl.style.backgroundColor = color;
            colorEl.title = color;
            colorEl.addEventListener('click', () => {
                this.toolManager.setColor(color);
                this.updateColorUI();
            });
            paletteContainer.appendChild(colorEl);
        });
    }

    /**
     * Bind zoom events
     */
    bindZoomEvents() {
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            this.canvasManager.zoomIn();
            this.updateZoomUI();
            this.render();
        });

        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            this.canvasManager.zoomOut();
            this.updateZoomUI();
            this.render();
        });

        this.elements.gridToggle.addEventListener('change', (e) => {
            this.canvasManager.showGrid = e.target.checked;
            this.render();
        });
    }

    /**
     * Update zoom UI
     */
    updateZoomUI() {
        this.elements.zoomLevel.textContent = this.canvasManager.getZoomPercentage() + '%';
    }

    /**
     * Bind layer events
     */
    bindLayerEvents() {
        document.getElementById('btn-add-layer').addEventListener('click', () => {
            this.layerManager.addLayer();
            const frame = this.timelineManager.getActiveFrame();
            frame.layers = this.layerManager.getLayers();
            this.renderLayers();
            this.render();
            this.setStatus('Layer added');
        });

        document.getElementById('btn-delete-layer').addEventListener('click', () => {
            if (this.layerManager.deleteLayer(this.layerManager.activeLayerIndex)) {
                const frame = this.timelineManager.getActiveFrame();
                frame.layers = this.layerManager.getLayers();
                this.renderLayers();
                this.render();
                this.setStatus('Layer deleted');
            }
        });
    }

    /**
     * Render layers panel
     */
    renderLayers() {
        const layersList = this.elements.layersList;
        layersList.innerHTML = '';

        const layers = this.layerManager.getLayers();
        layers.forEach((layer, index) => {
            const layerEl = document.createElement('div');
            layerEl.className = 'layer-item' + (index === this.layerManager.activeLayerIndex ? ' active' : '');
            layerEl.innerHTML = `
                <span class="layer-name">${layer.name}</span>
                <span class="layer-visibility">${layer.visible ? '👁' : '🚫'}</span>
            `;

            layerEl.addEventListener('click', () => {
                this.layerManager.setActiveLayer(index);
                this.renderLayers();
            });

            layerEl.querySelector('.layer-visibility').addEventListener('click', (e) => {
                e.stopPropagation();
                this.layerManager.toggleLayerVisibility(index);
                this.renderLayers();
                this.render();
            });

            layersList.appendChild(layerEl);
        });
    }

    /**
     * Bind timeline events
     */
    bindTimelineEvents() {
        document.getElementById('btn-add-frame').addEventListener('click', () => {
            const newFrame = this.timelineManager.addFrame();
            newFrame.layers = this.layerManager.getLayers().map(l => {
                const layer = new Layer(l.name, 64, 64);
                layer.setData(l.getData());
                return layer;
            });
            this.renderTimeline();
            this.setStatus('Frame added');
        });

        document.getElementById('btn-delete-frame').addEventListener('click', () => {
            if (this.timelineManager.deleteFrame(this.timelineManager.activeFrameIndex)) {
                this.layerManager.setAllData(
                    this.timelineManager.getActiveFrame().layers.map(l => l.getData())
                );
                this.renderTimeline();
                this.render();
                this.setStatus('Frame deleted');
            }
        });

        document.getElementById('btn-duplicate-frame').addEventListener('click', () => {
            this.timelineManager.duplicateFrame(this.timelineManager.activeFrameIndex);
            this.renderTimeline();
            this.setStatus('Frame duplicated');
        });

        document.getElementById('btn-play-animation').addEventListener('click', () => {
            const fps = parseInt(this.elements.fpsInput.value) || 8;
            this.timelineManager.setFPS(fps);
            this.timelineManager.startPlayback(() => {
                this.layerManager.setAllData(
                    this.timelineManager.getActiveFrame().layers.map(l => l.getData())
                );
                this.renderTimeline();
                this.render();
            });
            this.setStatus('Playing animation');
        });

        document.getElementById('btn-stop-animation').addEventListener('click', () => {
            this.timelineManager.stopPlayback();
            this.setStatus('Animation stopped');
        });

        this.elements.fpsInput.addEventListener('change', (e) => {
            this.timelineManager.setFPS(parseInt(e.target.value) || 8);
        });
    }

    /**
     * Render timeline panel
     */
    renderTimeline() {
        const framesList = this.elements.framesList;
        framesList.innerHTML = '';

        this.timelineManager.getFrames().forEach((frame, index) => {
            const frameEl = document.createElement('div');
            frameEl.className = 'frame-thumbnail' + (index === this.timelineManager.activeFrameIndex ? ' active' : '');
            frameEl.title = `Frame ${index + 1}`;

            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = 16;
            frameCanvas.height = 16;
            const frameCtx = frameCanvas.getContext('2d');
            frameCtx.imageSmoothingEnabled = false;

            // Draw frame preview
            if (frame.layers && frame.layers.length > 0) {
                for (let i = frame.layers.length - 1; i >= 0; i--) {
                    const layer = frame.layers[i];
                    if (layer.visible) {
                        const imageData = frameCtx.createImageData(16, 16);
                        // Scale pixel data to 16x16
                        for (let y = 0; y < 16; y++) {
                            for (let x = 0; x < 16; x++) {
                                const srcX = Math.floor((x / 16) * 64);
                                const srcY = Math.floor((y / 16) * 64);
                                const srcIdx = (srcY * 64 + srcX) * 4;
                                const dstIdx = (y * 16 + x) * 4;
                                imageData.data[dstIdx] = layer.pixelData[srcIdx];
                                imageData.data[dstIdx + 1] = layer.pixelData[srcIdx + 1];
                                imageData.data[dstIdx + 2] = layer.pixelData[srcIdx + 2];
                                imageData.data[dstIdx + 3] = layer.pixelData[srcIdx + 3];
                            }
                        }
                        frameCtx.putImageData(imageData, 0, 0);
                    }
                }
            }

            frameEl.appendChild(frameCanvas);
            const label = document.createElement('div');
            label.style.fontSize = '10px';
            label.style.marginTop = '4px';
            label.textContent = `${index + 1}`;
            frameEl.appendChild(label);

            frameEl.addEventListener('click', () => {
                this.timelineManager.setActiveFrame(index);
                if (frame.layers && frame.layers.length > 0) {
                    this.layerManager.setAllData(frame.layers.map(l => l.getData()));
                }
                this.renderTimeline();
                this.renderLayers();
                this.render();
            });

            framesList.appendChild(frameEl);
        });
    }

    /**
     * Bind storage events
     */
    bindStorageEvents() {
        document.getElementById('btn-new').addEventListener('click', () => {
            if (confirm('Create new project? Unsaved changes will be lost.')) {
                location.reload();
            }
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            const projectName = prompt('Project name:', this.storageManager.getProjectName());
            if (projectName) {
                this.storageManager.setProjectName(projectName);
                this.elements.projectName.textContent = projectName;

                const layersData = this.layerManager.getAllData();
                const timelineData = this.timelineManager.getAllData();

                if (this.storageManager.saveProject(layersData, timelineData)) {
                    this.setStatus('Project saved: ' + projectName);
                } else {
                    this.setStatus('Failed to save project');
                }
            }
        });

        document.getElementById('btn-open').addEventListener('click', () => {
            const projects = this.storageManager.getAllProjects();
            if (projects.length === 0) {
                alert('No saved projects found');
                return;
            }

            const projectName = prompt('Project name to open:\n' + projects.map(p => p.name).join('\n'));
            if (projectName) {
                const projectData = this.storageManager.loadProject(projectName);
                if (projectData) {
                    this.storageManager.setProjectName(projectData.name);
                    this.elements.projectName.textContent = projectData.name;
                    this.layerManager.setAllData(projectData.layers);
                    this.timelineManager.setAllData(projectData.timeline);
                    this.renderLayers();
                    this.renderTimeline();
                    this.render();
                    this.setStatus('Project loaded: ' + projectName);
                } else {
                    this.setStatus('Failed to load project');
                }
            }
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            const filename = prompt('Filename:', this.storageManager.getProjectName() + '.png');
            if (filename) {
                ExportManager.exportCanvasPNG(this.canvasManager.canvas, filename);
                this.setStatus('Exported: ' + filename);
            }
        });
    }

    /**
     * Bind history events
     */
    bindHistoryEvents() {
        document.getElementById('btn-undo').addEventListener('click', () => {
            if (this.historyManager.canUndo()) {
                const state = this.historyManager.undo();
                if (state) {
                    this.layerManager.setAllData(state.layers);
                    this.renderLayers();
                    this.render();
                    this.setStatus('Undo');
                }
            }
        });

        document.getElementById('btn-redo').addEventListener('click', () => {
            if (this.historyManager.canRedo()) {
                const state = this.historyManager.redo();
                if (state) {
                    this.layerManager.setAllData(state.layers);
                    this.renderLayers();
                    this.render();
                    this.setStatus('Redo');
                }
            }
        });
    }

    /**
     * Bind keyboard shortcuts
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    document.getElementById('btn-undo').click();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    document.getElementById('btn-redo').click();
                }
            }

            if (e.key === 'p' || e.key === 'P') {
                document.querySelectorAll('.tool-btn')[0].click();
            }
            if (e.key === 'e' || e.key === 'E') {
                document.querySelectorAll('.tool-btn')[1].click();
            }
            if (e.key === 'i' || e.key === 'I') {
                document.querySelectorAll('.tool-btn')[2].click();
            }
            if (e.key === 'x' || e.key === 'X') {
                document.getElementById('btn-swap-colors').click();
            }
            if (e.key === '+' || e.key === '=') {
                document.getElementById('btn-zoom-in').click();
            }
            if (e.key === '-') {
                document.getElementById('btn-zoom-out').click();
            }
        });
    }

    /**
     * Save history state
     */
    saveHistoryState() {
        const state = {
            layers: this.layerManager.getAllData()
        };
        this.historyManager.saveState(state);
    }

    /**
     * Set status message
     */
    setStatus(message) {
        this.elements.statusMessage.textContent = message;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SoggyBananaApp();
});
