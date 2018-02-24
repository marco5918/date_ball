import styles from './Users.css';

function ImageHeader({src}){
	return (
		<img className={styles.header} src={"http://192.168.1.103:3002"+src} alt='name' />
	);
}

export default ImageHeader;