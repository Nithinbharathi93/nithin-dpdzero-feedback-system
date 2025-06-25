import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartData = ({ dataSet }) => {
  const reverseMap = {
    '-1': 'negative',
    '0': 'neutral',
    '1': 'positive'
  };

  const labels = dataSet.data.map(d => d.label);
  const trendValues = dataSet.data.map(d => {
    if (typeof d.fdtrend === 'number') return d.fdtrend;
    return {
      negative: -1,
      neutral: 0,
      positive: 1
    }[d.fdtrend];
  });

  const data = {
    labels,
    datasets: [
      {
        label: `${dataSet.name}'s Sentiment Trend`,
        data: trendValues,
        fill: false,
        backgroundColor: 'rgba(51, 42, 175, 0.2)',
        borderColor: 'rgb(51, 42, 175)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Sentiment Trend Chart",
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          callback: val => {
            if (val === 1) return 'positive';
            if (val === 0) return 'neutral';
            if (val === -1) return 'negative';
          }
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default ChartData;
