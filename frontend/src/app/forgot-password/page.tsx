import { Metadata } from 'next'
import ForgetPassword from '@/app/forgot-password/_component/forgotPassword';
import { APP_NAME } from '@/constants/generalConstants';

export const metadata: Metadata = {
    title: `${APP_NAME} - Forgot Password`,
    description: `Reset your password ${APP_NAME} - Your productivity and financial tracking companion`,
    keywords: `${APP_NAME}, forgot password, reset password, productivity, financial tracking, tasks, goals, roadmap`,
}

export default function LoginPage() {

    return (
        <ForgetPassword />
    );
}
