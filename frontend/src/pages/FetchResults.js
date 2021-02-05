import React, { useContext, useState, useEffect } from 'react';
import { Space, Divider, Card, Col, Row, Button } from 'antd';
import fetch from 'node-fetch';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/globalState';
import { Layout, Loading } from '../components';
import backBtn from '../assets/back-btn.svg';

const FetchResults = () => {
	let history = useHistory();
	const { retrieverId } = useParams();
	const { retrievers } = useContext(AppContext);
	const existingRetriever = history?.location?.state || null;

	const [retriever, setRetriever] = useState(existingRetriever);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const onLoad = async () => {
			await fetchData();
		}

		onLoad();

		const fetchInterval = setInterval(async () => {
			await fetchData();
		}, 10000); // fetch every 10 seconds

		// Removing the timeout before unmounting the component
		return () => {
			fetchInterval && clearInterval(fetchInterval);
		};

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		try {
			if (!existingRetriever && retrievers.length) {
				const existingRetriever = retrievers.find(item => item.id === retrieverId);
				console.log('Retriever 11', existingRetriever);
				setRetriever(existingRetriever);
			};
		} catch (error) {
			console.error(error);
		}
	}, [retrievers.length]); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchData = async () => {
		try {
			console.log('Fetch');
			const serverAPI = 'http://127.0.0.1:8080/fetch_from_oracle';
			const { id, node, address } = existingRetriever;

			setLoading(true);
			await fetch(serverAPI, {
				method: 'POST',
				body: JSON.stringify({ id, node, address }),
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(messages => {
					if (messages.length) {
						const masked = messages?.[0]?.contents?.masked;
						const decoded = String.fromCharCode.apply(null, masked);
						const message = { 
							messageId: messages?.[0]?.tag, 
							sender: messages?.[0]?.pk,
							content: JSON.parse(decoded)
						};
				  
						setMessages(messages => [...messages, message]);
						console.log('message', message);
					};

					setLoading(false);
				})
				.catch(error => {
					setLoading(false);
					console.log(error);
				})
		} catch (error) {
			setLoading(false);
			console.error(error);
		}
	}

	console.log('messages', messages);

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
						{
							messages.map(msg => (
								<React.Fragment>
									<Space size={100} direction='horizontal'>
										<Space align='start' size={2} direction='vertical'>
											<p>MESSAGE ID</p>
											<b>{msg?.messageId}</b>
										</Space>
										<Space align='start' size={2} direction='vertical'>
											<p>SENDER</p>
											<b>{msg?.sender}</b>
										</Space>
									</Space>
									<div className='wrap'>{msg?.content}</div>
									<Divider />
								</React.Fragment>
							))
						}

					</div>
				</React.Fragment>
			)}
		</Layout>
	);
};

export default FetchResults;
