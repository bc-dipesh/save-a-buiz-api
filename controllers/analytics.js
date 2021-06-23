import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/Fundraiser.js';
import User from '../models/User.js';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @desc    Get application analytics
 * @route   GET /api/v1/analytics
 * @access  Private/Admin
 */
const gatherAnalytics = asyncHandler(async (req, res) => {
  const completedFundraiserCount = await Fundraiser.countDocuments({ isGoalCompleted: true });
  const fundraisers = await Fundraiser.find({});
  const users = await User.find({});

  // users and fundraiser
  const userRegisteredToday = users.filter(
    (user) => new Date(user.createdAt).getDate() === new Date().getDate()
  ).length;

  const fundraiserCreatedToday = fundraisers.filter(
    (fundraiser) => new Date(fundraiser.createdAt).getDate() === new Date().getDate()
  ).length;

  const usersCount = users.length;
  const fundraisersCount = fundraisers.length;

  // donations
  const donations = fundraisers.map((fundraiser) => fundraiser.donations).flat(2);

  const averageFundraiserDonations =
    fundraisers
      .map((fundraiser) => fundraiser.donations.length)
      .reduce((accumulator, value) => accumulator + value, 0) / fundraisers.length;

  const monthlyDonations = [];
  for (let i = 0; i < 12; i += 1) {
    let donationCount = 0;

    donations.forEach((donation) => {
      const month = new Date(donation.createdAt).getMonth();

      if (month === i) {
        donationCount += 1;
      }
    });

    const month = months[i];
    monthlyDonations.push({ month, donationCount });
  }

  res.status(200).json({
    success: true,
    data: {
      usersCount,
      fundraisersCount,
      completedFundraiserCount,
      fundraiserCreatedToday,
      userRegisteredToday,
      averageFundraiserDonations,
      monthlyDonations,
    },
  });
});

export default gatherAnalytics;
