import dotenv from 'dotenv';
import users from './data/users.js';
import fundraisers from './data/fundraisers.js';
import User from './models/userModel.js';
import Fundraiser from './models/fundraiserModel.js';
import connectDB from './config/db.js';

dotenv.config({ path: './backend/config/.env' });

connectDB();
const OPTION_DELETE = '-d';

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Fundraiser.deleteMany();

    console.log('Data destroyed successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    destroyData();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleFundraisers = fundraisers.map((fundraiser) => {
      const { description } = fundraiser;
      const shortDescription = description.substring(
        0,
        description.length / 2,
      );
      return { ...fundraiser, shortDescription, organizer: adminUser };
    });

    await Fundraiser.insertMany(sampleFundraisers);

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
