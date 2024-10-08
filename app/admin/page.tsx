// app/admin/page.tsx

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

import { headers } from 'next/headers';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';
    const isAuthorized = isLocalhost && isAdminAccessEnabled;

    if (!isAuthorized) {
        return <div>Unauthorized</div>;
    }

    return <AdminPanel />;
}