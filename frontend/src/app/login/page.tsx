import { Metadata } from 'next'
import LoginComponent from '@/app/login/_component/login';
import { APP_NAME } from '@/constants/generalConstants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Login`,
  description: `Login to ${APP_NAME} - Your productivity and financial tracking companion`,
  keywords: `${APP_NAME}, login, productivity, financial tracking, tasks, goals, roadmap`,
}

export default function LoginPage() {

  return (
    <LoginComponent />
  );
}
