const permissionsController = require('../controllers/permissionsController');

function normalizeRoute(route, req) {
    let normalized = route;
    
    normalized = normalized.replace(/\/$/, '');
    normalized = normalized.replace(/\/\d+/g, '/:id');
    normalized = normalized.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id');
    
    return normalized;
}

function getFullRoute(req) {
    const baseUrl = req.baseUrl || '';
    const route = req.route ? req.route.path : req.path;
    let fullRoute = baseUrl + route;
    fullRoute = fullRoute.replace(/\/+/g, '/');
    console.log(`🔍 Base URL: ${baseUrl}, Route: ${route}, Full Route: ${fullRoute}`);
    return fullRoute;
}

function findMatchingRoute(method, route, userTypeId, req) {
    const permissions = permissionsController.getPermissions();
    const userPermissions = permissions[userTypeId] || [];
    console.log(`🔍 Looking for: ${method} ${route}`);
    console.log(`📋 Available permissions:`, userPermissions.map(p => `${p.method} ${p.route_pattern}`));
    
    const cleanRoute = route.replace(/\/$/, '');
    console.log(`🧹 Clean route: ${cleanRoute}`);
    
    const directMatch = userPermissions.find(permission => 
        permission.method === method && permission.route_pattern === cleanRoute
    );
    
    if (directMatch) {
        console.log(`  Direct match found: ${method} ${cleanRoute}`);
        return directMatch;
    }
    
    const originalMatch = userPermissions.find(permission => 
        permission.method === method && permission.route_pattern === route
    );
    
    if (originalMatch) {
        console.log(`  Original match found: ${method} ${route}`);
        return originalMatch;
    }
    
    const normalizedRoute = normalizeRoute(route, req);
    console.log(`  Normalized route: ${normalizedRoute}`);
    
    const normalizedMatch = userPermissions.find(permission => 
        permission.method === method && permission.route_pattern === normalizedRoute
    );
    
    if (normalizedMatch) {
        console.log(`  Normalized match found: ${method} ${normalizedRoute}`);
        return normalizedMatch;
    }
    
    console.log(`❌ No match found for: ${method} ${route}`);
    return null;
}

function checkOwnership(req, permission) {
    if (!permission.requires_ownership) {
        return true;
    }
    
    const userId = req.user.id;
    const resourceId = req.params.id;
    
    if (!resourceId) {
        return true;
    }
    
    return true;
}

function authorization(req, res, next) {
    try {
        if (!req.user) {
            const error = new Error('User not authenticated');
            error.status = 401;
            return next(error);
        }
        
        const method = req.method;
        const route = getFullRoute(req);
        const userTypeId = req.user.role === 'admin' ? 1 : 
                          req.user.role === 'teacher' ? 2 : 
                          req.user.role === 'student' ? 3 : null;
        
        console.log(`🔍 Authorization check: ${method} ${route} for user type ${userTypeId}`);
        
        if (!userTypeId) {
            const error = new Error('Invalid user type');
            error.status = 403;
            return next(error);
        }
        
        const matchingPermission = findMatchingRoute(method, route, userTypeId, req);
        
        if (!matchingPermission) {
            console.log(`❌ No permission found for: ${method} ${route}`);
            const error = new Error('Access denied - insufficient permissions');
            error.status = 403;
            return next(error);
        }
        
        if (!checkOwnership(req, matchingPermission)) {
            console.log(`❌ Ownership check failed for: ${method} ${route}`);
            const error = new Error('Access denied - resource ownership required');
            error.status = 403;
            return next(error);
        }
        
        console.log(`  Authorization successful for: ${method} ${route}`);
        next();
        
    } catch (error) {
        console.error('❌ Authorization error:', error);
        error.status = 500;
        next(error);
    }
}

module.exports = authorization;
