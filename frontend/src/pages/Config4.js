import React, { useContext } from 'react';
import fetch from 'node-fetch';
import { Space, Divider } from 'antd';
import { AppContext } from '../context/globalState';
import { Layout } from '../components';

const Config4 = ({ history }) => {
	const { currentConfig, oracles, updateItems } = useContext(AppContext);
	const serverAPI = 'http://127.0.0.1:8080/spawn_oracle';

	const spawnOracle = async () => {
		fetch(serverAPI, {
			method: 'POST',
			body: JSON.stringify(currentConfig),
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			}
		})
		.then(async (res) => {
			const response = await res.text();

			const group = response.split(', ').map(entry =>
				entry.replace('pk: ', '').replace('addr: ', '').replace('<', '').replace('>', '')
			);

			const oracle = {
				id: currentConfig.node_config.id,
				node: currentConfig.node_config.node,
				pk: group[0],
				address: group[1]
			};

			await updateItems('oracles', [ ...oracles, oracle ]);

			history.push('/');
		})
		.catch(error => {
			console.log(error);
			history.push('/');
		});
	};

	return (
		<Layout>
			<div className='form-wrapper'>
				<div className='form-info-wrapper'>
					<Space direction='vertical' align='center'>
						<p className='small'>STEP 4 OF 4</p>
						<h1>Launch Oracle</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit
							amet. Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor.
						</p>
					</Space>
				</div>
				<Divider />
				<div className='btns-wrapper'>
					<Space size='middle'>
						<button onClick={() => history.goBack()} className='custom-button-2'>
							Back
						</button>
						<button className='custom-button' onClick={() => spawnOracle()}>
							Launch Oracle
						</button>
					</Space>
				</div>
			</div>
		</Layout>
	);
};

export default Config4;
