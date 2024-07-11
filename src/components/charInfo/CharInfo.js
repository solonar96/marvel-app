/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

	const [char, setChar] = useState(null);

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => updateChar(), [props.charId]);

	const updateChar = () => {
		const { charId } = props;
		if (!charId) {
			return;
		}

		clearError();
		getCharacter(charId)
			.then(onCharLoaded);
	}

	const onCharLoaded = (char) => setChar(char);

	const skeleton = char || loading || error ? null : <Skeleton />;
	const errorMessage = error && <ErrorMessage />;
	const spinner = loading && <Spinner />;
	const content = !(error || loading || !char) ? <View char={char} /> : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)
}

const View = ({ char }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = char;

	if (comics.length > 10) comics.splice(10);

	return (
		<>
			<div className="char__basics">
				<img
					src={thumbnail}
					alt={name}
					style={{ objectFit: thumbnail.includes('image_not_available') ? 'unset' : 'cover' }} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{
					comics.map((item, i) => {
						const { resourceURI, name } = item;
						const id = resourceURI.match(/comics\/(.+)/)[1];
						return (
							<li key={i} className="char__comics-item">
								<Link to={`/comics/${id}`}>{name}</Link>
							</li>
						)
					})
				}
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;