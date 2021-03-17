import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Config, Config1, Config2, Config3, Config4, ConfigRetriever, FetchResults } from './pages';
import GlobalState from './context/globalState';

const App = () => {
	return (
		<GlobalState>
			<BrowserRouter>
				<Switch>
					<Route exact path='/'>
						<Redirect to='/oracle' />
					</Route>
					<Route exact path={'/oracle/1'} component={Config1} />
					<Route exact path={'/oracle/2'} component={Config2} />
					<Route exact path={'/oracle/3'} component={Config3} />
					<Route exact path={'/oracle/4'} component={Config4} />
					<Route path={'/retriever'} component={ConfigRetriever} />
					<Route path={'/retriever/:retrieverId'} component={ConfigRetriever} />
					<Route exact path={'/fetch/:retrieverId'} component={FetchResults} />
					<Route render={() => <Config />} />
				</Switch>
			</BrowserRouter>
		</GlobalState>
	);
};

export default App;
