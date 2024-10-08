// components/Boost.tsx

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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { battery, lightning, multiclick } from '@/images';
import BanhMi from '@/icons/Snowflake';
import { calculateEnergyLimitUpgradeCost, calculateMultitapUpgradeCost, useGameStore } from '@/utils/game-mechanics';
import PhoBowl from '@/icons/IceCube';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { useToast } from '@/contexts/ToastContext';
import { useHydration } from '@/utils/useHydration';
import { ENERGY_REFILL_COOLDOWN, MAX_ENERGY_REFILLS_PER_DAY } from '@/utils/consts';
import Time from '@/icons/Time';

interface BoostProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Boost({ currentView, setCurrentView }: BoostProps) {
  const showToast = useToast();
  const isHydrated = useHydration();

  const handleViewChange = (view: string) => {
    console.log('Đang thử chuyển đến view:', view);
    if (typeof setCurrentView === 'function') {
      try {
        triggerHapticFeedback(window);
        setCurrentView(view);
        console.log('Chuyển view thành công');
      } catch (error) {
        console.error('Lỗi xảy ra khi chuyển view:', error);
      }
    } else {
      console.error('setCurrentView không phải là một hàm:', setCurrentView);
    }
  };

  const {
    userTelegramInitData,
    pointsBalance,
    energyRefillsLeft,
    energyLimitLevelIndex,
    multitapLevelIndex,
    lastEnergyRefillTimestamp,
    initializeState,
    refillEnergy,
    upgradeEnergyLimit,
    upgradeMultitap
  } = useGameStore();

