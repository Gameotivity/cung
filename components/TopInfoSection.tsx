import { useToast } from '@/contexts/ToastContext';
import PhoBowl from '@/icons/IceCube';
import Settings from '@/icons/Settings';
import { LEVELS } from '@/utils/consts';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import Image from 'next/image';

interface TopInfoSectionProps {
    isGamePage?: boolean;
    setCurrentView: (view: string) => void;
}

export default function TopInfoSection({ isGamePage = false, setCurrentView }: TopInfoSectionProps) {
    const showToast = useToast();

    const {
        userTelegramName,
        gameLevelIndex,
        profitPerHour
    } = useGameStore();

    const handleSettingsClick = () => {
        triggerHapticFeedback(window);
        setCurrentView('settings');
    };

    return (
        <div className="px-4 z-10 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-b-3xl shadow-lg">
            <div className="flex items-center justify-between space-x-4 py-4">
                <div className="flex items-center w-1/3">
                    <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-md">
                        <div className="p-1 rounded-full bg-[#E60000]">
                            <Image src={LEVELS[gameLevelIndex].smallImage} width={24} height={24} alt="Small Level Icon" className="rounded-full" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#333333]">{userTelegramName}</p>
                        </div>
                    </div>
                </div>
                <div className={`flex items-center w-fit border-2 border-[#E60000] rounded-full ${isGamePage ? 'px-4' : 'px-6'} py-2 bg-white shadow-md`}>
                    {
                        isGamePage &&
                        <>
                            <div className="flex-1 text-center">
                                <p className="text-xs text-[#009B3A] font-medium">Sync</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-[#009B3A] mt-1"></div>
                                </div>
                            </div>
                            <div className="h-[32px] w-[2px] bg-[#FFC300] mx-2"></div>
                        </>
                    }
                    <div className="flex-1 text-center">
                        <p className="text-xs text-[#333333] font-medium whitespace-nowrap overflow-hidden text-ellipsis">Phở per hour</p>
                        <div className="flex items-center justify-center space-x-1">
                            <PhoBowl size={24} />
                            <p className="text-sm text-[#E60000] font-bold">+{formatNumber(profitPerHour)}</p>
                        </div>
                    </div>
                    {
                        isGamePage &&
                        <>
                            <div className="h-[32px] w-[2px] bg-[#FFC300] mx-2"></div>
                            <button
                                onClick={handleSettingsClick}
                                className="flex-1 flex items-center justify-center text-[#333333] focus:outline-none hover:text-[#E60000] transition-colors duration-200"
                            >
                                <Settings className="w-6 h-6" />
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}