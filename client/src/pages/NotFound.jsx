import notFoundImage from "../assets/404.jpg"

export const NotFound = () => (
    <div className="w-full h-screen">
        <img className="cover" src={notFoundImage} alt="404 Not Found" />
    </div>
)