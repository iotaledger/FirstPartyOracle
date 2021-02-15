import React, { useContext, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';
import { AppContext } from '../context/globalState';
import deleteOracle from '../assets/delete.svg';

const Oracles = () => {
	let history = useHistory();
	const { oracles, retrievers, updateItems } = useContext(AppContext);
	const [oraclesList, setOraclesList] = useState(oracles);

	const assign = async oracle => {
		await updateItems('retrievers', [ ...retrievers, oracle ]);
		const updatedList = oracles;
		updatedList.forEach(item => {
			if (item.id === oracle.id) {
				item.retriever = item.id;
			} 
		});
		await updateItems('oracles', updatedList);
		setOraclesList(updatedList);
		oracle.retriever && history.push(`/retriever/${oracle.retriever}`, oracle);
	}

	const handleMenuClick = (event, oracle) => {
		switch (event.key) {
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
			<Menu.Item key='delete'>
				<img src={deleteOracle} alt='' />
				Delete Oracle
			</Menu.Item>
		</Menu>
	);

	return (
		<React.Fragment>
		{
			oracles.length > 0 || oraclesList > 0 ? (
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
									{oracle.retriever ? (
									<button onClick={() => history.push(`/fetch/${oracle.retriever}`, oracle)} className='custom-button-2'>
										View retriever feed
									</button>
								) : (
									<button onClick={() => assign(oracle)} className='custom-button'>
										Assign a retriever
									</button>
								)}
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
