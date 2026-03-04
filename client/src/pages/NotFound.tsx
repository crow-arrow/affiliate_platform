import { useNavigate } from "react-router-dom";
import notFoundImage from "@/assets/404.avif";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Возвращаемся на предыдущую страницу в истории браузера
    // navigate(-1) вернет на предыдущую страницу, если она есть
    navigate(-1);
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${notFoundImage})` }}
    >
      <button
        type="button"
        onClick={handleGoBack}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-center items-center w-48 rounded-2xl h-14 text-xl font-semibold group z-10 hover:bg-primary/90 transition-colors"
      >
        <div className="bg-accent rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            height="25px"
            width="25px"
          >
            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#ffffff"></path>
            <path
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
        <p className="translate-x-2">Go Back</p>
      </button>
    </div>
  );
};
