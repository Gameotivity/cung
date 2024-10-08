// components/Loading.tsx

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

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { botUrlQr, mainCharacter } from '@/images';
import PhoBowl from '@/icons/IceCube';
import { calculateEnergyLimit, calculateLevelIndex, calculatePointsPerClick, calculateProfitPerHour, GameState, InitialGameState, useGameStore } from '@/utils/game-mechanics';
import WebApp from '@twa-dev/sdk';
import UAParser from 'ua-parser-js';
import { ALLOW_ALL_DEVICES } from '@/utils/consts';

interface LoadingProps {
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: (view: string) => void;
}

export default function Loading({ setIsInitialized, setCurrentView }: LoadingProps) {
  console.log("Loading component rendered");

  const initializeState = useGameStore((state: GameState) => state.initializeState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const openTimestampRef = useRef(Date.now());
  const [isAppropriateDevice, setIsAppropriateDevice] = useState(true);

  const fetchOrCreateUser = useCallback(async () => {
    console.log("fetchOrCreateUser started");
    try {
      let initData, telegramId, username, telegramName, startParam;

      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        initData = WebApp.initData;
        telegramId = WebApp.initDataUnsafe.user?.id.toString();
        username = WebApp.initDataUnsafe.user?.username || 'Unknown User';
        telegramName = WebApp.initDataUnsafe.user?.first_name || 'Unknown User';

        startParam = WebApp.initDataUnsafe.start_param;
      }

      console.log("WebApp data retrieved:", { initData, telegramId, username, telegramName, startParam });

      const referrerTelegramId = startParam ? startParam.replace('kentId', '') : null;

      if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
        console.log("Bypassing Telegram auth");
        initData = "temp";
      }

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramInitData: initData,
          referrerTelegramId,
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch or create user');
      }
      const userData = await response.json();

      console.log("User data received:", userData);

      if (!initData) {
        throw new Error('initData is undefined');
      }
      if (!telegramName) {
        throw new Error('telegramName is undefined');
      }

      const initialState: InitialGameState = {
        userTelegramInitData: initData,
        userTelegramName: telegramName,
        lastClickTimestamp: userData.lastPointsUpdateTimestamp,
        gameLevelIndex: calculateLevelIndex(userData.points),
        points: userData.points,
        pointsBalance: userData.pointsBalance,
        unsynchronizedPoints: 0,
        multitapLevelIndex: userData.multitapLevelIndex,
        pointsPerClick: calculatePointsPerClick(userData.multitapLevelIndex),
        energy: userData.energy,
        maxEnergy: calculateEnergyLimit(userData.energyLimitLevelIndex),
        energyRefillsLeft: userData.energyRefillsLeft,
        energyLimitLevelIndex: userData.energyLimitLevelIndex,
        lastEnergyRefillTimestamp: userData.lastEnergyRefillsTimestamp,
        mineLevelIndex: userData.mineLevelIndex,
        profitPerHour: calculateProfitPerHour(userData.mineLevelIndex),
        tonWalletAddress: userData?.tonWalletAddress,
      };

      console.log("Initial state prepared:", initialState);

      initializeState(initialState);
      setIsDataLoaded(true);
      console.log("Data loaded successfully");
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., show error message to user)
    }
  }, [initializeState]);

  useEffect(() => {
    console.log("Loading component mounted");
    const parser = new UAParser();
    const device = parser.getDevice();
    const isAppropriate = ALLOW_ALL_DEVICES || device.type === 'mobile' || device.type === 'tablet';
    setIsAppropriateDevice(isAppropriate);

    console.log("Device check:", { isAppropriate, deviceType: device.type, ALLOW_ALL_DEVICES });

    if (isAppropriate) {
      fetchOrCreateUser();
    }
  }, [fetchOrCreateUser]);

  useEffect(() => {
    if (isDataLoaded) {
      console.log("Data loaded, preparing to change view");
      const currentTime = Date.now();
      const elapsedTime = currentTime - openTimestampRef.current;
      const remainingTime = Math.max(3000 - elapsedTime, 0);

      console.log("Time calculations:", { currentTime, elapsedTime, remainingTime });

      const timer = setTimeout(() => {
        console.log("Changing view to 'game' and setting isInitialized to true");
        setCurrentView('game');
        setIsInitialized(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isDataLoaded, setIsInitialized, setCurrentView]);

  if (!isAppropriateDevice) {
    console.log("Rendering for inappropriate device");
    return (
      <div className="bg-[#FFF3E0] flex justify-center items-center h-screen">
        <div className="w-full max-w-xl text-[#4A4A4A] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Chơi trên điện thoại di động của bạn</h1>
          <Image
            className="bg-white p-2 rounded-xl shadow-md"
            src={botUrlQr}
            alt="QR Code"
            width={200}
            height={200}
          />
          <p className="mt-4 text-[#E60000]">@{process.env.NEXT_PUBLIC_BOT_USERNAME}</p>
          <p className="mt-2">Phát triển bởi Gameotivity</p>
        </div>
      </div>
    );
  }

  console.log("Rendering loading screen");
  return (
    <div className="bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex justify-center items-center h-screen">
      <div className="w-full max-w-xl text-[#4A4A4A] flex flex-col items-center">
        <div className="w-64 h-64 rounded-full bg-white p-2 mb-8 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image
              src={mainCharacter}
              alt="Nhân vật chính"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transform: 'scale(1.05) translateY(10%)'
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-[#E60000]">Đang tải Phở Việt</h1>

        <div className="flex items-center space-x-2">
          <PhoBowl className="w-12 h-12 text-[#E60000] animate-bounce" />
          <PhoBowl className="w-12 h-12 text-[#E60000] animate-bounce delay-100" />
          <PhoBowl className="w-12 h-12 text-[#E60000] animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}