  const [isEnergyRefillAvailable, setIsEnergyRefillAvailable] = useState(false);
  const [isMultitapAffordable, setIsMultitapAffordable] = useState(false);
  const [isEnergyLimitAffordable, setIsEnergyLimitAffordable] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const [isLoadingRefill, setIsLoadingRefill] = useState(false);
  const [isLoadingMultitap, setIsLoadingMultitap] = useState(false);
  const [isLoadingEnergyLimit, setIsLoadingEnergyLimit] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTimeRemaining = useCallback(() => {
    if (!lastEnergyRefillTimestamp || energyRefillsLeft === MAX_ENERGY_REFILLS_PER_DAY) return 0;
    const now = new Date();
    const lastRefill = new Date(lastEnergyRefillTimestamp);
    const elapsedTime = now.getTime() - lastRefill.getTime();
    return Math.max(ENERGY_REFILL_COOLDOWN - elapsedTime, 0);
  }, [lastEnergyRefillTimestamp, energyRefillsLeft]);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleEnergyRefill = async () => {
    if (isEnergyRefillAvailable) {
      setIsLoadingRefill(true);
      try {
        triggerHapticFeedback(window);
        const response = await fetch('/api/refill-energy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Không thể nạp năng lượng');
        }

        const result = await response.json();

        console.log("Kết quả từ máy chủ:", result);

        if (!result.lastEnergyRefillsTimestamp) return;

        // Cập nhật trạng thái cục bộ với các giá trị mới
        refillEnergy();
        initializeState({
          lastEnergyRefillTimestamp: result.lastEnergyRefillsTimestamp
        });

        showToast('Nạp năng lượng thành công!', 'success');
      } catch (error) {
        console.error('Lỗi khi nạp năng lượng:', error);
        showToast('Không thể nạp năng lượng. Vui lòng thử lại.', 'error');
      } finally {
        setIsLoadingRefill(false);
      }
    }
  };

  const handleMultitapUpgrade = async () => {
    if (isMultitapAffordable && !isLoadingMultitap) {
      setIsLoadingMultitap(true);
      try {
        triggerHapticFeedback(window);
        const response = await fetch('/api/upgrade/multitap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Không thể nâng cấp đa chạm');
        }

        const result = await response.json();

        console.log("Kết quả từ máy chủ:", result);

        // Cập nhật trạng thái cục bộ với các giá trị mới
        upgradeMultitap();

        showToast('Nâng cấp đa chạm thành công!', 'success');
      } catch (error) {
        console.error('Lỗi khi nâng cấp đa chạm:', error);
        showToast('Không thể nâng cấp đa chạm. Vui lòng thử lại.', 'error');
      } finally {
        setIsLoadingMultitap(false);
      }
    }
  };

  const handleEnergyLimitUpgrade = async () => {
    if (isEnergyLimitAffordable && !isLoadingEnergyLimit) {
      setIsLoadingEnergyLimit(true);
      try {
        triggerHapticFeedback(window);
        const response = await fetch('/api/upgrade/energy-limit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Không thể nâng cấp giới hạn năng lượng');
        }

        const result = await response.json();

        console.log("Kết quả từ máy chủ:", result);

        // Cập nhật trạng thái cục bộ với các giá trị mới
        upgradeEnergyLimit();

        showToast('Nâng cấp giới hạn năng lượng thành công!', 'success');
      } catch (error) {
        console.error('Lỗi khi nâng cấp giới hạn năng lượng:', error);
        showToast('Không thể nâng cấp giới hạn năng lượng. Vui lòng thử lại.', 'error');
      } finally {
        setIsLoadingEnergyLimit(false);
      }
    }
  };

  useEffect(() => {
    if (isHydrated && lastEnergyRefillTimestamp && energyRefillsLeft > 0) {
      const updateCountdown = () => {
        const remaining = getTimeRemaining();
        setTimeRemaining(remaining);
        if (remaining === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isHydrated, lastEnergyRefillTimestamp, energyRefillsLeft, getTimeRemaining]);

  useEffect(() => {
    const isAvailable = energyRefillsLeft > 0 && (energyRefillsLeft === MAX_ENERGY_REFILLS_PER_DAY || timeRemaining === 0);
    setIsEnergyRefillAvailable(isAvailable);
  }, [energyRefillsLeft, timeRemaining]);

  useEffect(() => {
    const isAffordable = calculateMultitapUpgradeCost(multitapLevelIndex) <= pointsBalance;
    setIsMultitapAffordable(isAffordable);
  }, [pointsBalance, multitapLevelIndex]);

  useEffect(() => {
    const isAffordable = calculateEnergyLimitUpgradeCost(energyLimitLevelIndex) <= pointsBalance;
    setIsEnergyLimitAffordable(isAffordable);
  }, [pointsBalance, energyLimitLevelIndex]);

  return (
    <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
      <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-24">
              <div className="px-4 mt-4 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-2 bg-white rounded-full shadow-md">
                  <BanhMi className="w-12 h-12 mx-auto text-[#E60000]" />
                  <p className="text-4xl text-[#E60000]" suppressHydrationWarning>{Math.floor(pointsBalance).toLocaleString()}</p>
                </div>
              </div>

              <h2 className="text-base mt-8 text-[#E60000]">Tăng tốc miễn phí hàng ngày</h2>
              <div className="mt-4">
                <button
                  className="w-full flex justify-between items-center bg-white rounded-lg p-4 shadow-md"
                  onClick={handleEnergyRefill}
                  disabled={!isEnergyRefillAvailable}
                >
                  <div className="flex items-center">
                    <Image src={lightning} alt="Nạp" width={40} height={40} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left font-medium">Nạp đầy năng lượng</span>
                      <span className="font-normal text-[#4A4A4A]">{energyRefillsLeft}/6 có sẵn</span>
                    </div>
                  </div>
                  {isLoadingRefill ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E60000]"></div>
                  ) : timeRemaining !== null && timeRemaining > 0 ? (
                    <div className="flex items-center">
                      <Time className="w-4 h-4 mr-1 text-[#E60000]" />
                      <span className="text-[#E60000]">
                        {isHydrated ? formatTime(timeRemaining) : 'Đang tải...'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#E60000]">Nạp</span>
                  )}
                </button>
              </div>

              <h2 className="text-base mt-8 text-[#E60000]">Tăng tốc</h2>
              <div className="mt-4">
                <button className="w-full flex justify-between items-center bg-white rounded-lg p-4 shadow-md" onClick={handleMultitapUpgrade}
                  disabled={isLoadingMultitap || !isMultitapAffordable}>
                  <div className="flex items-center">
                    <Image src={multiclick} alt="Đa chạm" width={40} height={40} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left font-medium">Đa chạm</span>
                      <div className="flex justify-center items-center">
                        <PhoBowl size={24} className="text-[#E60000]" />
                        <span className="ml-1 text-[#4A4A4A]">
                          <span className={`font-bold ${isMultitapAffordable ? 'text-[#E60000]' : ''}`}>
                            {formatNumber(calculateMultitapUpgradeCost(multitapLevelIndex))}
                          </span> • Cấp {multitapLevelIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingMultitap ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E60000]"></div>
                  ) : (
                    <span className="text-[#E60000]">Nâng cấp</span>
                  )}
                </button>
                <button className="w-full flex justify-between items-center bg-white rounded-lg p-4 mt-2 shadow-md" onClick={handleEnergyLimitUpgrade}disabled={isLoadingEnergyLimit || !isEnergyLimitAffordable}>
                  <div className="flex items-center">
                    <Image src={battery} alt="Giới hạn năng lượng" width={40} height={40} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left font-medium">Giới hạn năng lượng</span>
                      <div className="flex justify-center items-center">
                        <PhoBowl size={24} className="text-[#E60000]" />
                        <span className="ml-1 text-[#4A4A4A]">
                          <span className={`font-bold ${isEnergyLimitAffordable ? 'text-[#E60000]' : ''}`}>
                            {formatNumber(calculateEnergyLimitUpgradeCost(energyLimitLevelIndex))}
                          </span> • Cấp {energyLimitLevelIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingEnergyLimit ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E60000]"></div>
                  ) : (
                    <span className="text-[#E60000]">Nâng cấp</span>
                  )}
                </button>
              </div>

              <button onClick={() => handleViewChange("game")} className="mx-auto block mt-4 text-center text-[#E60000] bg-white rounded-lg py-2 px-4 shadow-md">
                Quay lại trò chơi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}