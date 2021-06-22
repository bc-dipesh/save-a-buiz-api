import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/Fundraiser.js';
import User from '../models/User.js';

/**
 * @desc    Get application analytics
 * @route   GET /api/v1/analytics
 * @access  Private/Admin
 */
const gatherAnalytics = asyncHandler(async (req, res) => {
  const completedFundraiserCount = await Fundraiser.countDocuments({ isGoalCompleted: true });
  const fundraisers = await Fundraiser.find({});
  const users = await User.find({});

  const userRegisteredToday = users.filter(
    (user) => new Date(user.createdAt).getDate() === new Date().getDate()
  ).length;

  const fundraiserCreatedToday = fundraisers.filter(
    (fundraiser) => new Date(fundraiser.createdAt).getDate() === new Date().getDate()
  ).length;

  // const donationsData = [
  //   {
  //     name: 'January',
  //     donations: 0,
  //   },
  //   {
  //     name: 'February',
  //     donations: 0,
  //   },
  //   {
  //     name: 'March',
  //     donations: 0,
  //   },
  //   {
  //     name: 'April',
  //     donations: 0,
  //   },
  //   {
  //     name: 'May',
  //     donations: 0,
  //   },
  //   {
  //     name: 'June',
  //     donations: 0,
  //   },
  //   {
  //     name: 'July',
  //     donations: 0,
  //   },
  //   {
  //     name: 'August',
  //     donations: 0,
  //   },
  //   {
  //     name: 'September',
  //     donations: 0,
  //   },
  //   {
  //     name: 'October',
  //     donations: 0,
  //   },
  //   {
  //     name: 'November',
  //     donations: 0,
  //   },
  //   {
  //     name: 'December',
  //     donations: 0,
  //   },
  // ];

  const usersCount = users.length;
  const fundraisersCount = fundraisers.length;

  res.status(200).json({
    success: true,
    data: {
      usersCount,
      fundraisersCount,
      completedFundraiserCount,
      fundraiserCreatedToday,
      userRegisteredToday,
    },
  });
});

export default gatherAnalytics;
