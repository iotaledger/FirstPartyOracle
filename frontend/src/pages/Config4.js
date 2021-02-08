import React, { useContext, useState } from 'react';
import fetch from 'node-fetch';
import { Space, Divider, Alert } from 'antd';
import { AppContext } from '../context/globalState';
import { Layout, Loading } from '../components';

const Config4 = ({ history }) => {
	const { currentConfig, oracles, updateItems } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const serverAPI = 'http://127.0.0.1:8080/spawn_oracle';

	const spawnOracle = async () => {
		setLoading(true);
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
			setLoading(false);
			// history.push('/');
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
							Once an Oracle has been launched, it will run with other Oracles in a special container, until that container has been shut down.
							<br />
							Please ensure that you have configured the Oracle properly before launching it.
						</p>
						<div className='alert-wrapper'>
							<Alert
								message='Please disable any Content Blocking plugins on your browser. Otherwise this demo will not work.'
								type='info'
								showIcon
							/>
						</div>
					</Space>
				</div>
				<Divider />
				<div className='btns-wrapper'>
					{loading ? (
						<Loading />
					) : (
						<Space size='middle'>
							<button onClick={() => history.push('/oracle/3')} className='custom-button-2'>
								Back
							</button>
							<button className='custom-button' onClick={() => spawnOracle()}>
								Launch Oracle
							</button>
						</Space>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default Config4;
