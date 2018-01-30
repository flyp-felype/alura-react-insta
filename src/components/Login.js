import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            error: '',
            logged: false
        };
    }

    doLogin = (event) => {
        event.preventDefault();

        this.setState({ error: '' });

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ login: this.login.value, senha: this.senha.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch('http://localhost:8080/api/public/login', requestInfo)
            .then(resp => {
                if (resp.ok)
                    return resp.text();
                else
                    throw new Error('Não foi possível efetuar login!');
            })
            .then(token => {
                localStorage.setItem('auth-token', token);
                this.setState({ logged: true })
            })
            .catch(err => this.setState({ error: err.message }));
    }

    render() {
        if (this.state.logged) {
            return <Redirect to='/timeline' />
        }

        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <form onSubmit={this.doLogin}>
                    <input type="text" ref={(input) => this.login = input} />
                    <input type="password" ref={(input) => this.senha = input} />
                    <input type="submit" value="Login" />
                </form>
                <span>{this.state.error}</span>
            </div>
        );
    }
}