
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './Header.scss';
import { useNavigate } from 'react-router';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <AppBar
      position="static"
      className="header"
      elevation={2}
    >
      <Toolbar className="header__toolbar">
        <div 
          className="header__logo"
        onClick={handleLogoClick}
        >
          <TheaterComedyOutlinedIcon fontSize="large" />
          <Typography variant="h6" component="div" className="header__title">
            Reel Time
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
