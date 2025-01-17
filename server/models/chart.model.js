import mongoose from "mongoose"

const chartDataSchema = new mongoose.Schema({
  date: { type: String, required: true },
  desktop: { type: Number, required: true },
  mobile: { type: Number, required: true },
});

export  const ChartData = mongoose.model('ChartData', chartDataSchema);


