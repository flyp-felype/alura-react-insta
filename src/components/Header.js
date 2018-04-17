import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class Header extends Component {

    constructor() {
        super();
        this.state = { search: '' };
    }

    setSearch = (e) => {
        this.setState({ search: e.target.value });
    }

    searchAction = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/public/fotos/${this.state.search}`)
            .then(resp => {
                if (resp.ok)
                    return resp.json();
                else
                    throw new Error('Usuário pesquisado não existe!');
            })
            .then(fotos => {
                this.setState({ search: '' });
                PubSub.publish('timeline', { fotos });
            });
    }

    render() {
        return (
            <header className="header container">
                <h1 className="header-logo">
                    Instalura
          </h1>

                <form className="header-busca" onSubmit={this.searchAction}>
                    <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" value={this.state.search} onChange={this.setSearch} />
                    <input type="submit" value="Buscar" className="header-busca-submit" />
                </form>


                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <a href="#">
                                ♡
                  {/*                 ♥ */}
                                {/* Quem deu like nas minhas fotos */}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}