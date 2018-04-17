import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FotoAtualizacoes extends Component {

    likeAction = (e) => {
        e.preventDefault();
        this.props.doLike(this.props.foto.id);
    }

    commentAction = (e) => {
        e.preventDefault();
        this.props.doComment(this.props.foto.id, this.comment.value);
        this.comment.value = '';
    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.likeAction} className={this.props.foto.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
                <form className="fotoAtualizacoes-form" onSubmit={this.commentAction}>
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comment = input} />
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
                </form>

            </section>
        );
    }
}

class FotoInfo extends Component {

    render() {
        return (
            <div className="foto-in fo">
                <div className="foto-info-likes">
                    {
                        this.props.foto.likers.map(liker => <Link key={liker.login} to={`/timeline/${liker.login}`}> {liker.login}</Link>)
                    }
                    curtiram

              </div>

                <p className="foto-info-legenda">
                    <Link to={`/timeline/${this.props.foto.loginUsuario}`} className="foto-info-autor">{this.props.foto.loginUsuario} </Link>
                    {this.props.foto.comentario}
                </p>

                <ul className="foto-info-comentarios">
                    {
                        this.props.foto.comentarios.map(comentario => {
                            return (
                                <li key={comentario.id} className="comentario" >
                                    <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link>
                                    {comentario.texto}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

class FotoHeader extends Component {
    render() {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                    <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
                    <figcaption className="foto-usuario">
                        <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                            {this.props.foto.loginUsuario}
                        </Link>
                    </figcaption>
                </figure>
                <time className="foto-data">{this.props.foto.horario}</time>
            </header>
        );
    }
}

export default class FotoItem extends Component {
    render() {
        return (
            <div className="foto">
                <FotoHeader foto={this.props.foto} />
                <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
                <FotoInfo foto={this.props.foto} />
                <FotoAtualizacoes {...this.props} />
            </div>
        );
    }
}