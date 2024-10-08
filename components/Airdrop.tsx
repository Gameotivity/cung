// components/Airdrop.tsx

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

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { iceToken, paidTrophy1, tonWallet } from '@/images';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Angle from '@/icons/Angle';
import Copy from '@/icons/Copy';
import Cross from '@/icons/Cross';
import Wallet from '@/icons/Wallet';
import { useGameStore } from '@/utils/game-mechanics';
import { useToast } from '@/contexts/ToastContext';
import BanhMi from '@/icons/Snowflake';
import { Address } from "@ton/core";
import { triggerHapticFeedback } from '@/utils/ui';

export default function Airdrop() {
    const [tonConnectUI] = useTonConnectUI();
    const { tonWalletAddress, setTonWalletAddress, userTelegramInitData } = useGameStore();
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const showToast = useToast();

    const handleWalletConnection = useCallback(async (address: string) => {
        setIsLoading(true);
        try {
            const success = await saveWalletAddress(address);
            if (!success) {
                if (tonConnectUI.account?.address) {
                    await tonConnectUI.disconnect();
                }
                showToast("Không thể lưu địa chỉ ví. Vui lòng thử kết nối lại.", "error");
            } else {
                showToast("Kết nối ví thành công!", "success");
            }
        } catch (error) {
            console.error('Lỗi khi kết nối ví:', error);
            showToast("Đã xảy ra lỗi khi kết nối ví.", "error");
        } finally {
            setIsLoading(false);
            setIsConnecting(false);
        }
    }, [tonConnectUI, showToast]);

    const handleWalletDisconnection = useCallback(async () => {
        setIsLoading(true);
        try {
            await disconnectWallet();
            setTonWalletAddress(null);
            showToast("Ngắt kết nối ví thành công!", "success");
        } catch (error) {
            console.error('Lỗi khi ngắt kết nối ví:', error);
            showToast("Đã xảy ra lỗi khi ngắt kết nối ví.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [setTonWalletAddress, showToast]);

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
            if (wallet && isConnecting) {
                await handleWalletConnection(wallet.account.address);
            } else if (!wallet && !isConnecting) {
                await handleWalletDisconnection();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection, isConnecting]);

    const saveWalletAddress = async (address: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/wallet/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initData: userTelegramInitData,
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                throw new Error('Không thể lưu địa chỉ ví');
            }

            const data = await response.json();
            setTonWalletAddress(data.walletAddress);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu địa chỉ ví:', error);
            return false;
        }
    };

    const disconnectWallet = async () => {
        try {
            const response = await fetch('/api/wallet/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initData: userTelegramInitData,
                }),
            });

            if (!response.ok) {
                throw new Error('Không thể ngắt kết nối ví');
            }
        } catch (error) {
            console.error('Lỗi khi ngắt kết nối ví:', error);
            throw error;
        }
    };

    const handleWalletAction = async () => {
        triggerHapticFeedback(window);
        if (tonConnectUI.account?.address) {
            await tonConnectUI.disconnect();
        } else {
            setIsConnecting(true);
            await tonConnectUI.openModal();
        }
    };

    const formatAddress = (address: string) => {
        const tempAddress = Address.parse(address).toString();
        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    };

    const copyToClipboard = () => {
        if (tonWalletAddress) {
            triggerHapticFeedback(window);
            navigator.clipboard.writeText(tonWalletAddress);
            setCopied(true);
            showToast("Đã sao chép địa chỉ vào bộ nhớ tạm!", "success");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaidTaskClicked = () => {
        triggerHapticFeedback(window);
        showToast('Nhiệm vụ trên chuỗi sẽ sớm ra mắt!', 'success');
    };

    return (
        <div className="bg-[#FFF3E0] flex justify-center min-h-screen">
            <div className="w-full bg-[#FFF3E0] text-[#4A4A4A] font-bold flex flex-col max-w-xl">
                <div className="flex-grow mt-4 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-t-[48px] relative top-glow z-0">
                    <div className="mt-[2px] bg-[#FFF3E0] rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-1 pb-24">
                            <div className="relative mt-4">
                                <div className="flex justify-center mb-4">
                                    <Image src={iceToken} alt="Token Phở" width={96} height={96} className="rounded-lg mr-2" />
                                </div>
                                <h1 className="text-2xl text-center mb-4 text-[#E60000]">Nhiệm Vụ Airdrop</h1>
                                <p className="text-[#4A4A4A] text-center mb-4 font-normal">Dưới đây là danh sách các thử thách. Hoàn thành chúng để đủ điều kiện nhận Airdrop.</p>
                                <h2 className="text-base mt-8 mb-4 text-[#E60000]">Ví</h2>

                                {isLoading ? (
                                    <div className="flex justify-between items-center bg-white rounded-lg p-4 w-full shadow-md">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse mr-2"></div>
                                            <div className="flex flex-col">
                                                <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                ) : !tonWalletAddress ? (
                                    <button
                                        onClick={handleWalletAction}
                                        className="flex justify-between items-center bg-[#E60000] rounded-lg p-4 cursor-pointer w-full text-white shadow-md"
                                        disabled={isLoading}
                                    >
                                        <div className="flex items-center">
                                            <Image src={tonWallet} alt="Ví TON" width={40} height={40} className="rounded-lg mr-2" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">Kết nối ví TON của bạn</span>
                                            </div>
                                        </div>
                                        <Angle size={42} className="text-white" />
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleWalletAction}
                                            className="w-12 h-12 bg-white rounded-lg text-[#E60000] font-bold flex items-center justify-center shadow-md"
                                            disabled={isLoading}
                                        >
                                            <Cross className="text-[#E60000]" />
                                        </button>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex-grow justify-between py-3 bg-white rounded-lg text-[#4A4A4A] font-medium shadow-md"
                                            disabled={isLoading}
                                        >
                                            <div className="w-full flex justify-between px-4 items-center">
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="text-[#E60000]" />
                                                    <span>{formatAddress(tonWalletAddress)}</span>
                                                </div>
                                                <div>
                                                    <Copy className="text-[#E60000]" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )}
                                <h2 className="text-base mt-8 mb-4 text-[#E60000]">Nhiệm Vụ</h2>
                                <div className="space-y-2">
                                    <button
                                        className="w-full flex justify-between items-center bg-white rounded-lg p-4 shadow-md"
                                        onClick={handlePaidTaskClicked}
                                    >
                                        <div className="flex items-center">
                                            <Image src={paidTrophy1} alt="Hình Ảnh Nhiệm Vụ" width={40} height={40} className="rounded-lg mr-2" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-[#4A4A4A]">Tiến Bộ Kỷ Băng Hà</span>
                                                <div className="flex items-center">
                                                    <BanhMi className="w-6 h-6 mr-1 text-[#E60000]" />
                                                    <span className="text-[#4A4A4A]">+500K</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#E60000]">0.5 TON</span>
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