/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({ Component, dataType }) => {

	const { id } = useParams();
	const [data, setData] = useState(null);
	const { loading, error, getComic, getCharacter, clearError } = useMarvelService();

	useEffect(() => updateData(), [id]);

	const updateData = () => {
		clearError();

		switch (dataType) {
			case 'comic':
				getComic(id).then(onDataLoaded);
				break;
			case 'character':
				getCharacter(id).then(onDataLoaded);
				break;
		}
	}

	const onDataLoaded = (data) => setData(data);

	const errorMessage = error && <ErrorMessage />;
	const spinner = loading && <Spinner />;
	const content = !(error || loading || !data) && <Component data={data} />;

	return (
		<>
			<AppBanner />
			{errorMessage}
			{spinner}
			{content}
		</>
	)

}

export default SinglePage;