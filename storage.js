/* =============================================
   STORAGE.JS - PROJECT SAVE/LOAD SYSTEM
   ============================================= */

class StorageManager {
    constructor() {
        this.projectName = 'Untitled Project';
    }

    /**
     * Set project name
     */
    setProjectName(name) {
        this.projectName = name;
    }

    /**
     * Get project name
     */
    getProjectName() {
        return this.projectName;
    }

    /**
     * Save project to localStorage
     */
    saveProject(layersData, timelineData) {
        const projectData = {
            name: this.projectName,
            timestamp: new Date().toISOString(),
            layers: layersData,
            timeline: timelineData
        };

        try {
            localStorage.setItem('sbproject_' + this.projectName, JSON.stringify(projectData));
            return true;
        } catch (e) {
            console.error('Failed to save project:', e);
            return false;
        }
    }

    /**
     * Load project from localStorage
     */
    loadProject(projectName) {
        try {
            const data = localStorage.getItem('sbproject_' + projectName);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (e) {
            console.error('Failed to load project:', e);
            return null;
        }
    }

    /**
     * Get all saved projects
     */
    getAllProjects() {
        const projects = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('sbproject_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    projects.push({
                        name: data.name,
                        timestamp: data.timestamp
                    });
                } catch (e) {
                    console.error('Failed to parse project:', key, e);
                }
            }
        }
        return projects;
    }

    /**
     * Delete project
     */
    deleteProject(projectName) {
        try {
            localStorage.removeItem('sbproject_' + projectName);
            return true;
        } catch (e) {
            console.error('Failed to delete project:', e);
            return false;
        }
    }

    /**
     * Export project as JSON file
     */
    exportProjectAsFile(layersData, timelineData) {
        const projectData = {
            name: this.projectName,
            timestamp: new Date().toISOString(),
            layers: layersData,
            timeline: timelineData
        };

        const jsonString = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.projectName + '.sbproj';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Import project from JSON file
     */
    importProjectFromFile(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const projectData = JSON.parse(e.target.result);
                callback(projectData);
            } catch (err) {
                console.error('Failed to parse project file:', err);
                callback(null);
            }
        };
        reader.readAsText(file);
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
