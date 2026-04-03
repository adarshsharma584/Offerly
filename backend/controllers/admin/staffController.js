const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const User = require('../../../models/User');
const SubAdmin = require('../../../models/SubAdmin');

const getStaff = AsyncHandler(async (req, res) => {
  const staff = await SubAdmin.find()
    .populate('userId', 'name phone email')
    .populate('createdBy', 'name')
    .sort('-createdAt');

  return ApiResponse.success(res, staff);
});

const createStaff = AsyncHandler(async (req, res) => {
  const { phone, name, email, category } = req.body;

  // Find or create user
  let user = await User.findOne({ phone });
  
  if (!user) {
    user = new User({
      name,
      phone,
      email,
      role: 'sub_admin'
    });
    await user.save();
  } else {
    user.role = 'sub_admin';
    await user.save();
  }

  // Create sub-admin record
  const subAdmin = new SubAdmin({
    userId: user._id,
    category,
    createdBy: req.userId
  });
  await subAdmin.save();

  return ApiResponse.created(res, subAdmin, 'Staff created successfully');
});

const updateStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, isActive } = req.body;

  const subAdmin = await SubAdmin.findByIdAndUpdate(
    id,
    { category, isActive },
    { new: true, runValidators: true }
  );

  if (!subAdmin) {
    return ApiResponse.notFound(res, 'Staff not found');
  }

  return ApiResponse.success(res, subAdmin, 'Staff updated successfully');
});

const deleteStaff = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const subAdmin = await SubAdmin.findById(id);
  if (!subAdmin) {
    return ApiResponse.notFound(res, 'Staff not found');
  }

  // Update user role
  await User.findByIdAndUpdate(subAdmin.userId, { role: 'user' });
  
  // Delete sub-admin record
  await SubAdmin.findByIdAndDelete(id);

  return ApiResponse.success(res, null, 'Staff removed successfully');
});

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
};
