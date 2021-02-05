import React, { useState, useEffect } from 'react';
import initialConfig from './config';

export const AppContext = React.createContext({});

const GlobalState = ({ children }) => {
	const [oracles, setOracles] = useState([]);
	const [retrievers, setRetrievers] = useState([]);
	const [currentConfig, setCurrentConfig] = useState(initialConfig);

	useEffect(() => {
		try {
			const onLoad = async () => {
				const oracles = await localStorage.getItem('oracles');
				oracles && setOracles([...JSON.parse(oracles)]);
		
				const retrievers = await localStorage.getItem('retrievers');
				retrievers && setRetrievers([...JSON.parse(retrievers)]);
			}

			onLoad();
		} catch (error) {
			console.error(error);
		}

//     const fetchInterval = setInterval(async () => {
//       await fetchData();
//     }, 10000); // fetch every 10 seconds

//     // Removing the timeout before unmounting the component
//     return () => {
//       fetchInterval && clearInterval(fetchInterval);
//     };

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const updateItems = async (key, items) => {
		await localStorage.setItem(key, JSON.stringify(items));
		if (key === 'oracles') {
			setOracles(items)
		} else if (key === 'retrievers') {
			setRetrievers(items);
		}
	}

	const updateConfig = async config => {
		await localStorage.setItem('config', JSON.stringify(config));
		setCurrentConfig(config);
	}
	
	return (
		<AppContext.Provider value={{ 
			oracles,
			retrievers,
			currentConfig,
			updateConfig,
			updateItems
		}}>
			{children}
		</AppContext.Provider>
	);
};

export default GlobalState;
