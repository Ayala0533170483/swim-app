const genericService = require('../services/genericService');
const { deleteOldImage } = require('../services/fileService');

async function getBranches(filters = {}) {
    try {
        console.log('getBranches called with filters:', filters); 
        const branches = await genericService.get('pools', filters);
        console.log('getBranches result:', branches); 
        return branches;
    } catch (error) {
        console.error('Error getting branches:', error);
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
        return newBranch;
    } catch (error) {
        console.error('Error creating branch:', error);

        if (imageFile) {
            deleteOldImage(imageFile.filename);
        }

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
            updateData.image_path = imageFile.filename;
            if (oldImagePath) {
                deleteOldImage(oldImagePath);
            }
        }

        const actualId = pool_id || id;
        console.log('Using ID:', actualId, 'Update data:', updateData);
        const updatedBranch = await genericService.update('pools', actualId, updateData);
        console.log('Updated branch result:', updatedBranch);

        return updatedBranch;
    } catch (error) {
        console.error('Error updating branch:', error);
        if (imageFile) {
            deleteOldImage(imageFile.filename);
        }

        throw error;
    }
}

// פונקציה למחיקה (soft delete)
async function deleteBranch(id) {
    try {
        console.log('Deleting branch with ID:', id);

        // קבל את הנתונים לפני המחיקה כדי למחוק את התמונה
        const branch = await genericService.get('pools', { pool_id: id });
        const imagePath = branch[0]?.image_path;

        const result = await genericService.remove('pools', id);
        console.log('Delete result:', result);

        if (result) {
            // מחק את התמונה מהשרת
            if (imagePath) {
                deleteOldImage(imagePath);
            }

            return { message: 'Branch deleted successfully' };
        } else {
            throw new Error('Branch not found or already deleted');
        }
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
