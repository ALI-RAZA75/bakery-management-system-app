const userRoleModel = require('../models/userRoleModel')

const getUserRole = async (req, res) => {
    try {
      const usersRole = await userRoleModel.getAllUserRole();
      res.status(200).json(usersRole);
    } catch (error) {
      console.error('Error fetching usersRole:', error);
      res.status(500).json({ message: 'Error fetching usersRole', error: error.message });
    }
  };

  const getUserRoleById = async (req, res) => {
    try {
      const userRoleId = parseInt(req.params.id, 10);
  
      if (isNaN(userRoleId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const usersRole = await userRoleModel.getUserRoleById(userRoleId);
      if (!usersRole) {
        return res.status(404).json({ message: 'User role not found' });
      }
      res.status(200).json(usersRole);
    } catch (error) {
      console.error('Error fetching user Role:', error);
      res.status(500).json({ message: 'Error fetching user Role', error: error.message });
    }
  };


  const createUserRole = async (req, res) => {
    try {
      const { userRole, accessLevels } = req.body;
      const newUserRole = await userRoleModel.createUserRole({
        userRole,
        accessLevels,
      });
      res.status(201).json({ message: 'User Role created successfully', newUserRole });
    } catch (error) {
      console.error('Error creating user Role:', error);
      res.status(500).json({ message: 'Error creating user Role', error: error.message });
    }
  };

  const updateUserRole = async (req, res) => {
    try {
      const updatedUserRole = await userRoleModel.updateUserRole(req.params.id, req.body);
      res.status(200).json({ message: 'User Role updated successfully', updatedUserRole });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };

  const deleteUserRole = async (req, res) => {
    try {
      await userRoleModel.deleteUserRole(req.params.id);
      res.status(200).json({ message: 'User Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting user Role:', error);
      res.status(500).json({ message: 'Error deleting user Role', error: error.message });
    }
  };

  module.exports = {
    getUserRole,
    getUserRoleById,
    createUserRole,
    updateUserRole,
    deleteUserRole,
  };