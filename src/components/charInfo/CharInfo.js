/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import setContent from '../../utils/setContent';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {

	const [char, setChar] = useState(null);

	const { process, setProcess, getCharacter, clearError } = useMarvelService();

	useEffect(() => updateChar(), [props.charId]);

	const updateChar = () => {
		const { charId } = props;
		if (!charId) {
			return;
		}

		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'));
	}

	const onCharLoaded = (char) => setChar(char);

	return (
		<div className="char__info">
			{setContent(process, View, char)}
		</div>
	)
}

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = data;

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