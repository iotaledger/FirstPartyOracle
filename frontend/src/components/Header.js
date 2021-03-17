import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/IOTA-logo.svg';

const Header = () => (
	<div className='header'>
		<Link to={'/'}>
			<img src={logo} alt='logo' className='iota-logo' />
		</Link>
	</div>
);

export default Header;
