const permissionsService = require('../services/permissionsService');

let permissionsCache = {};
let lastUpdated = null;

async function loadPermissions() {
    try {  
        console.log('🔄 Loading permissions from database...');
        const permissionsData = await permissionsService.loadPermissionsFromDB();
        permissionsCache = {};
        
        permissionsData.forEach(row => {
            const { type_id, method, route_pattern, requires_ownership } = row;
            
            if (!permissionsCache[type_id]) {
                permissionsCache[type_id] = [];
            }
            
            permissionsCache[type_id].push({
                method,
                route_pattern,
                requires_ownership: requires_ownership === 1
            });
        });
        
        lastUpdated = new Date();
        console.log('✅ Permissions loaded successfully:', Object.keys(permissionsCache));
        
        // הדפסת כל ההרשאות לדיבוג
        Object.keys(permissionsCache).forEach(typeId => {
            console.log(`📋 Type ${typeId} permissions:`, 
                permissionsCache[typeId].map(p => `${p.method} ${p.route_pattern}`)
            );
        });
        
    } catch (error) {
        console.error('❌ Error loading permissions:', error);
        throw error;
    }
}

function checkPermission(userTypeId, method, route) {
    const key = `${method}:${route}`;
    const userPermissions = permissionsCache[userTypeId];
    
    if (!userPermissions) {
        return { hasPermission: false };
    }
    
    const permission = userPermissions[key];
    
    if (!permission) {
        return { hasPermission: false };
    }
    
    if (permission === true) {
        return { hasPermission: true, requiresOwnership: false };
    }
    
    if (permission.requiresOwnership) {
        return { hasPermission: true, requiresOwnership: true };
    }
    
    return { hasPermission: false };
}

function getPermissions() {
    return permissionsCache;
}

// הוספת פונקציה לטעינה מחדש
async function reloadPermissions() {
    try {
        await loadPermissions();
        return { success: true, message: 'Permissions reloaded successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function startWeeklyUpdate() {
    const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    
    setInterval(async () => {
        console.log('📅 Weekly permissions update started...');
        try {
            await loadPermissions();
        } catch (error) {
            console.error('❌ Weekly update failed:', error);
        }
    }, WEEK_IN_MS);    
}

module.exports = {
    loadPermissions,
    reloadPermissions, // הוספה
    checkPermission,
    getPermissions,
    startWeeklyUpdate,
    getCache: () => permissionsCache,
    getLastUpdated: () => lastUpdated
};
