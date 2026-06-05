import Routes from './routes';
import LoginPage from './routes/login/page';
import { useAuthStore } from './store/authStore'
import { CompleteUserAccount } from './components/users/CompleteUserAccount';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <div>
      {
        isAuthenticated
          ? (user?.isProfileComplete ? <Routes /> : <CompleteUserAccount />)
          : <LoginPage />
      }
    </div>
  )
}
