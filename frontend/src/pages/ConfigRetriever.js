import React from 'react';
import fetch from 'node-fetch';
import randomstring from 'randomstring';
import { Form, Input, Space, Divider } from 'antd';
import { Layout } from '../components';

const ConfigRetriever = ({ history }) => {
	const [form] = Form.useForm();

	const serverAPI = 'http://127.0.0.1:8080/fetch_from_oracle';

	const data = {
		id: randomstring.generate(),
		node: 'https://nodes.thetangle.org:443',
		address: 'a2d1838abeea5fd161eae4f4bb4f902d267ded343b1facc7d25426734ea11e420000000000000000:ac6f6ab9c38e652c80deb9e5'
	};

	const onSubmit = async values => {
		localStorage.setItem('retriever', data);
		// if (values.id && values.node && values.address) {
		// 	data.id = values.id;
		// 	data.node = values.node;
		// 	data.address = values.address;
		// }
		await fetch(serverAPI, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(json => {
				console.log('json', json);
				const masked = json?.[0]?.contents?.masked;
				const decoded = String.fromCharCode.apply(null, masked);
				localStorage.setItem('message', JSON.stringify(json?.[0]));
				localStorage.setItem('decodedMessage', decoded);
				const decodedJson = JSON.parse(decoded);
				console.log('decodedJson', decodedJson);
				return decodedJson;
			});

		history.push('/');
	};

	return (
		<Layout>
			<div className='form-wrapper'>
				<div className='form-info-wrapper'>
					<Space direction='vertical' align='center'>
						<p className='small'>STEP 1 OF 1</p>
						<h1>Enter retriever details</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit
							amet. Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor.
						</p>
					</Space>
				</div>
				<Divider />
				<Form
					form={form}
					layout='vertical'
					scrollToFirstError
					colon={false}
					name='oracle-form'
					onFinish={onSubmit}
					validateTrigger='onSubmit'
					onKeyDown={e => (e.key === 'Enter' ? e.preventDefault() : '')}
					initialValues={{
						id: 1,
						node: 'https://nodes.iota.org:443'
					}}
					hideRequiredMark>
					<div className='input-wrapper'>
						<Form.Item
							name='id'
							label='Retriever ID'
							required
							hasFeedback
							rules={[
								{
									required: true,
									message: 'This field is required!'
								}
							]}>
							<Input className='rounded-input' />
						</Form.Item>
						<Form.Item
							name='node'
							label='Node'
							required
							hasFeedback
							rules={[
								{
									required: true,
									message: 'This field is required!'
								}
							]}>
							<Input className='rounded-input' />
						</Form.Item>
						<Form.Item
							name='address'
							label='Endpoint'
							required
							hasFeedback
							rules={[
								{
									required: true,
									message: 'This field is required!'
								}
							]}>
							<Input className='rounded-input' />
						</Form.Item>
					</div>

					<Divider />
					<div className='btns-wrapper'>
						<Space size='middle'>
							<button onClick={() => history.goBack()} className='custom-button-2'>
								Back
							</button>
							<button className='custom-button' type='submit'>
								Launch retriever
							</button>
						</Space>
					</div>
				</Form>
			</div>
		</Layout>
	);
};

export default ConfigRetriever;
