import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Analytics from './models/Analytics.js';
import Fundraiser from './models/Fundraiser.js';
import User from './models/User.js';
import analytics from './_data/analytics.js';
import fundraisers from './_data/fundraisers.js';
import users from './_data/users.js';

dotenv.config({ path: './config/.env' });

connectDB();
const OPTION_DELETE = '-d';

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Fundraiser.deleteMany();
    await Analytics.deleteMany();

    console.log('Data destroyed successfully');

    if (process.argv[2] === OPTION_DELETE) {
      process.exit();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    destroyData();
    await User.insertMany(users);
    await Fundraiser.insertMany(fundraisers);
    await Analytics.insertMany(analytics);

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === OPTION_DELETE) {
  destroyData();
} else {
  importData();
}
