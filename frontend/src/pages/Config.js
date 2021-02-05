import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Space, Tabs } from 'antd';
import { Layout, Oracles, Retrievers } from '../components';
import banner from '../assets/smart-contracts.svg';

const { TabPane } = Tabs;

const Config = () => {
	useEffect(() => {
		const onLoad = async () => {
			await localStorage.removeItem('config');
		}
		onLoad();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Layout>
			<div className='intro'>
				<div className='image-wrapper'>
					<img src={banner} alt='banner' className='fpo-intro' />
				</div>
				<br />
				<br />
				<Tabs tabBarGutter={50} centered defaultActiveKey='1'>
					<TabPane tab='Oracles' key='1'>
						<div className="list-items-wrapper">
							<div className='oracle-card-wrapper'>
								<Space size='middle' direction='horizontal'>
									<div>
										<h1>Create an Oracle</h1>
										<p>
											Welcome to the IOTA Oracle Configuration Interface. This process will step you through setting up an IOTA Oracle to publish data onto the IOTA Tangle. Proceed here to set up your oracle, either on a hardware device or by referencing an API.
										</p>
									</div>
									<Space size='middle'>
										<Link to={'/oracle/1'}>
											<button className='custom-button'>Create Oracle</button>
										</Link>
									</Space>
								</Space>
							</div>
							<Oracles />
						</div>
					</TabPane>
					<TabPane tab='Retrievers' key='2'>
						<div className="list-items-wrapper">
							<div className='oracle-card-wrapper'>
								<Space size='middle' direction='horizontal'>
									<div>
										<h1>Create a Retriever</h1>
										<p>
											Welcome to the IOTA Retriever Configuration Interface. 
											This process will use an IOTA Oracle Retriever to pull data from a public IOTA Oracle, 
											and verify the data has been published to the IOTA Tangle. 
											If you intend to use this data in an existing application, 
											please refer to the documentation located 
											<a href='https://github.com/iotaledger/FirstPersonOracle' target='_blank' rel='noopener noreferrer'> here</a>
										</p>
									</div>
									<Space size='middle'>
										<Link to={'/retriever'}>
											<button className='custom-button'>Create Retriever</button>
										</Link>
									</Space>
								</Space>
							</div>
							<Retrievers />
						</div>
					</TabPane>
				</Tabs>
			</div>
		</Layout>
	);
};

export default Config;
