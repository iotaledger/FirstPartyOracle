import React, { useContext } from 'react';
import { Form, Input, Space, Divider } from 'antd';
import randomstring from 'randomstring';
import { AppContext } from '../context/globalState';
import { Layout } from '../components';

const Config1 = ({ history }) => {
	const { currentConfig, updateConfig } = useContext(AppContext);
	const [form] = Form.useForm();

	const onSubmit = values => {
		if (values.id && values.node) {
			currentConfig.node_config.id = values.id;
			currentConfig.node_config.node = values.node;
			updateConfig(currentConfig);
		}
		history.push('/oracle/2');
	};

	return (
		<Layout>
			<div className='form-wrapper'>
				<div className='form-info-wrapper'>
					<Space direction='vertical' align='center'>
						<p className='small'>STEP 1 OF 4</p>
						<h1>Enter Oracle ID and node URL</h1>
						<p>
							An oracle container can host multiple oracles simultaneously, so a unique identifier will be required for each spawned instance. This instance will also need to know which IOTA nodes to be connected to.
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
						id: randomstring.generate(7),
						node: 'https://nodes.iota.org:443'
					}}
					hideRequiredMark>
					<div className='input-wrapper'>
						<Form.Item
							name='id'
							label='Oracle ID'
							required
							hasFeedback
							rules={[
								{
									required: true,
									message: 'Please provide the Oracle ID'
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
									message: 'Please provide the Node URL!'
								}
							]}>
							<Input className='rounded-input' />
						</Form.Item>
					</div>
					<Divider />
					<div className='btns-wrapper'>
						<Space size='middle'>
							<button onClick={() => history.push('/oracle')} className='custom-button-2'>
								Back
							</button>
							<button className='custom-button' type='submit'>
								Continue
							</button>
						</Space>
					</div>
				</Form>
			</div>
		</Layout>
	);
};

export default Config1;
