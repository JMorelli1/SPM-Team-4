
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMovieBannerDiscover } from '~/hooks/MovieHooks';
import './Header.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const movieBannerQuery = useMovieBannerDiscover();

  const [index, setIndex] = useState(0);
  const [currentBannerId, setCurrentBannerId] = useState<string | number>();
  const [currentImage, setCurrentImage] = useState("");
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [nextTitle, setNextTitle] = useState<string | null>("");
  const [titlePhase, setTitlePhase] = useState<"idle" | "in" | "out">("idle");

  const imageUrlBasePath = `https://image.tmdb.org/t/p/w500/`

  useEffect(() => {
    if (movieBannerQuery.data && movieBannerQuery.data?.results.length > 0) {
      const images = movieBannerQuery.data.results.map(x => ({ url: `${imageUrlBasePath}${x.backdrop_path}`, title: x.title, id: x.id }));

      // Initial load of banner
      if (currentImage === "") {
        setCurrentImage(images[0].url)
        setCurrentTitle(images[0].title)
        setCurrentBannerId(images[0].id)
      }

      const interval = setInterval(() => {
        const newIndex = (index + 1) % images.length;
        const newImage = images[newIndex];

        setNextImage(newImage.url); // trigger animation
        setNextTitle(newImage.title)
        setTitlePhase("in")

        // after animation completes, swap
        setTimeout(() => {
          setCurrentBannerId(newImage.id)
          setCurrentImage(newImage.url);
          setCurrentTitle(newImage.title)
          setNextImage(null);
          setTitlePhase('idle')
        }, 1000); // animation duration

        setIndex(newIndex);
      }, 20000); // <<< cycle every 20 seconds
      return () => clearInterval(interval);
    }
  }, [movieBannerQuery.data, currentImage]);

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <div
      // position="static"
      className="header"
    >
      <div className="banner-layer current" style={{ ['--banner-image' as any]: `url(${currentImage})` }} />
      {nextImage && <div className="banner-layer next" style={{ ['--banner-image' as any]: `url(${nextImage})` }} />}
      {/* Title layers (positioned over images) */}
      <div className={`title-layer ${titlePhase === "in" ? "exit" : ""}`}>
        <span className="title-text" onClick={() => navigate(`/movie/${currentBannerId}`)}>{currentTitle}</span>
      </div>

      {nextTitle && (
        <div className={`title-layer ${titlePhase === "in" ? "enter" : ""}`}>
          <span className="title-text" onClick={() => navigate(`/movie/${currentBannerId}`)}>{nextTitle}</span>
        </div>
      )}
      <div className='header_content'>
        <Toolbar className="header_content__toolbar" >
          <div
            className="header_content__logo"
            onClick={handleLogoClick}
          >
            <TheaterComedyOutlinedIcon fontSize="large" />
            <Typography variant="h6" component="div" className="header_content__title">
              Reel Time
            </Typography>
          </div>
        </Toolbar>
      </div>
    </div>
  );
};

export default Header;
