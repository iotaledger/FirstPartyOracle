import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Space, Tabs } from 'antd';
import { AppContext } from '../context/globalState';
import { Layout } from '../components';
import banner from '../assets/smart-contracts.svg';

const { TabPane } = Tabs;

const Config = () => {
	const { oracles, retrievers } = useContext(AppContext);

	useEffect(() => {
		const onLoad = async () => {
			await localStorage.removeItem('config');
		}
		onLoad();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	console.log(oracles, retrievers);

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
						<div className='oracle-card-wrapper'>
							<Space size='middle' direction='horizontal'>
								<div>
									<h1>Create an Oracle</h1>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum
										dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor.
									</p>
								</div>
								<Space size='middle'>
									<Link to={'/oracle/1'}>
										<button className='custom-button'>Create Oracle</button>
									</Link>
								</Space>
							</Space>
						</div>
					</TabPane>
					<TabPane tab='Retrievers' key='2'>
						<div className='oracle-card-wrapper'>
							<Space size='middle' direction='horizontal'>
								<div>
									<h1>Create a Retriever</h1>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum
										dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor.
									</p>
								</div>
								<Space size='middle'>
									<Link to={'/retriever'}>
										<button className='custom-button'>Create Retriever</button>
									</Link>
								</Space>
							</Space>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</Layout>
	);
};

export default Config;
