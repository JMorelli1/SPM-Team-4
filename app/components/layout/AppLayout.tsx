import { Outlet } from "react-router";
import Header from "~/components/layout/Header/Header";
import './AppLayout.scss';

export function AppLayout() {

  return (
    <div className="app">
      <Header />
      <div className="app-content">
      <Outlet />
      </div>
      <div className="tmdb-logo">Powered by <img src="assets/tmdb-logi.svg" /></div>
    </div>
  );
}

export default AppLayout;
