import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react";

export const ProgressBar = () => {

    const currentUser = useSelector((state) => state.auth.user)
    const numberOfTravellers = currentUser?.current_year_travellers || 0
    const userName = currentUser.first_name
    const userLevel = currentUser.level
    
    const radius = 135;
    const circumference = 2 * Math.PI * radius / 2;
    const circumferenceFullCircle = 2 * Math.PI * radius;
    const maxTravellersBronze = 10;
    const maxTravellersSilver = 25;
    const maxTravellersGold = 100;
    
    const offset = circumferenceFullCircle - (circumferenceFullCircle * numberOfTravellers / 2 / maxTravellersBronze);
    
    const offsetSilver = circumferenceFullCircle - (circumferenceFullCircle * numberOfTravellers / 2 / maxTravellersSilver);

    const circleSilverFirst = circumferenceFullCircle - (circumferenceFullCircle * 10 / 2 / maxTravellersSilver);
    const circleSilverSecond = circumferenceFullCircle - (circumferenceFullCircle * 14.3 / 2 / maxTravellersSilver);
    
    const offsetGold = circumferenceFullCircle - (circumferenceFullCircle * numberOfTravellers / 2 / maxTravellersGold);

    const circleGoldFirst = circumferenceFullCircle - (circumferenceFullCircle * 25 / 2 / maxTravellersGold);
    const circleGoldSecond = circumferenceFullCircle - (circumferenceFullCircle * 73 / 2 / maxTravellersGold);


    const progressBronze = numberOfTravellers / maxTravellersBronze;
    const progressSilver = numberOfTravellers / maxTravellersSilver;
    const progressGold = numberOfTravellers / maxTravellersGold;

    const progressPathRef = useRef(null);
    const [thumbPosition, setThumbPosition] = useState({ x: 150, y: 0 });

    useEffect(() => {
        if (progressPathRef.current) {
            const path = progressPathRef.current;
            const length = path.getTotalLength();
    
            if (userLevel === "Silver") {
                const point = path.getPointAtLength(length * progressSilver / 2);
                setThumbPosition({ x: point.x, y: point.y });
            } else if (userLevel === "Gold") {
                const point = path.getPointAtLength(length * progressGold / 2);
                setThumbPosition({ x: point.x, y: point.y });
            } else {
                const point = path.getPointAtLength(length * progressBronze / 2);
                setThumbPosition({ x: point.x, y: point.y });
            }
        }
    }, [progressBronze, progressSilver, progressGold, userLevel]); 

    return (
        <>
            {userLevel === "Gold" ? (

                <div className="grid w-full grid-col-1 flex-col justify-center items-start">
                    <span className="text-sm">{userName} - ID: {currentUser.id}</span>
                    <h2 className="font-bold text-xl">{userLevel}</h2>
                    <div className="flex items-end justify-arround mt-6">
                        <span className="max-lg:text-sm">0</span>
                        <div className="relative w-auto h-full aspect-[300/160]">
                            <span className="absolute bottom-2/3 -translate-y-2/4 left-[10%] max-lg:text-sm">25</span>
                            <svg
                                viewBox="0 0 300 140"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                                preserveAspectRatio="xMidYMid meet"
                                transform="rotate(-180)"
                            >
                                <defs>
                                    <linearGradient id="linear-gradient-2" x2="0" y2="1"
                                        gradientUnits="objectBoundingBox"
                                        gradientTransform="rotate(65, .5, .5)"
                                    >
                                        <stop offset="0.2" stopColor="#d8b21d"/>
                                        <stop offset="0.4" stopColor="#fef1a2"/>
                                        <stop offset="1" stopColor="#bc881b"/>
                                    </linearGradient>
                                    <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feOffset dx="0" dy="1" />
                                        <feGaussianBlur stdDeviation="3" result="offset-blur" />
                                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                                    </filter>
                                </defs>
                                <circle id="circle-1" cx="150" cy="0" r={radius} 
                                    strokeWidth="10" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={circleGoldFirst}
                                    className="fill-none stroke-primaryLite dark:stroke-primary"
                                    strokeLinecap="round"
                                    filter="url(#inset-shadow)"
                                />
                                <circle id="circle-2" cx="150" cy="0" r={radius} 
                                    strokeWidth="10" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={circleGoldSecond}
                                    className="fill-none stroke-primaryLite dark:stroke-primary"
                                    strokeLinecap="round"
                                    filter="url(#inset-shadow)"
                                    transform="rotate(50 150 0)"
                                />
                                <circle 
                                    ref={progressPathRef}
                                    cx="150" cy="0" r={radius} strokeWidth="12" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={offsetGold}
                                    className="fill-none stroke-accent"
                                    strokeLinecap="round"
                                />
                                <circle   
                                    cx={thumbPosition.x}
                                    cy={thumbPosition.y} 
                                    r="13.8"
                                    className="fill-accent"
                                />
                            </svg>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                                <p className="text-center font-bold max-md:text-5xl text-[2vw]">{numberOfTravellers || 0}</p>
                                <p className="text-center text-sm max-md:text-md lg:text-sm whitespace-nowrap">Travellers reffered</p>
                            </div>
                        </div>
                        <span className="max-lg:text-sm">100</span>
                    </div>
                </div>
            ) : userLevel === "Silver" ? (
                <div className="grid w-full grid-col-1 flex-col justify-center items-start">
                    <span className="text-sm">{userName} - ID: {currentUser.id}</span>
                    <h2 className="font-bold text-xl">{userLevel}</h2>
                    <div className="flex items-end justify-arround mt-6">
                        <span className="max-lg:text-sm">0</span>
                        <div className="relative w-auto h-full aspect-[300/160]">
                            <span className="absolute top-0 left-1/3 -translate-y-3/4 max-lg:text-sm">10</span>
                            <svg
                                viewBox="0 0 300 140"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                                preserveAspectRatio="xMidYMid meet"
                                transform="rotate(-180)"
                            >
                                <defs>
                                    <linearGradient id="linear-gradient-2" x2="0" y2="1"
                                        gradientUnits="objectBoundingBox"
                                        gradientTransform="rotate(135, .5, .5)"
                                    >
                                        <stop offset="0.4" stopColor="#acb5cb"/>
                                        <stop offset="1" stopColor="#d692b3"/>
                                    </linearGradient>
                                    <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feOffset dx="0" dy="1" />
                                        <feGaussianBlur stdDeviation="3" result="offset-blur" />
                                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                                    </filter>
                                </defs>
                                <circle id="circle-1" cx="150" cy="0" r={radius} 
                                    strokeWidth="10" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={circleSilverFirst}
                                    className="fill-none stroke-primaryLite dark:stroke-primary"
                                    strokeLinecap="round"
                                    filter="url(#inset-shadow)"
                                />
                                <circle id="circle-2" cx="150" cy="0" r={radius} 
                                    strokeWidth="10" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={circleSilverSecond}
                                    className="fill-none stroke-primaryLite dark:stroke-primary"
                                    strokeLinecap="round"
                                    filter="url(#inset-shadow)"
                                    transform="rotate(77 150 0)"
                                />
                                <circle 
                                    ref={progressPathRef}
                                    cx="150" cy="0" r={radius} strokeWidth="12" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={offsetSilver}
                                    className="fill-none stroke-gray-400"
                                    strokeLinecap="round"
                                />
                                <circle   
                                    cx={thumbPosition.x}
                                    cy={thumbPosition.y} 
                                    r="13.8"
                                    className="fill-gray-400"
                                />
                            </svg>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                                <p className="text-center font-bold max-md:text-5xl text-[2vw]">{numberOfTravellers || 0}</p>
                                <p className="text-center text-sm max-md:text-md lg:text-sm whitespace-nowrap">Travellers reffered</p>
                            </div>
                        </div>
                        <span className="max-lg:text-sm">25</span>
                    </div>
                </div>
            ) : ( 
                <div className="grid w-full drid-col-1 flex-col justify-center items-start">
                    <span className="text-sm">{userName} - ID: {currentUser.id}</span>
                    <h2 className="font-bold text-xl">{userLevel}</h2>
                    <div className="flex items-end justify-arround mt-6">
                        <span className="max-lg:text-sm">0</span>
                        <div className="relative w-auto h-full aspect-[300/160]">
                            <svg
                                viewBox="0 0 300 140"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                                preserveAspectRatio="xMidYMid meet"
                                transform="rotate(-180)"
                            >
                                <defs>
                                    <linearGradient id="linear-gradient-2" x2="0" y2="1"
                                        gradientUnits="objectBoundingBox"
                                        gradientTransform="rotate(135, .5, .5)"
                                    >
                                        <stop offset="0.4" stopColor="#acb5cb"/>
                                        <stop offset="1" stopColor="#d692b3"/>
                                    </linearGradient>
                                    <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feOffset dx="0" dy="1" />
                                        <feGaussianBlur stdDeviation="3" result="offset-blur" />
                                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                                    </filter>
                                </defs>
                                <circle cx="150" cy="0" r={radius} 
                                    strokeWidth="10" 
                                    strokeDasharray={circumference}
                                    className="fill-none stroke-primaryLite dark:stroke-primary"
                                    strokeLinecap="round"
                                    filter="url(#inset-shadow)"
                                />
                                <circle 
                                    ref={progressPathRef}
                                    cx="150" cy="0" r={radius} strokeWidth="12" 
                                    strokeDasharray={circumferenceFullCircle}
                                    strokeDashoffset={offset}
                                    className="fill-none stroke-bronze-border"
                                    strokeLinecap="round"
                                />
                                <circle   
                                    cx={thumbPosition.x}
                                    cy={thumbPosition.y} 
                                    r="13.8"
                                    className="fill-bronze-border"
                                />
                            </svg>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                                <p className="text-center font-bold max-md:text-5xl text-[2vw]">{numberOfTravellers || 0}</p>
                                <p className="text-center text-sm max-md:text-md lg:text-sm whitespace-nowrap">Travellers reffered</p>
                            </div>
                        </div>
                        <span className="max-lg:text-sm">10</span>
                    </div>
                </div>
            )}
        </>
    );
}
