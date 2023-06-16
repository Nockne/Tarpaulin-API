const { User } = require('../models/user');

async function checkUserRole(userId, requiredRole) {
  try {
    const user = await User.findByPk(userId);
    if (user && user.role === requiredRole) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

module.exports = checkUserRole;
