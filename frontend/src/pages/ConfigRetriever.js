import React, { useContext, useState } from 'react';
import randomstring from 'randomstring';
import { useHistory } from 'react-router-dom';
import { Form, Input, Space, Divider } from 'antd';
import { AppContext } from '../context/globalState';
import { Layout } from '../components';

const ConfigRetriever = () => {
	let history = useHistory();
	const { retrievers, updateItems } = useContext(AppContext);
	const existingRetriever = history?.location?.state || { 
		id: randomstring.generate(7),
		node: 'https://nodes.iota.org:443'
	}
	const [retriever, setRetriever] = useState(existingRetriever);
	const [form] = Form.useForm();

	const onSubmit = async values => {
		const data = {};
		if (values.id && values.node && values.address) {
			data.id = values.id;
			data.node = values.node;
			data.address = values.address;
		}

		setRetriever(data);
		const existing = retrievers.find(item => item.id === existingRetriever.id);
		if (existing) {
			const updatedList = retrievers;
			updatedList.forEach(item => {
				if (item.id === existingRetriever.id) {
					item.id = data.id;
					item.node = data.node;
					item.address = data.address;
				} 
			});
			await updateItems('retrievers', updatedList);
		} else {
			await updateItems('retrievers', [ ...retrievers, data ]);
		}

		history.push(`/fetch/${data.id}`, data);
	};

	return (
		<Layout>
			<div className='form-wrapper'>
				<div className='form-info-wrapper'>
					<Space direction='vertical' align='center'>
						<p className='small'>STEP 1 OF 1</p>
						<h1>Enter retriever details</h1>
						<p>
							An oracle container can host multiple retrievers simultaneously, so a unique identifier will be required for each spawned instance. A retriever will keep track of it’s fetching state, so once data has been retrieved, it should be stored or used at that time. This instance will also need to know which IOTA nodes to be connected to.
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
						id: retriever?.id,
						node: retriever?.node,
						address: retriever?.address || null
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
							label='Address'
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
							<button onClick={() => history.push('/')} className='custom-button-2'>
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
