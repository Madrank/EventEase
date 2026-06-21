import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { login, register, logout, clearError } from 'store/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
      dispatch(register(data)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
