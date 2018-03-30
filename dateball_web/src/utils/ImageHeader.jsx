import styles from './ImageHeader.css';
import config from './../../config';
function ImageHeader({src}){
	const img_src = config.api + src;
	return (
		<img className={styles.header} src={img_src} alt='name' />
	);
}

export default ImageHeader;