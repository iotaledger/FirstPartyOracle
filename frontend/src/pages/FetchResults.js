import React, { useState, useEffect } from 'react';
import { Space, Divider, Card, Col, Row, Button } from 'antd';
import { Layout, Loading } from '../components';
import backBtn from '../assets/back-btn.svg';

const ConfigOverview = ({ history }) => {
	const [retriever, setRetriever] = useState({});
	const [message, setMessage] = useState({});
	const [decodedMessage, setDecodedMessage] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getData() {
			let retriever = await JSON.parse(localStorage.getItem('retriever'));
			let message = await JSON.parse(localStorage.getItem('message'));
			let decodedMessage = await JSON.parse(localStorage.getItem('decodedMessage'));
			if (retriever && message && decodedMessage) {
				setRetriever(retriever);
				setMessage(message);
				setDecodedMessage(decodedMessage);
				setLoading(false);
			}
		}
		getData();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Layout>
			{loading ? (
				<Loading />
			) : (
				<React.Fragment>
					<Button className='back-btn' onClick={() => history.goBack()}>
						<img src={backBtn} alt='back-btn' className='back-icon' />
					</Button>
					<Row gutter={16}>
						<Col span={8}>
							<Card className='info-card'>
								<Space size={2} direction='vertical'>
									<p>Retriever ID</p>
									<b className='cut-text'>{retriever.id}</b>
								</Space>
							</Card>
						</Col>
						<Col span={8}>
							<Card className='info-card'>
								<Space size={2} direction='vertical'>
									<p>Node ID</p>
									<b>{retriever.node}</b>
								</Space>
							</Card>
						</Col>
						<Col span={8}>
							<Card className='info-card'>
								<Space size={2} direction='vertical'>
									<p>Endpoint</p>
									<b className='cut-text'>{retriever.address}</b>
								</Space>
							</Card>
						</Col>
					</Row>
					<br />
					<div className='form-wrapper'>
						<Space size={100} direction='horizontal'>
							<Space align='start' size={2} direction='vertical'>
								<p>MESSAGE ID</p>
								<b>{message.tag}</b>
							</Space>
							<Space align='start' size={2} direction='vertical'>
								<p>SENDER</p>
								<b>{message.pk}</b>
							</Space>
						</Space>
						<div className='wrap'>{decodedMessage.continuation_token}</div>
						<Divider />
					</div>
				</React.Fragment>
			)}
		</Layout>
	);
};

export default ConfigOverview;
