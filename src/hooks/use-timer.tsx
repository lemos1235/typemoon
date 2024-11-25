import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
    fetchSubscription: () => Promise<void>,
  ) => void;
  toggleAutoRefresh: (
    groupId: string,
    interval: number,
    fetchSubscription: () => Promise<void>,
    on: boolean,
  ) => void;
  isAutoRefreshOn: (groupId: string) => boolean;
  refreshings: Record<string, boolean>;
}

const TimerContext: Context<TimerContextType | null> =
  createContext<TimerContextType | null>(null);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }

  return context;
};

interface TimerState {
  autoRefreshOn: boolean;
  autoRefreshTimer: any;
  lastTimerInterval: number;
}

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
      console.log("完刷新订阅");
    }, interval * 1000);

    console.log("创建新的定时器", newTimer, interval);

    // 更新状态
    timersRef.current = {
      ...timers,
      [groupId]: {
        autoRefreshOn: true,
        autoRefreshTimer: newTimer,
        lastTimerInterval: interval,
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
        autoRefreshOn: false,
        autoRefreshTimer: null,
      },
    };
  };

  // 修改定时器间隔
  const changeTimer = (
    groupId: string,
    interval: number,
    fetchSubscription: () => Promise<void>,
  ) => {
    const timers = timersRef.current;
    const currentTimer = timers[groupId];

    // 如果间隔未变化，则不需要重新启动定时器
    if (interval === currentTimer?.lastTimerInterval) return;

    console.log("修改定时器", currentTimer?.lastTimerInterval, interval);
    if (interval > 0) {
      startTimer(groupId, interval, fetchSubscription);
    } else {
      stopTimer(groupId);
    }
  };

  // 切换自动刷新
  const toggleAutoRefresh = (
    groupId: string,
    interval: number,
    fetchSubscription: () => Promise<void>,
    on: boolean,
  ) => {
    if (on) {
      startTimer(groupId, interval, fetchSubscription);
    } else {
      stopTimer(groupId);
    }
  };

  // 检查是否启用自动刷新
  const isAutoRefreshOn = (groupId: string) => {
    const timers = timersRef.current;
    return timers[groupId]?.autoRefreshOn;
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
        toggleAutoRefresh,
        isAutoRefreshOn,
        refreshings,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
