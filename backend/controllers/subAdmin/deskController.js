const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const SubAdmin = require('../../../models/SubAdmin');

const getDesk = AsyncHandler(async (req, res) => {
  const subAdmin = await SubAdmin.findOne({ userId: req.userId });
  
  if (!subAdmin) {
    return ApiResponse.notFound(res, 'Sub-admin not found');
  }

  return ApiResponse.success(res, {
    category: subAdmin.category,
    permissions: subAdmin.permissions,
    isActive: subAdmin.isActive
  });
});

module.exports = { getDesk };
