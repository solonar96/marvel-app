/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {

	const [comicsList, setComicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(215);
	const [comicsEnded, setComicsEnded] = useState(false);

	const { loading, error, getAllComics } = useMarvelService();

	useEffect(() => onRequest(), []);

	const onRequest = (offset) => {
		setNewItemLoading(true);
		getAllComics(offset)
			.then(onComicsListLoaded);
	}

	const onComicsListLoaded = (newComicsList) => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}

		setComicsList(comicsList => [...comicsList, ...newComicsList]);
		setNewItemLoading(false);
		setOffset(offset => offset + 8);
		setComicsEnded(ended);
	}

	function renderedItems(arr) {
		const items = arr.map(item => {
			return (
				<li className="comics__item" key={item.id}>
					<img src={item.thumbnail} alt={item.title} className="comics__item-img" />
					<div className="comics__item-name">{item.title}</div>
					<div className="comics__item-price">{item.price}</div>
				</li>
			)
		})

		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}

	const items = renderedItems(comicsList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;

	return (
		<div className="comics__list">
			{spinner}
			{errorMessage}
			{items}
			<button
				className="button button__main button__long"
				disabled={newItemLoading}
				style={{ 'display': comicsEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList;