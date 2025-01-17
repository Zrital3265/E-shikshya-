import ChartData from '../models/chartModel';

export const getChartData = async (req, res) => {
  try {
    const chartData = await ChartData.find(); // Fetch data from the database
    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};