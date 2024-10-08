// components/Friends.tsx

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

import React, { useState, useCallback, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import PhoBowl from '@/icons/IceCube';
import { useGameStore } from '@/utils/game-mechanics';
import { baseGift, bigGift } from '@/images';
import BanhMi from '@/icons/Snowflake';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { REFERRAL_BONUS_BASE, REFERRAL_BONUS_PREMIUM, LEVELS } from '@/utils/consts';
import { getUserTelegramId } from '@/utils/user';
import Copy from '@/icons/Copy';
import { useToast } from '@/contexts/ToastContext';
import { initUtils } from '@telegram-apps/sdk';

interface Referral {
  id: string;
  telegramId: string;
  name: string | null;
  points: number;
  referralPointsEarned: number;
  levelName: string;
  levelImage: StaticImageData;
}

export default function Friends() {
  const showToast = useToast();

  const { userTelegramInitData } = useGameStore();
  const [copyButtonText, setCopyButtonText] = useState("Sao chép");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Mời bạn bè");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const [showBonusesList, setShowBonusesList] = useState(false);

  const handleShowBonusesList = useCallback(() => {
    triggerHapticFeedback(window);
    setShowBonusesList(prevState => !prevState);
  }, []);

  const fetchReferrals = useCallback(async () => {
    setIsLoadingReferrals(true);
    try {
      const response = await fetch(`/api/user/referrals?initData=${encodeURIComponent(userTelegramInitData)}`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách giới thiệu');
      }
      const data = await response.json();
      setReferrals(data.referrals);
      setReferralCount(data.referralCount);
    } catch (error) {
      console.error('Lỗi khi tải danh sách giới thiệu:', error);
      showToast('Không thể tải danh sách giới thiệu. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsLoadingReferrals(false);
    }
  }, [userTelegramInitData, showToast]);

  const handleFetchReferrals = useCallback(() => {
    triggerHapticFeedback(window);
    fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleCopyInviteLink = useCallback(() => {
    triggerHapticFeedback(window);
    navigator.clipboard
      .writeText(process.env.NEXT_PUBLIC_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_APP_URL_SHORT_NAME}?startapp=kentId${getUserTelegramId(userTelegramInitData) || ""}` : "https://t.me/clicker_game_news")
      .then(() => {
        setCopyButtonText("Đã sao chép!");
        showToast("Đã sao chép liên kết mời!", 'success');

        setTimeout(() => {
          setCopyButtonText("Sao chép");
        }, 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép văn bản: ', err);
        showToast("Không thể sao chép liên kết. Vui lòng thử lại.", 'error');
      });
  }, [userTelegramInitData, showToast]);

  const handleInviteFriend = useCallback(() => {
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    const userTelegramId = getUserTelegramId(userTelegramInitData);

    const inviteLink = botUsername
      ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_APP_URL_SHORT_NAME}?startapp=kentId${userTelegramId || ""}`
      : "https://t.me/clicker_game_news";

    const shareText = `🍜 Tham gia cùng tôi trong Phở Việt: Chạm, Kiếm, và Chiến thắng! 🏆\n🚀 Hãy cùng chơi và kiếm tiền!`;

    try {
      triggerHapticFeedback(window);
      const utils = initUtils();
      const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      utils.openTelegramLink(fullUrl);
    } catch (error) {
      console.error('Lỗi khi mở liên kết Telegram:', error);
      showToast("Không thể mở hộp thoại chia sẻ. Vui lòng thử lại.", 'error');

      // Fallback: copy the invite link to clipboard
      navigator.clipboard.writeText(inviteLink)
        .then(() => showToast("Đã sao chép liên kết mời vào bộ nhớ tạm", 'success'))
        .catch(() => showToast("Không thể chia sẻ hoặc sao chép liên kết mời", 'error'));
    }
  }, [userTelegramInitData, showToast]);

  return (
    <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
      <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-36">
              <div className="relative">
                <h1 className="text-2xl text-center mt-4 mb-2 text-[#E60000]">Mời bạn bè!</h1>
                <p className="text-center text-[#4A4A4A] mb-8">Bạn và bạn bè của bạn sẽ nhận được phần thưởng</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center">
                      <Image src={baseGift} alt="Quà tặng" width={40} height={40} />
                      <div className="flex flex-col ml-2">
                        <span className="font-medium">Mời một người bạn</span>
                        <div className="flex items-center">
                          <BanhMi className="w-6 h-6 text-[#E60000]" />
                          <span className="ml-1 text-[#4A4A4A]"><span className="text-[#E60000]">+{formatNumber(REFERRAL_BONUS_BASE)}</span> cho bạn và bạn của bạn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center">
                      <Image src={bigGift} alt="Quà tặng cao cấp" width={40} height={40} />
                      <div className="flex flex-col ml-2">
                        <span className="font-medium">Mời bạn có Telegram Premium</span>
                        <div className="flex items-center">
                          <BanhMi className="w-6 h-6 text-[#E60000]" />
                          <span className="ml-1 text-[#4A4A4A]"><span className="text-[#E60000]">+{formatNumber(REFERRAL_BONUS_PREMIUM)}</span> cho bạn và bạn của bạn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleShowBonusesList}
                  className="block w-full mt-4 text-center text-[#E60000]"
                >
                  {showBonusesList ? "Ẩn" : "Xem thêm phần thưởng"}
                </button>

                {showBonusesList && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-2xl text-[#E60000] text-left font-bold mb-4">Phần thưởng khi lên cấp</h3>
                    <div className="flex justify-between text-[#4A4A4A] px-4 mb-2">
                      <div className="flex items-center flex-1">
                        <span>Cấp độ</span>
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <span>Cho bạn bè</span>
                        <span>Premium</span>
                      </div>
                    </div>
                    {LEVELS.slice(1).map((level, index) => (
                      <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-md">
                        <div className="flex items-center flex-1">
                          <Image src={level.smallImage} alt={level.name} width={40} height={40} className="rounded-lg mr-2" />
                          <span className="font-medium text-[#4A4A4A]">{level.name}</span>
                        </div>
                        <div className="flex items-center justify-between flex-1">
                          <div className="flex items-center mr-4">
                            <BanhMi className="w-4 h-4 mr-1 text-[#E60000]" />
                            <span className="text-[#E60000]">+{formatNumber(level.friendBonus)}</span>
                          </div>
                          <div className="flex items-center">
                            <BanhMi className="w-4 h-4 mr-1 text-[#E60000]" />
                            <span className="text-[#E60000]">+{formatNumber(level.friendBonusPremium)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg text-[#E60000]">Danh sách bạn bè của bạn ({referralCount})</h2>
                    <svg
                      className="w-6 h-6 text-[#4A4A4A] cursor-pointer"
                      onClick={handleFetchReferrals}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="mt-4 space-y-2">
                    {isLoadingReferrals ? (
                      <div className="space-y-2 animate-pulse">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                <div className="h-3 bg-gray-300 rounded w-20"></div>
                              </div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : referrals.length > 0 ? (
                      <ul className="space-y-2">
                        {referrals.map((referral: Referral) => (
                          <li key={referral.id} className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md">
                            <div className="flex items-center space-x-3">
                              <Image src={referral.levelImage} alt={referral.levelName} width={48} height={48} className="rounded-full" />
                              <div>
                                <span className="font-medium text-[#4A4A4A]">{referral.name || `Người dùng ${referral.telegramId}`}</span>
     <p className="text-sm text-[#4A4A4A]">{referral.levelName} • {formatNumber(referral.points)} điểm</p>
                              </div>
                            </div>
                            <span className="text-[#E60000]">+{formatNumber(referral.referralPointsEarned)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-[#4A4A4A] bg-white rounded-lg p-4 shadow-md">
                        Bạn chưa mời ai cả
                      </div>
                    )}
                  </div>
                </div>

                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-40 flex gap-4 px-4">
                  <button
                    className="flex-grow py-3 bg-[#E60000] rounded-lg text-white font-bold pulse-animation"
                    onClick={handleInviteFriend}
                  >
                    Mời bạn bè
                  </button>
                  <button
                    className="w-12 h-12 bg-[#E60000] rounded-lg text-white font-bold flex items-center justify-center"
                    onClick={handleCopyInviteLink}
                  >
                    {copyButtonText === "Đã sao chép!" ? "✓" : <Copy />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}