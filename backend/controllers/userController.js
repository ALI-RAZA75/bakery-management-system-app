const userModel = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const getUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
  
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const user = await userModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  };
  

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, contactNumber, remarks } = req.body;
    const newUser = await userModel.createUser({
      firstName,
      lastName,
      email,
      password,
      role,
      contactNumber,
      remarks,
    });
    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
    try {
      const updatedUser = await userModel.updateUser(req.params.id, req.body);
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };


  const deleteUser = async (req, res) => {
    try {
      await userModel.deleteUser(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  };
  

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
