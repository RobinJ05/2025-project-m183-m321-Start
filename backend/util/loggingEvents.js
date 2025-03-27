const axios = require('axios');

const LOG_EVENT_API = 'http://localhost:3001/api/logevent';

/**
 * Logs the creation of a new mountain
 * @param {Object} mountainData - The mountain data to log
 * @param {string} mountainData.name - Name of the mountain
 * @param {number} mountainData.el - Altitude above sea level
 * @param {boolean} mountainData.mountainrailway - Mountain railway availability
 */
async function addMountainLog(mountainData) {
    try {
        const logData = {
            eventType: 'Add',
            name: mountainData.name,
            altitude: mountainData.el,
            mountainRailway: mountainData.mountainrailway,
            timestamp: new Date().toISOString()
        };

        await axios.post(`${LOG_EVENT_API}/add`, logData);
    } catch (error) {
        console.error('Error logging mountain creation:', error.message);
    }
}

/**
 * Logs the editing of a mountain
 * @param {Object} mountainData - The mountain data to log
 * @param {string} mountainData.name - Name of the mountain
 * @param {number} mountainData.el - Altitude above sea level
 * @param {boolean} mountainData.mountainrailway - Mountain railway availability
 */
async function editMountainLog(mountainData) {
    try {
        const logData = {
            eventType: 'Edit',
            name: mountainData.name,
            altitude: mountainData.el,
            mountainRailway: mountainData.mountainrailway,
            timestamp: new Date().toISOString()
        };

        await axios.post(`${LOG_EVENT_API}/edit`, logData);
    } catch (error) {
        console.error('Error logging mountain edit:', error.message);
    }
}

/**
 * Logs the deletion of a mountain
 * @param {Object} mountainData - The mountain data to log
 * @param {string} mountainData.name - Name of the mountain
 * @param {number} mountainData.el - Altitude above sea level
 * @param {boolean} mountainData.mountainrailway - Mountain railway availability
 */
async function deleteMountainLog(mountainData) {
    try {
        const logData = {
            eventType: 'Delete',
            name: mountainData.name,
            altitude: mountainData.el,
            mountainRailway: mountainData.mountainrailway,
            timestamp: new Date().toISOString()
        };

        await axios.post(`${LOG_EVENT_API}/delete`, logData);
    } catch (error) {
        console.error('Error logging mountain deletion:', error.message);
    }
}

module.exports = {
    addMountainLog,
    editMountainLog,
    deleteMountainLog
};