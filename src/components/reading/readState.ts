// ============================================================
// 已读打卡状态：localStorage key `srkb:read:{sectionId}`
// 与首页学习路径（components/home/LearningPath.tsx）共用同一存储约定
// ============================================================

import { useCallback, useEffect, useState } from 'react';

const KEY_PREFIX = 'srkb:read:';
const CHANGE_EVENT = 'srkb:read-changed';

export function readDone(sectionId: string): boolean {
  try {
    return window.localStorage.getItem(`${KEY_PREFIX}${sectionId}`) === '1';
  } catch {
    return false;
  }
}

export function writeDone(sectionId: string, done: boolean): void {
  try {
    window.localStorage.setItem(`${KEY_PREFIX}${sectionId}`, done ? '1' : '0');
  } catch {
    /* ignore */
  }
  // 同页其他组件（左栏列表 / 打卡按钮 / 篇章目录行）同步刷新
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** 单个小节的已读状态 + 写入器 */
export function useReadState(sectionId: string): [boolean, (done: boolean) => void] {
  const [done, setDone] = useState(() => readDone(sectionId));

  useEffect(() => {
    const sync = () => setDone(readDone(sectionId));
    sync();
    return subscribe(sync);
  }, [sectionId]);

  const set = useCallback((v: boolean) => writeDone(sectionId, v), [sectionId]);
  return [done, set];
}

/** 列表场景：返回读取函数，任一已读状态变化时触发重渲染 */
export function useReadChecker(): (sectionId: string) => boolean {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  return readDone;
}
