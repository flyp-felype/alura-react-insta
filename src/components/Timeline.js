import React, { Component } from 'react';
import FotoItem from './FotoItem';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
    }

    loadPhotos() {
        let url = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        if (this.login)
            url = `http://localhost:8080/api/public/fotos/${this.login}`
        fetch(url)
            .then(resp => resp.json())
            .then(fotos => this.setState({ fotos }));
    }

    componentWillMount() {
        PubSub.subscribe('timeline', (topic, fotos) => {
            this.setState({ fotos: fotos.fotos });
        });

        PubSub.subscribe('update-likers', (topic, info) => {
            const selectedFoto = this.state.fotos.find(foto => foto.id === info.fotoId);
            selectedFoto.likeada = !selectedFoto.likeada;

            const liker = selectedFoto.likers.find(liker => liker.login === info.liker.login);

            if (liker) {
                selectedFoto.likers = selectedFoto.likers.filter(oldLikers => oldLikers.login !== info.liker.login);
            } else {
                selectedFoto.likers.push(info.liker);
            }
            this.setState({ fotos: this.state.fotos });
        });

        PubSub.subscribe('update-comments', (topic, info) => {
            const selectedFoto = this.state.fotos.find(foto => foto.id === info.fotoId);
            selectedFoto.comentarios.push(info.comment);
            this.setState({ fotos: this.state.fotos });

        })
    }

    componentDidMount() {
        this.loadPhotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login) {
            this.login = nextProps.login;
            this.loadPhotos();
        }
    }

    doLike(fotoId) {
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(resp => {
                if (resp.ok) return resp.json();
                else throw new Error('Não foi possível dar like na foto!');
            })
            .then(liker => {
                PubSub.publish('update-likers', { fotoId, liker });
            });
    }

    doComment(fotoId, comment) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comment }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(resp => {
                if (resp.ok) return resp.json();
                else throw new Error('Não foi possível comentar na foto!');
            })
            .then(comment => {
                PubSub.publish('update-comments', { fotoId, comment });
            });
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} doComment={this.doComment} doLike={this.doLike} />)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}