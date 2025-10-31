import Header from './components/Header.jsx';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default RootLayout;
