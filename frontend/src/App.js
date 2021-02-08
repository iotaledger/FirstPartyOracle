import React from 'react';
import Router from './Router';
import WebFontLoader from 'webfontloader';
import 'antd/dist/antd.css';
import './styles/index.scss';

WebFontLoader.load({
	google: {
		families: ['DM Sans:300,400,500,600,700,800,900', 'Poppins:300,400,500,600']
	}
});

function App() {
	return <Router></Router>;
}

export default App;
