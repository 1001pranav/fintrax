import { Metadata } from 'next'
import ResetPassword from '@/app/reset-password/_component/resetPassword';
import { APP_NAME } from '@/constants/generalConstants';

export const metadata: Metadata = {
    title: `${APP_NAME} - Reset password`,
    description: `Reset your password ${APP_NAME} - Your productivity and financial tracking companion`,
    keywords: `${APP_NAME}, login, productivity, financial tracking, tasks, goals, roadmap`,
}

export default function ResetPasswordPage() {
    
    return (
        <ResetPassword />
    );
}
