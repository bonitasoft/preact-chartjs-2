import { h } from 'preact';
import 'preact-chartjs-2/component';

const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};

const PieExample = () => {

    return (
      <div >
        <h2>Pie Example</h2>
        <pie-chart
          style={{display: 'block'}}
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              position: 'left'
            }
          }}
        />
      </div>
    );
};

export default PieExample;
