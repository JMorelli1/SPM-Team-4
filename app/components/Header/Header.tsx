
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      className="bg-blue-600 shadow-md"
      elevation={2}
    >
      <Toolbar className="flex justify-start items-center gap-2">
        <TheaterComedyOutlinedIcon fontSize="large" />
        <Typography variant="h6" component="div" className="font-semibold">
          Reel Time
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
