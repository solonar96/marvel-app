/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />;
			break;
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />;
			break;
		case 'confirmed':
			return <Component />;
			break;
		case 'error':
			return <ErrorMessage />;
			break;
		default:
			throw new Error('Unexpected process state');
	}
}

const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(215);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService();

	useEffect(() => onRequest(offset, true), []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
			.then(() => setProcess('confirmed'));
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setNewItemLoading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const dur = 350;

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	}

	function renderedItems(arr) {
		const items = arr.map((item, i) => {
			return (
				<CSSTransition key={item.id} timeout={dur} classNames='char__item'>
					<li
						ref={el => itemRefs.current[i] = el}
						tabIndex={0}
						className="char__item"
						onClick={() => {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}}
						onKeyDown={(e) => {
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
				</CSSTransition>
			)
		})

		return (
			<ul className="char__grid">
				<TransitionGroup component={null}>
					{items}
				</TransitionGroup>
			</ul>
		)
	}

	return (
		<div className="char__list">
			{setContent(process, () => renderedItems(charList), newItemLoading)}
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