/**
 * Export Log Module
 * Handles logging of export activities for the Grup Generator
 */

const exportLog = {
    /**
     * Log an export activity
     * @param {string} exportType - Type of export (PDF, Excel, Print)
     * @param {string} tournamentName - Name of the tournament
     * @param {Object} userData - Optional user data (name, whatsapp, email)
     */
    logExport: function(exportType, tournamentName, userData = {}) {
        // Create log entry
        const logEntry = {
            timestamp: new Date().toISOString(),
            exportType: exportType,
            tournamentName: tournamentName,
            userData: userData,
            groupCount: groups ? groups.length : 0,
            teamCount: teams ? teams.length : 0
        };
        
        // Get existing logs from localStorage
        let logs = JSON.parse(localStorage.getItem('exportLogs') || '[]');
        
        // Add new log entry
        logs.push(logEntry);
        
        // Save back to localStorage (limited to last 100 entries)
        if (logs.length > 100) {
            logs = logs.slice(-100);
        }
        localStorage.setItem('exportLogs', JSON.stringify(logs));
        
        console.log('Export logged:', logEntry);
        return logEntry;
    },
    
    /**
     * Get all export logs
     * @returns {Array} Array of log entries
     */
    getLogs: function() {
        return JSON.parse(localStorage.getItem('exportLogs') || '[]');
    },
    
    /**
     * Clear all export logs
     */
    clearLogs: function() {
        localStorage.removeItem('exportLogs');
        console.log('Export logs cleared');
    }
};