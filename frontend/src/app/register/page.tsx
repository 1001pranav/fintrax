import { Metadata } from 'next'
import RegisterComponent from '@/app/register/_component/register';
import { APP_NAME } from '@/constants/generalConstants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Register`,
  description: `Hop on to the ${APP_NAME} - Your productivity and financial tracking companion`,
  keywords: `${APP_NAME}, Sign up, productivity, financial tracking, tasks, goals, roadmap`,
}

export default function LoginPage() {

  return (
    <RegisterComponent />
  );
}
