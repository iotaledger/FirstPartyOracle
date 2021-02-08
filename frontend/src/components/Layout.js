import React from 'react';
import { withRouter } from 'react-router';
import { Header, Footer } from '.';

const Layout = ({ children }) => (
	<div className='page-wrapper'>
		<Header />
		<div className='main-section'>
			<div className='content'>{children}</div>
		</div>
		<Footer />
	</div>
);

export default withRouter(Layout);
