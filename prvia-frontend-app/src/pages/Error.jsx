import '../styles/global.css'

const Error = () => {
    return ( 
        <div className='error-container'>
            <h2 className='error-message404'> 404 </h2>
            <h2 className='error-message-divider'> | </h2>
            <h2 className='error-message-not-found'> Page Not Found! </h2>
        </div>
    );
}
 
export default Error;