import err from './error.gif';

const ErrorMessage = () => {
	return (
		<img src={err} alt="Error" style={{display: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}} />
	)
}

export default ErrorMessage;