import React, { useEffect, useState } from "react";
import styles from './Countdown.module.css';

function Countdown() {
  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    const difference = +new Date(`${2020}-11-13 18:00`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  const formatNumber = n => ("0" + n).slice(-2);

  Object.keys(timeLeft).forEach((interval, index) => {
      if(interval === 'days')
      if(!timeLeft[interval])
       return;

    timerComponents.push(formatNumber(timeLeft[interval]));
  });
  return (
    <div style={{display: 'flex', alignItems: 'center', fontFamily: 'monospace', flexDirection: 'column', justifyContent: 'center', width: '100vw', height : '100vh'}}>
       
<div  className={styles["card-main"]}>
<div className={styles["card-background"]} style={{backgroundImage: `url(${require("../assets/imgs/afetese.png")})`}}/>        

<div className={styles["container-infos"]}>
{timerComponents.length ? timerComponents.join(':') : <span>O evento já vai começar!</span>}
</div>
</div>
    </div>

  );
}

export default Countdown;