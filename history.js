/* =============================================
   HISTORY.JS - UNDO/REDO SYSTEM
   ============================================= */

class HistoryManager {
    constructor(maxStates = 50) {
        this.maxStates = maxStates;
        this.states = [];
        this.currentIndex = -1;
    }

    /**
     * Save a new state to history
     * @param {Object} state - The state to save (canvas data, layers, etc)
     */
    saveState(state) {
        // Remove any states after current index (when user draws after undo)
        this.states = this.states.slice(0, this.currentIndex + 1);

        // Add new state
        this.states.push(JSON.parse(JSON.stringify(state)));
        this.currentIndex++;

        // Limit history size
        if (this.states.length > this.maxStates) {
            this.states.shift();
            this.currentIndex--;
        }
    }

    /**
     * Get the previous state (undo)
     * @returns {Object|null} Previous state or null if at beginning
     */
    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.states[this.currentIndex];
        }
        return null;
    }

    /**
     * Get the next state (redo)
     * @returns {Object|null} Next state or null if at end
     */
    redo() {
        if (this.currentIndex < this.states.length - 1) {
            this.currentIndex++;
            return this.states[this.currentIndex];
        }
        return null;
    }

    /**
     * Check if undo is available
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if redo is available
     */
    canRedo() {
        return this.currentIndex < this.states.length - 1;
    }

    /**
     * Clear all history
     */
    clear() {
        this.states = [];
        this.currentIndex = -1;
    }

    /**
     * Get current state
     */
    getCurrentState() {
        return this.states[this.currentIndex] || null;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryManager;
}
