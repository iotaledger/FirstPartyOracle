import React from 'react';
import { Spin } from 'antd';

const Loading = () => (
	<div className='spinner'>
		<Spin size='large' />
	</div>
);

export default Loading;