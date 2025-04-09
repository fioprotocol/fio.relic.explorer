import { useEffect, useRef } from 'react';

type IntervalCallback = () => Promise<void> | void;

interface UseIntervalOptions {
  callImmediately?: boolean;
}

function useInterval(
  callback: IntervalCallback,
  delay: number | null,
  options: UseIntervalOptions = {} // Default to empty options object
): void {
  const savedCallback = useRef<IntervalCallback | undefined>(undefined);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined); // Ref for timeout ID
  const isTicking = useRef(false); // Ref to track if tick is running
  const { callImmediately = false } = options; // Destructure with default

  // Remember the latest callback.
  useEffect((): void => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval logic.
  useEffect((): () => void => {
    // Function to clear the existing timeout
    const clear = (): void => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
            timeoutId.current = undefined;
        }
    };

    const tick = async (): Promise<void> => {
        // Prevent concurrent execution or execution if callback is not set
        if (isTicking.current || !savedCallback.current) return;

        isTicking.current = true;
        try {
            await savedCallback.current();
        } catch (error) {
            console.error("Error in interval callback:", error);
        } finally {
            isTicking.current = false;
            // Schedule the next tick only if delay is still valid
            if (delay !== null) {
                clear(); // Ensure no duplicate timeout
                timeoutId.current = setTimeout(tick, delay);
            }
        }
    };

    // Clear previous timeout if delay/options change
    clear();
    isTicking.current = false; // Reset ticking state on dependency change

    if (delay !== null) {
        if (callImmediately) {
            // Call immediately
            tick();
        } else {
            // Schedule the first tick after delay
            timeoutId.current = setTimeout(tick, delay);
        }
    }

    // Cleanup function: clear timeout on unmount or dependency change
    return clear;
  }, [delay, callImmediately]); // Dependencies for the effect
}

export default useInterval; 
