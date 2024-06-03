import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 215,
		charEnded: false
	}

	marvelService = new MarvelService();
	
	componentDidMount() {
		this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError);
	}

	onCharListLoading = () => {
		this.setState({newItemLoading: true});
	}

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({charList, offset}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}));
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
		const {charList, loading, error, newItemLoading, offset, charEnded} = this.state,
			  items = this.renderedItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null,
			  spinner = loading ? <Spinner /> : null,
			  content = !(error || loading) ? items : null;

		return (
			<div className="char__list">
				{spinner}
				{errorMessage}
				{content}
				<button 
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;