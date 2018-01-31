import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import './css/timeline.css';
import './css/reset.css';
import './css/login.css';
import registerServiceWorker from './registerServiceWorker';
import Logout from './components/Logout';

function isAuthenticated(props) {
    return props.match.params.login || localStorage.getItem('auth-token') !== null
}

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/timeline/:login?" render={props => (
                isAuthenticated(props) ? (
                    <App match={props.match} />
                ) : (
                    <Redirect to="/" />
                )
            )} />
            <Route exact path="/logout" component={Logout} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();
