import React, { useContext } from 'react';
import { Menu, Dropdown } from 'antd';
import { useHistory } from "react-router-dom";
import { EllipsisOutlined } from '@ant-design/icons';
import { AppContext } from '../context/globalState';
import view from '../assets/view.svg';
import configure from '../assets/configure.svg';
import deleteOracle from '../assets/delete.svg';

const Oracles = () => {
	let history = useHistory();
	const { oracles, retrievers, updateItems } = useContext(AppContext);

	const assign = async oracle => {
		await updateItems('retrievers', [ ...retrievers, oracle ]);
		const updatedList = oracles;
		updatedList.forEach(item => {
			if (item.id === oracle.id) {
				item.retriever = item.id;
			} 
		});
		await updateItems('oracles', updatedList);
	}

	const handleMenuClick = (event, oracle) => {
		switch (event.key) {
			case 'view':
				history.push(`/fetch/${oracle.retriever}`);
				break;
			case 'configure':
				history.push(`/retriever/${oracle.retriever}`, oracle);
				break;
			case 'delete':
				const list = oracles.filter(item => item.id !== oracle.id);
				updateItems('oracles', list.length > 0 ? list : []);
				break;
			default:
				break;
		}
	};

	const menu = oracle => (
		<Menu className='oracle-menu' onClick={event => handleMenuClick(event, oracle)}>
			{
				oracle.retriever ? (
					<Menu.Item key='view'>
						<img src={view} alt='' />
						View retriever
					</Menu.Item>
				) : null
			}
			{
				oracle.retriever ? (
					<Menu.Item key='configure'>
						<img src={configure} alt='' />
						Configure
					</Menu.Item>
				) : null
			}
			{
				oracle.retriever ? <Menu.Divider /> : null
			}
			<Menu.Item className='oracle-delete' key='delete'>
				<img src={deleteOracle} alt='' />
				Delete Oracle
			</Menu.Item>
		</Menu>
	);

	return (
		<React.Fragment>
		{
			oracles.length > 0 ? (
				<div className='oracle-items-wrapper'>
					{
						oracles.map(oracle => (
							<div className='oracle-item-wrapper' key={oracle.id}>
								<div className='oracle-title'>
									<h1>{oracle.id}</h1>
									<p>{oracle.node}</p>
								</div>
								<div className='oracle-actions'>
									<div className="oracle-menu-wrapper">
										<Dropdown overlay={() => menu(oracle)} placement='bottomRight' >
											<EllipsisOutlined className='ellipsis-icon' />
										</Dropdown>
									</div>
									{
										oracle.retriever ? null : (
											<button onClick={() => assign(oracle)} className='custom-button-2'>
												Assign a retriever
											</button>
										)
									}
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

export default Oracles;
