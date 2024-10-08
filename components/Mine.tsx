// components/Mine.tsx

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

'use client'

import { useState } from 'react';
import BanhMi from '@/icons/Snowflake';
import { calculateMineUpgradeCost, calculateProfitPerHour, useGameStore } from '@/utils/game-mechanics';
import PhoBowl from '@/icons/IceCube';
import TopInfoSection from '@/components/TopInfoSection';
import { MAXIMUM_INACTIVE_TIME_FOR_MINE, mineUpgradeBaseBenefit, mineUpgradeBasePrice, mineUpgradeBenefitCoefficient, mineUpgradeCostCoefficient } from '@/utils/consts';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { useToast } from '@/contexts/ToastContext';
import Info from '@/icons/Info';

interface MineProps {
    setCurrentView: (view: string) => void;
}

export default function Mine({ setCurrentView }: MineProps) {
    const showToast = useToast();

    const {
        userTelegramInitData,
        pointsBalance,
        profitPerHour,
        mineLevelIndex,
        upgradeMineLevelIndex
    } = useGameStore();
    const [isLoading, setIsLoading] = useState(false);

    const upgradeCost = calculateMineUpgradeCost(mineLevelIndex);
    const upgradeIncrease = calculateProfitPerHour(mineLevelIndex + 1) - calculateProfitPerHour(mineLevelIndex);

    const maxInactiveHours = MAXIMUM_INACTIVE_TIME_FOR_MINE / (60 * 60 * 1000);

    const handleUpgrade = async () => {
        if (pointsBalance >= upgradeCost && !isLoading) {
            setIsLoading(true);
            try {
                triggerHapticFeedback(window);
                const response = await fetch('/api/upgrade/mine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        initData: userTelegramInitData,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Không thể nâng cấp nhà hàng');
                }

                const result = await response.json();

                console.log("Kết quả từ máy chủ:", result);

                // Update local state with the new values
                upgradeMineLevelIndex();

                showToast('Nâng cấp nhà hàng thành công!', 'success');
            } catch (error) {
                console.error('Lỗi khi nâng cấp nhà hàng:', error);
                showToast('Không thể nâng cấp nhà hàng. Vui lòng thử lại.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
            <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
                <TopInfoSection setCurrentView={setCurrentView} />

                <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <h1 className="text-2xl text-center mt-4 text-[#E60000]">Nâng cấp nhà hàng Phở</h1>

                            <div className="px-4 mt-4 flex justify-center">
                                <div className="px-4 py-2 flex items-center space-x-2 bg-white rounded-full shadow-md">
                                    <BanhMi className="w-12 h-12 mx-auto text-[#E60000]" />
                                    <p className="text-4xl text-[#E60000]" suppressHydrationWarning >{Math.floor(pointsBalance).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 mt-6 shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <p>Phở/giờ hiện tại:</p>
                                    <p className="text-[#E60000]">{formatNumber(profitPerHour)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p>Chi phí nâng cấp:</p>
                                    <p className="text-[#E60000]">{formatNumber(upgradeCost)}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Tăng Phở/giờ:</p>
                                    <p className="text-[#E60000]">+{formatNumber(upgradeIncrease)}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={pointsBalance < upgradeCost || isLoading}
                                className={`w-full mt-6 py-3 rounded-lg text-center text-white font-bold ${pointsBalance >= upgradeCost && !isLoading ? 'bg-[#E60000]' : 'bg-gray-500 cursor-not-allowed'
                                    } relative`}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    'Nâng cấp'
                                )}
                            </button>

                            <div className="bg-white rounded-lg p-4 mt-6 flex items-start shadow-md">
                                <Info className="w-6 h-6 text-[#E60000] mr-3 flex-shrink-0 mt-1" />
                                <p className="text-sm text-[#4A4A4A]">
                                    Nhà hàng của bạn tự động sản xuất Phở trong tối đa <span className="text-[#E60000] font-bold">{maxInactiveHours} giờ</span> sau hoạt động cuối cùng của bạn. Hãy đảm bảo kiểm tra thường xuyên để tối đa hóa sản lượng Phở của bạn!
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}