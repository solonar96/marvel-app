import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false
	}

	marvelService = new MarvelService();
	
	componentDidMount() {
		this.marvelService
			.getAllCharacters()
			.then(this.onCharListLoaded)
			.catch(this.onError);
	}

	onCharListLoaded = (charList) => {
		this.setState({charList, loading: false});
	}

	onError = () => {
		this.setState({loading: false, error: true});
	}

	renderedItems(arr) {
		const items = arr.map(item => {
			return (
				<li 
					className="char__item"
					key={item.id}
					onClick={() => this.props.onCharSelected(item.id)}>
					<img
						src={item.thumbnail}
						alt={item.name + "character"}
						style={{objectFit: item.thumbnail.includes('image_not_available') ? 'unset' : 'cover'}} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})

		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}
	
	render() {
		const {charList, loading, error} = this.state,
			  items = this.renderedItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null,
			  spinner = loading ? <Spinner /> : null,
			  content = !(error || loading) ? items : null;

		return (
			<div className="char__list">
				{spinner}
				{errorMessage}
				{content}
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList;