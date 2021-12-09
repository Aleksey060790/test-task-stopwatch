import React, { useState, useCallback, useEffect } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import './App.css';


const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [timerStart, setTimerStart] = useState(false);
  const [isWaitClicked, setIsWaitClicked] = useState(false);
  const unitOfTime = time / 1000;

  const timeDisplay = useCallback((durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds - hours * 3600 - minutes * 60;

    return `${hours} : ${minutes} : ${seconds}`;
  }, []);

  useEffect(() => {
    const unsubscribe = new Subject();

    interval(1000)
      .pipe(takeUntil(unsubscribe))
      .subscribe(() => {
        if (timerStart) {
          setTime(prevTime => prevTime + 1000)
        }
      });

    return () => {
      unsubscribe.next(0);
      unsubscribe.complete();
    };
  }, [timerStart]);

  const processingOfStart = useCallback(() => {
    setTimerStart(prevTimerState => !prevTimerState);
  }, [])

  const procesingOfWait = useCallback(() => {
    if (isWaitClicked) {
      setTimerStart(false);
    } else if (!isWaitClicked) {
      setIsWaitClicked(true);
      setTimeout(() => setIsWaitClicked(false), 300);
    }
  }, [isWaitClicked]);


  const processingOfStop = useCallback(() => {
    setTime(0);
    setTimerStart(false);
  }, []);

  const procesingOfReset = useCallback(() => {
    processingOfStop();
    processingOfStart();
  }, [processingOfStart, processingOfStop]);

  return (
    <>
      <h1 className="App-title">Stopwatch</h1>
      <div className="App">
        <span
          className="stopwatch"
        >
          {timeDisplay(unitOfTime)}
        </span>
        <div className="buttons-wrapper">
          {!timerStart && (
            <button
              type="button"
              onClick={processingOfStart}
              className="btn"
            >
              Start
            </button>
          )}
          {timerStart && (
            <button
              type="button"
              onClick={processingOfStop}
              className="btn"
            >
              Stop
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={procesingOfWait}
          >
            Wait
          </button>
          <button
            type="button"
            onClick={procesingOfReset}
            className="btn"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
