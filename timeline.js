/* =============================================
   TIMELINE.JS - ANIMATION TIMELINE & FRAMES
   ============================================= */

class Frame {
    constructor(frameNumber, width = 64, height = 64) {
        this.frameNumber = frameNumber;
        this.width = width;
        this.height = height;
        this.layers = [];
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Get frame data for saving
     */
    getData() {
        return {
            frameNumber: this.frameNumber,
            layers: this.layers.map(layer => layer.getData())
        };
    }

    /**
     * Load frame data
     */
    setData(data, LayerClass) {
        this.frameNumber = data.frameNumber;
        this.layers = [];
        data.layers.forEach(layerData => {
            const layer = new LayerClass(layerData.name, this.width, this.height);
            layer.setData(layerData);
            this.layers.push(layer);
        });
    }
}

class TimelineManager {
    constructor(canvasWidth = 64, canvasHeight = 64) {
        this.frames = [];
        this.activeFrameIndex = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isPlaying = false;
        this.fps = 8;
        this.playbackInterval = null;
        this.playbackSpeed = 1000 / this.fps;

        // Create first frame
        this.addFrame();
    }

    /**
     * Add new frame
     */
    addFrame() {
        const frame = new Frame(this.frames.length, this.canvasWidth, this.canvasHeight);
        this.frames.push(frame);
        this.activeFrameIndex = this.frames.length - 1;
        return frame;
    }

    /**
     * Delete frame
     */
    deleteFrame(index) {
        if (this.frames.length <= 1) return false; // Keep at least one frame

        this.frames.splice(index, 1);

        // Adjust active index
        if (this.activeFrameIndex >= this.frames.length) {
            this.activeFrameIndex = this.frames.length - 1;
        }

        // Renumber frames
        this.frames.forEach((frame, i) => {
            frame.frameNumber = i;
        });

        return true;
    }

    /**
     * Duplicate frame
     */
    duplicateFrame(index) {
        if (index < 0 || index >= this.frames.length) return null;

        const originalFrame = this.frames[index];
        const newFrame = new Frame(this.frames.length, this.canvasWidth, this.canvasHeight);
        newFrame.setData(originalFrame.getData(), Layer);

        this.frames.splice(index + 1, 0, newFrame);
        this.activeFrameIndex = index + 1;

        // Renumber frames
        this.frames.forEach((frame, i) => {
            frame.frameNumber = i;
        });

        return newFrame;
    }

    /**
     * Get active frame
     */
    getActiveFrame() {
        return this.frames[this.activeFrameIndex];
    }

    /**
     * Set active frame
     */
    setActiveFrame(index) {
        if (index >= 0 && index < this.frames.length) {
            this.activeFrameIndex = index;
        }
    }

    /**
     * Get all frames
     */
    getFrames() {
        return this.frames;
    }

    /**
     * Get total frame count
     */
    getFrameCount() {
        return this.frames.length;
    }

    /**
     * Set FPS
     */
    setFPS(fps) {
        this.fps = Math.max(1, Math.min(60, fps));
        this.playbackSpeed = 1000 / this.fps;
    }

    /**
     * Start animation playback
     */
    startPlayback(onFrameChange) {
        if (this.isPlaying) return;
        this.isPlaying = true;

        let frameIndex = this.activeFrameIndex;

        const playFrame = () => {
            if (!this.isPlaying) return;

            frameIndex = (frameIndex + 1) % this.frames.length;
            this.activeFrameIndex = frameIndex;

            if (onFrameChange) {
                onFrameChange(frameIndex);
            }

            this.playbackInterval = setTimeout(playFrame, this.playbackSpeed);
        };

        this.playbackInterval = setTimeout(playFrame, this.playbackSpeed);
    }

    /**
     * Stop animation playback
     */
    stopPlayback() {
        this.isPlaying = false;
        if (this.playbackInterval) {
            clearTimeout(this.playbackInterval);
            this.playbackInterval = null;
        }
    }

    /**
     * Check if playing
     */
    isCurrentlyPlaying() {
        return this.isPlaying;
    }

    /**
     * Get timeline data for saving
     */
    getAllData() {
        return {
            fps: this.fps,
            frames: this.frames.map(frame => frame.getData())
        };
    }

    /**
     * Load timeline data
     */
    setAllData(data) {
        this.fps = data.fps;
        this.playbackSpeed = 1000 / this.fps;
        this.frames = [];

        data.frames.forEach(frameData => {
            const frame = new Frame(frameData.frameNumber, this.canvasWidth, this.canvasHeight);
            frame.setData(frameData, Layer);
            this.frames.push(frame);
        });

        this.activeFrameIndex = 0;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Frame, TimelineManager };
}
