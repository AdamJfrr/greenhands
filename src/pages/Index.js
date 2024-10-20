import classes from './Index.module.css';
import plant from '../images/heroImage.jpg';
import plant2 from '../images/plant 2.png';
import plant3 from '../images/plant 3.png';
import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';

const Index = () => {
  const text = 'Wherever you are, our plant sitters will take care of your greenery';
  const splitText = text.split(' ');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [showPlant1, setShowPlant1] = useState(false);
  const [showPlant2, setShowPlant2] = useState(false);
  const [showPlant3,setShowPlant3] = useState(false);
  const [showButton,setShowButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => prev + 1);
    }, 300);

    if (visibleIndex>=splitText.length){
      setShowButton(true)
    }
    return () => clearInterval(interval);
  }, [visibleIndex, splitText.length]);

  return (
    <div className={classes.indexPage}>
      <div className={classes.headerBlock} style={{
        backgroundImage: `url(${plant})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className={classes.text}>
          {splitText.map((word, index) => (
            <span
              key={index}
              className={`${classes.word} ${index <= visibleIndex ? classes.visible : ''}`}
            >
              {word}{' '}
            </span>
          ))}
            {showButton&&<Link className={classes.link} to='/search'>Search for sitters</Link>}
        </div>
      </div>
    </div>
  );
};

export default Index;
