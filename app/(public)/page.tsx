import { getAuthUser } from '@/lib/auth';
import HomeClient from './home-client';
import { redirect } from 'next/navigation';


async function HomePage() {

  const { user } = await getAuthUser().catch(() => ({ user: null }));

  // ✅ If logged in → redirect to correct dashboard
  if (user) {
    if (user.role === "SUPER_ADMIN") {
      redirect("/dashboard/admin");
    }

    if (user.role === "SUPERVISOR") {
      redirect("/dashboard/supervisor");
    }
  }

  return (
    <HomeClient />
  )
}

export default HomePage