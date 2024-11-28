import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface TimerState {
  isTimerRunning: boolean;
  autoRefreshTimer: any;
  lastTimerInterval: number;
  lastAutoRefreshOn: boolean;
}

interface TimerContextType {
  startTimer: (
    groupId: string,
    interval: number,
    fetchSubscription: () => Promise<void>,
  ) => void;
  stopTimer: (groupId: string) => void;
  changeTimer: (
    groupId: string,
    interval: number,
    autoRefreshOn: boolean,
    fetchSubscription: () => Promise<void>,
  ) => void;
  toggleTimer: (
    groupId: string,
    interval: number,
    autoRefreshOn: boolean,
    fetchSubscription: () => Promise<void>,
  ) => void;
  isTimerRunning: (groupId: string) => boolean;
  refreshings: Record<string, boolean>;
}

// Context
const TimerContext: Context<TimerContextType | null> =
  createContext<TimerContextType | null>(null);

// Hook
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }

  return context;
};

// Provider
export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 存储每个 groupId 的定时器状态
  const timersRef = useRef({} as Record<string, TimerState>);

  const [refreshings, setRefreshings] = useState({} as Record<string, boolean>);

  // 启动定时器
  const startTimer = (
    groupId: string,
    interval: number,
    fetchSubscription: () => Promise<void>,
  ) => {
    // 如果已存在定时器，清除旧定时器
    const timers = timersRef.current;
    if (timers[groupId]?.autoRefreshTimer) {
      console.log(
        "移除旧的定时器",
        timers[groupId].autoRefreshTimer,
        timers[groupId].lastTimerInterval,
      );
      clearInterval(timers[groupId].autoRefreshTimer);
    }

    // 启动新的定时器
    const newTimer = setInterval(async () => {
      console.log("开始刷新订阅");
      setRefreshings((prev) => ({ ...prev, [groupId]: true }));
      await fetchSubscription();
      setRefreshings((prev) => ({ ...prev, [groupId]: false }));
      console.log("完成刷新订阅");
    }, interval * 1000);

    console.log("创建新的定时器", newTimer, interval);

    // 更新状态
    timersRef.current = {
      ...timers,
      [groupId]: {
        isTimerRunning: true,
        autoRefreshTimer: newTimer,
        lastTimerInterval: interval,
        lastAutoRefreshOn: true,
      },
    };
  };

  // 停止定时器
  const stopTimer = (groupId: string) => {
    const timers = timersRef.current;
    if (timers[groupId]?.autoRefreshTimer) {
      console.log(
        "停止旧的定时器",
        timers[groupId].autoRefreshTimer,
        timers[groupId].lastTimerInterval,
      );
      clearInterval(timers[groupId].autoRefreshTimer);
    }

    // 更新状态
    timersRef.current = {
      ...timers,
      [groupId]: {
        ...timers[groupId],
        isTimerRunning: false,
        autoRefreshTimer: null,
        lastAutoRefreshOn: false,
      },
    };
  };

  // 修改定时器间隔
  const changeTimer = (
    groupId: string,
    interval: number,
    autoRefreshOn: boolean,
    fetchSubscription: () => Promise<void>,
  ) => {
    const timers = timersRef.current;
    const currentTimer = timers[groupId];

    // 如果间隔未变化，则不需要重新启动定时器
    if (
      interval === currentTimer?.lastTimerInterval &&
      autoRefreshOn === currentTimer?.lastAutoRefreshOn
    ) {
      return;
    }

    console.log("修改定时器", currentTimer?.lastTimerInterval, interval);
    if (interval > 0 && autoRefreshOn) {
      startTimer(groupId, interval, fetchSubscription);
    } else {
      stopTimer(groupId);
    }
  };

  // 切换自动刷新
  const toggleTimer = (
    groupId: string,
    interval: number,
    autoRefreshOn: boolean,
    fetchSubscription: () => Promise<void>,
  ) => {
    if (interval > 0 && autoRefreshOn) {
      startTimer(groupId, interval, fetchSubscription);
    } else {
      stopTimer(groupId);
    }
  };

  // 检查定时器是否正在运行
  const isTimerRunning = (groupId: string) => {
    const timers = timersRef.current;
    return timers[groupId]?.isTimerRunning;
  };

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      // 清理所有定时器
      Object.keys(timers).forEach((groupId) => stopTimer(groupId));
    };
  }, []);

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        stopTimer,
        changeTimer,
        toggleTimer,
        isTimerRunning,
        refreshings,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
