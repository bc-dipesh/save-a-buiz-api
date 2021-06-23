import mongoose from 'mongoose';

const AnalyticsSchema = mongoose.Schema(
  {
    month: Number,
    count: Number,
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

export default Analytics;
