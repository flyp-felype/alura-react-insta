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

    async postLogin() {
        try {

            const requestInfo = {
                method: 'POST',
                body: JSON.stringify({ login: this.login.value, senha: this.senha.value }),
                headers: new Headers({
                    'Content-type': 'application/json'
                })
            }

            const response = await fetch('http://localhost:8080/api/public/login', requestInfo);
            const responseJson = response.json;
            localStorage.setItem('auth-token', responseJson);
            this.setState({ logged: true })

        } catch (error) {
            this.setState({ error })
        }
    }

    doLogin = (event) => {
        event.preventDefault();

        this.setState({ error: '' });
        postLogin();
    };


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