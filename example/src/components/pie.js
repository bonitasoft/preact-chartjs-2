import { h } from 'preact';
import {Pie} from 'preact-chartjs-2';

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
      <div>
        <h2>Pie Example</h2>
        <Pie data={data} />
      </div>
    );
};

export default PieExample;
