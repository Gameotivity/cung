// components/Earn.tsx

/**
 * This project was developed by Nikandr Surkov.
 * You may not use this code if you purchased it from any source other than the official website https://nikandr.com.
 * If you purchased it from the official website, you may use it for your own projects,
 * but you may not resell it or publish it publicly.
 * 
 * Website: https://nikandr.com
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * Telegram: https://t.me/nikandr_s
 * Telegram channel for news/updates: https://t.me/clicker_game_news
 * GitHub: https://github.com/nikandr-surkov
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import BanhMi from '@/icons/Snowflake';
import { useGameStore } from '@/utils/game-mechanics';
import { capitalizeFirstLetter, formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { imageMap } from '@/images';
import Time from '@/icons/Time';
import TaskPopup from './popups/TaskPopup';
import { Task } from '@/utils/types';

const useFetchTasks = (userTelegramInitData: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?initData=${encodeURIComponent(userTelegramInitData)}`);
        if (!response.ok) {
          throw new Error('Không thể tải nhiệm vụ');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Lỗi khi tải nhiệm vụ:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userTelegramInitData]);

  return { tasks, setTasks, isLoading };
};

export default function Earn() {
  const { userTelegramInitData } = useGameStore();
  const { tasks, setTasks, isLoading } = useFetchTasks(userTelegramInitData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskSelection = useCallback((task: Task) => {
    if (!task.isCompleted) {
      triggerHapticFeedback(window);
      setSelectedTask(task);
    }
  }, []);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === updatedTask.id ? updatedTask : t
      )
    );
  }, [setTasks]);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  return (
    <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
      <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-24">
              <div className="relative mt-4">
                <div className="flex justify-center mb-4">
                  <BanhMi className="w-24 h-24 mx-auto text-[#E60000]" />
                </div>
                <h1 className="text-2xl text-center mb-4 text-[#E60000]">Kiếm Thêm Bánh Mì</h1>

                {isLoading ? (
                  <div className="text-center text-[#4A4A4A]">Đang tải nhiệm vụ...</div>
                ) : (
                  Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <div key={category}>
                      <h2 className="text-base mt-8 mb-4 text-[#E60000]">{capitalizeFirstLetter(category)}</h2>
                      <div className="space-y-2">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex justify-between items-center bg-white rounded-lg p-4 cursor-pointer shadow-md"
                            onClick={() => handleTaskSelection(task)}
                          >
                            <div className="flex items-center">
                              <Image src={imageMap[task.image]} alt={task.title} width={40} height={40} className="rounded-lg mr-2" />
                              <div className="flex flex-col">
                                <span className="font-medium text-[#4A4A4A]">{task.title}</span>
                                <div className="flex items-center">
                                  <BanhMi className="w-6 h-6 mr-1 text-[#E60000]" />
                                  <span className="text-[#4A4A4A]">+{formatNumber(task.points)}</span>
                                </div>
                              </div>
                            </div>
                            {task.isCompleted ? (
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : task.taskStartTimestamp ? (
                              <span className="text-[#E60000]"><Time /></span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}