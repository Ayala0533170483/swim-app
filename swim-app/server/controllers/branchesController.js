const genericService = require('../services/genericService');

// פונקציה להביא את כל הבריכות
async function getBranches(filters = {}) {
    try {
        // קוראים לטבלת pools (זה השם האמיתי בDB)
        const branches = await genericService.get('pools', filters);
        return branches;
    } catch (error) {
        console.error('Error getting branches:', error);
        throw error;
    }
}

// פונקציה ליצור בריכה חדשה
async function createBranch(branchData) {
    try {
        // ולידציה בסיסית
        if (!branchData.name || !branchData.city) {
            throw new Error('Name and city are required');
        }

        const newBranch = await genericService.create('pools', branchData);
        return newBranch;
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
}

// פונקציה לעדכון בריכה
async function updateBranch(id, branchData) {
    try {
        const updatedBranch = await genericService.update('pools', id, branchData);
        return updatedBranch;
    } catch (error) {
        console.error('Error updating branch:', error);
        throw error;
    }
}

// פונקציה למחיקה (soft delete)
async function deleteBranch(id) {
    try {
        await genericService.remove('pools', id);
        return { message: 'Branch deleted successfully' };
    } catch (error) {
        console.error('Error deleting branch:', error);
        throw error;
    }
}

module.exports = {
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch
};
