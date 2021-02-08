import React, { useContext } from 'react';
import { Menu, Dropdown } from 'antd';
import { useHistory } from "react-router-dom";
import { EllipsisOutlined } from '@ant-design/icons';
import { AppContext } from '../context/globalState';
import configure from '../assets/configure.svg';
import deleteRetriever from '../assets/delete.svg';

const Retrievers = () => {
	let history = useHistory();
	const { retrievers, updateItems } = useContext(AppContext);

	const handleMenuClick = (event, retriever) => {
		switch (event.key) {
			case 'configure':
				history.push(`/retriever/${retriever.id}`, retriever);
				break;
			case 'delete':
				const list = retrievers.filter(item => item.id !== retriever.id);
				updateItems('retrievers', list.length > 0 ? list : []);
				break;
			default:
				break;
		}
	};

	const menu = oracle => (
		<Menu className='oracle-menu' onClick={event => handleMenuClick(event, oracle)}>
			<Menu.Item key='configure'>
				<img src={configure} alt='' />
				Configure
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key='delete'>
				<img src={deleteRetriever} alt='' />
				Delete Retriever
			</Menu.Item>
		</Menu>
	);

	return (
		<React.Fragment>
		{
			retrievers.length > 0 ? (
				<div className='oracle-items-wrapper'>
					{
						retrievers.map(retriever => (
							<div className='oracle-item-wrapper' key={retriever.id}>
								<div className='oracle-title'>
									<h1>{retriever.id}</h1>
									<p>{retriever.node}</p>
								</div>
								<div className='oracle-actions'>
									<div className="oracle-menu-wrapper">
										<Dropdown overlay={() => menu(retriever)} placement='bottomRight' >
											<EllipsisOutlined className='ellipsis-icon' />
										</Dropdown>
									</div>
									<button onClick={() => history.push(`/fetch/${retriever.id}`, retriever)} className='custom-button-2'>
										View feed
									</button>
								</div>
							</div>
						))
					}
				</div>
			) : null
		}
		</React.Fragment>
	);
}

export default Retrievers;
