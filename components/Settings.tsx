// components/Settings.tsx

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

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/utils/game-mechanics';
import BanhMi from '@/icons/Snowflake';
import { useToast } from '@/contexts/ToastContext';
import Toggle from '@/components/Toggle';
import { triggerHapticFeedback } from '@/utils/ui';

interface SettingsProps {
    setCurrentView: (view: string) => void;
}

export default function Settings({ setCurrentView }: SettingsProps) {
    const showToast = useToast();
    const { pointsBalance } = useGameStore();

    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [animationEnabled, setAnimationEnabled] = useState(true);

    useEffect(() => {
        const storedVibration = localStorage.getItem('vibrationEnabled');
        const storedAnimation = localStorage.getItem('animationEnabled');

        setVibrationEnabled(storedVibration !== 'false');
        setAnimationEnabled(storedAnimation !== 'false');
    }, []);

    const handleVibrationToggle = () => {
        const newValue = !vibrationEnabled;
        if (vibrationEnabled) {
            triggerHapticFeedback(window);
        }
        setVibrationEnabled(newValue);
        localStorage.setItem('vibrationEnabled', newValue.toString());
        showToast(newValue ? 'Đã bật rung' : 'Đã tắt rung', 'success');
    };

    const handleAnimationToggle = () => {
        triggerHapticFeedback(window);
        const newValue = !animationEnabled;
        setAnimationEnabled(newValue);
        localStorage.setItem('animationEnabled', newValue.toString());
        showToast(newValue ? 'Đã bật hiệu ứng' : 'Đã tắt hiệu ứng', 'success');
    };

    const handleBackToGame = () => {
        triggerHapticFeedback(window);
        setCurrentView('game');
    };

    return (
        <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
            <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
                <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <h1 className="text-2xl text-center mt-4 text-[#E60000]">Cài Đặt</h1>

                            <div className="bg-white rounded-lg p-4 mt-6 shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[#4A4A4A]">Rung khi chạm</p>
                                    <Toggle enabled={vibrationEnabled} setEnabled={handleVibrationToggle} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#4A4A4A]">Hiệu ứng điểm nổi</p>
                                    <Toggle enabled={animationEnabled} setEnabled={handleAnimationToggle} />
                                </div>
                            </div>

                            <button
                                onClick={handleBackToGame}
                                className="mx-auto block mt-4 text-center text-[#E60000] bg-white rounded-lg py-2 px-4 shadow-md"
                            >
                                Quay Lại Trò Chơi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}