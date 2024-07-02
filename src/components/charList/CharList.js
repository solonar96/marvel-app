import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(215);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => onRequest(), []);

	const onRequest = (offset) => {
		onCharListLoading();
		marvelService
			.getAllCharacters(offset)
			.then(onCharListLoaded)
			.catch(onError);
	}

	const onCharListLoading = () => {
		setNewItemLoading(true);
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setLoading(false);
		setNewItemLoading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const onError = () => {
		setError(true);
		setLoading(false);
	}

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	}

	function renderedItems(arr) {
		const items = arr.map((item, i) => {
			return (
				<li
					ref={el => itemRefs.current[i] = el}
					tabIndex={0}
					className="char__item"
					key={item.id}
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}
					onKeyDown={(e) => {
						if (e.key === ' ') e.preventDefault();
						if (e.key === ' ' || e.key === 'Enter') {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}
					}}>
					<img
						src={item.thumbnail}
						alt={item.name + "character"}
						style={{ objectFit: item.thumbnail.includes('image_not_available') ? 'unset' : 'cover' }} />
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

	const items = renderedItems(charList);

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
				style={{ 'display': charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;