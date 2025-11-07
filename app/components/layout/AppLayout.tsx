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
    </div>
  );
}

export default AppLayout;
