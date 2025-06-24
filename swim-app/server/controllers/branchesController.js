const genericService = require('../services/genericService');
const { deleteOldImage } = require('../services/fileService');
const { log } = require('../utils/logger');

async function getBranches(filters = {}) {
    try {
        const branches = await genericService.get('pools', filters);
        return branches;
    } catch (error) {
        throw error;
    }
}

async function createBranch(branchData, imageFile) {
    try {
        if (!branchData.name || !branchData.city) {
            throw new Error('Name and city are required');
        }

        if (!imageFile) {
            throw new Error('Image is required');
        }

        branchData.image_path = `uploads/pools/${imageFile.filename}`;

        const newBranch = await genericService.create('pools', branchData);

        log('Branch created successfully', { branchId: newBranch.pool_id, name: branchData.name, city: branchData.city });

        return newBranch;
    } catch (error) {
        console.error('Error creating branch:', error);

        if (imageFile) {
            deleteOldImage(imageFile.filename);
        }

        log('Failed to create branch', { name: branchData.name, city: branchData.city, error: error.message });

        throw error;
    }
}

async function updateBranch(id, branchData, imageFile) {
    try {
        console.log('Updating branch with ID:', id, 'Data:', branchData);

        const { pool_id, id: itemId, ...updateData } = branchData;

        if (imageFile) {
            const oldBranch = await genericService.get('pools', { pool_id: id });
            const oldImagePath = oldBranch[0]?.image_path;
            updateData.image_path = `uploads/pools/${imageFile.filename}`;
            if (oldImagePath) {
                deleteOldImage(oldImagePath);
            }
        }

        const actualId = pool_id || id;
        const updatedBranch = await genericService.update('pools', actualId, updateData);

        log('Branch updated successfully', { branchId: actualId, updatedFields: Object.keys(updateData) });

        return updatedBranch;
    } catch (error) {
        if (imageFile) {
            deleteOldImage(imageFile.filename);
        }

        log('Failed to update branch', { branchId: id, error: error.message });

        throw error;
    }
}


async function deleteBranch(id) {
    try {
        console.log('Deleting branch with ID:', id);

        const branch = await genericService.get('pools', { pool_id: id });
        const imagePath = branch[0]?.image_path;

        const result = await genericService.remove('pools', id);

        if (result) {
            if (imagePath) {
                deleteOldImage(imagePath);
            }

            log('Branch deleted successfully', { branchId: id, imagePath: imagePath });

            return { message: 'Branch deleted successfully' };
        } else {
            throw new Error('Branch not found or already deleted');
        }
    } catch (error) {
        console.error('Error deleting branch:', error);

        log('Failed to delete branch', { branchId: id, error: error.message });

        throw error;
    }
}

module.exports = {
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch
};
