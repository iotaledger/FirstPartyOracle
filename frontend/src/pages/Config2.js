import React, { useContext } from 'react';
import { Form, Input, Space, Divider, Select, Checkbox, Alert } from 'antd';
import { AppContext } from '../context/globalState';
import { Layout } from '../components';

const { Option } = Select;

const Config2 = ({ history }) => {
	const { currentConfig, updateConfig } = useContext(AppContext);
	const [form] = Form.useForm();

	const onSubmit = values => {
		if (values.depth && values.min_weight_magnitude && values.threads) {
			currentConfig.send_options.depth = values.depth;
			currentConfig.send_options.min_weight_magnitude = values.min_weight_magnitude;
			currentConfig.send_options.threads = values.threads;
			updateConfig(currentConfig);
		}
		history.push('/oracle/3');
	};

	return (
		<Layout>
			<div className='form-wrapper'>
				<div className='form-info-wrapper'>
					<Space direction='vertical' align='center'>
						<p className='small'>STEP 2 OF 4</p>
						<h1>Configure send options</h1>
						<p>
							These options are necessary to inform the IOTA Streams client underlying an oracle how to communicate with an IOTA node. The depth refers to how deep the parent transactions will be in the tangle. The Minimum Weight Magnitude is used for proof of work calculations. The threads determine the number of client threads that can be used for asynchronous communication, and the local proof of work determines if Proof of Work will be conducted locally or on the node end.
						</p>
					</Space>
				</div>
				<Divider />
				<div className='alert-wrapper'>
					<Alert
						message='These values are defaults for the mainnet and only need to be changed if operating on a different network with different settings'
						type='info'
						showIcon
					/>
				</div>
				<Form
					form={form}
					layout='vertical'
					scrollToFirstError
					colon={false}
					name='oracle-form-2'
					onFinish={onSubmit}
					validateTrigger='onSubmit'
					onKeyDown={e => (e.key === 'Enter' ? e.preventDefault() : '')}
					initialValues={{
						depth: 1,
						min_weight_magnitude: 14,
						threads: 1
					}}
					hideRequiredMark>
					<div className='input-wrapper'>
						<Form.Item
							name='depth'
							label='Depth'
							required
							hasFeedback
							rules={[
								{
									required: true,
									message: 'This field is required!'
								}
							]}>
							<Select>
								<Option value='1'>1</Option>
								<Option value='2'>2</Option>
								<Option value='3'>3</Option>
								<Option value='4'>4</Option>
							</Select>
						</Form.Item>
						<Form.Item
							name='min_weight_magnitude'
							label='Min Weight Magnitude'
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
							name='threads'
							label='Threads'
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
						<Form.Item name='local-pow'>
							<Checkbox checked>Enable local PoW</Checkbox>
						</Form.Item>
					</div>

					<Divider />
					<div className='btns-wrapper'>
						<Space size='middle'>
							<button onClick={() => history.goBack()} className='custom-button-2'>
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

export default Config2;
