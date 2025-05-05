const Student = require('../model/student_model');

// Helper functions for common operations
const handleServerError = (res, error, message = 'Server error') => {
  console.error(`Error: ${message}:`, error);
  res.status(500).json({ 
    message,
    error: error.message,
    stack: undefined
  });
};

// Validate required student fields
const validateRequiredFields = (req) => {
  const { studentId, firstName, lastName, program, year, section } = req.body;
  const missing = !studentId || !firstName || !lastName || !program || !year || !section;
  
  return {
    isValid: !missing,
    requiredFields: {
      studentId: !!studentId,
      firstName: !!firstName,
      lastName: !!lastName,
      program: !!program,
      year: !!year,
      section: !!section
    }
  };
};

// Create a new student profile
exports.createStudentProfile = async (req, res) => {
  try {
    const { 
      studentId,
      firstName,
      middleName,
      lastName, 
      program, 
      year, 
      section, 
      dateOfBirth, 
      contactNumber, 
      address 
    } = req.body;
    
    // Validate required fields
    const validation = validateRequiredFields(req);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: validation.requiredFields
      });
    }
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student profile already exists' });
    }
    
    // Create new student profile
    const student = new Student({
      studentId,
      firstName,
      middleName: middleName || '',
      lastName,
      program,
      year: Number(year),
      section,
      dateOfBirth,
      contactNumber: contactNumber || '',
      address: address || ''
    });
    
    await student.save();
    
    res.status(201).json({ 
      message: 'Student profile created successfully',
      student
    });
  } catch (error) {
    handleServerError(res, error, 'Error creating student profile');
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    handleServerError(res, error, 'Error fetching student profile');
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = { ...req.body };
    
    // Prevent changing studentId
    delete updateData.studentId;
    
    const student = await Student.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json({ 
      message: 'Student profile updated successfully',
      student
    });
  } catch (error) {
    handleServerError(res, error, 'Error updating student profile');
  }
};

// Delete student profile
exports.deleteStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await Student.findOneAndDelete({ studentId });
    
    if (!result) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json({ 
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    handleServerError(res, error, 'Error deleting student profile');
  }
};

// Get all student profiles
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    handleServerError(res, error, 'Error fetching student profiles');
  }
};
