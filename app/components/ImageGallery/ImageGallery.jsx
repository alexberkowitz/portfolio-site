'use client'

import styles from "./imageGallery.module.scss";

const ImageGallery = (props) => {
  return (
    <ul className={styles.imageGallery}>
      {props.items.map((item, index) => {
        return(
          <li key={index}>
            <img src={item.src} />
          </li>
        )
      })}
    </ul>
  );
}

export default ImageGallery;