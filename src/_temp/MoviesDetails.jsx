import { useState, useEffect, Suspense } from 'react';
import { Link, Outlet, useParams, useLocation } from "react-router-dom";

import { toast } from 'react-toastify';

import BackLink from "components/BackLink";
import { getMovieDetails } from "fakeAPI";


const MoviesDetails = () => {
    const location = useLocation();
    //! useState ===> **** (аналог this.state.****)
    const [movieDetails, setMovieDetails] = useState({});
    const [yearDate, setYearDate] = useState("");
    const [userScore, setUserScore] = useState(0);
    const [genresAll, setGenresAll] = useState("");
    const [error, setError] = useState(false);
    
    //* ++++++++++++++ location +++++++++++++++++++++++++++++
    const [locationState, setLocationState] = useState(null); //! МОЙ вариант для location
    
    //! МОЙ вариант для location
    useEffect(() => {
        //! ТАК РАБОТАЕТ (2- вариант)
        if (location.state?.from)  {
            setLocationState(location.state.from);
        }
    }, [location.state]);
    //* _______________ location _____________________________


    const { id } = useParams();

    useEffect(() => {
        setError(false);
        getMovieDetails(Number(id))
            .then(( movieDetails ) => { 
            setMovieDetails(movieDetails);
            setYearDate(movieDetails.release_date.substr(0, 4));
            setUserScore((movieDetails.vote_average * 10).toFixed(0));
            setGenresAll((movieDetails.genres.map(item => item.name)).join(" ")); 
            })
            .catch(error => {
            setError(error.message);
            console.log(error.message); //!
            toast.error(`Ошибка запроса: ${error.message}`, { position: "top-center", autoClose: 2000 } ); 
            })
    }, [id]);
    
    //! Проверка movieDetails на пустой объект
    if (!movieDetails) {
        return null;  
    }
    //! Дестуктуризируем нужныесв-ва из объекта movieDetails 
    const { poster_path, title, name, overview } = movieDetails;

    //* ++++++++++++++ location +++++++++++++++++++++++++++++
    // console.log("location.state?.from: ", location.state?.from); //!
    // const backLinkHref = location.state?.from ?? '/'; //! вариант для location РЕПЕТЫ
    // const backLinkHref = locationState ?? '/'; //! МОЙ вариант-1 для location
    const backLinkHref = location.state?.from ?? locationState; //! МОЙ вариант-2 для location
    // console.log("backLinkHref: ", backLinkHref);  //!
    //* _______________ location _____________________________


    return (
        <>
            {error && (
                <div style={{ margin: '0 auto', color: 'red' }}>
                        <h1>Ошибка запроса:</h1>
                        <h2 style={{ textDecoration: "underline", fontStyle: 'italic', color: '#a10000' }}>!!! {error}</h2>
                    </div>
            )}
            

            {!error && (
                <div style={{ border: "solid 1px", boxShadow: "7px 7px 3px 0px rgba(0,0,0,0.50)" }}>
                    
                    <BackLink to={backLinkHref}>Go back</BackLink>

                    <div style={{ display: "flex" }}>
                        <img src={`https://image.tmdb.org/t/p/w300${poster_path}`} alt="" />

                        <div style={{ marginLeft: "24px", paddingRight: "24px" }}>
                            {/* <h1>Информация о фильме</h1> */}
                            <h2 style={{ color: "#571616" }}>{`${title || name} (${yearDate})`}</h2>
                            <p>{`User Score: ${userScore}%`}</p>
                            <h3>Overview</h3>
                            <p>{overview}</p>
                            <h3>Genres</h3>
                            <p>{genresAll}</p>
                        </div>
                    </div>

                    <div style={{ border: "solid 1px", boxShadow: "3px 3px 1px 0px rgba(0,0,0,0.25)"}}>
                        <p style={{ marginLeft: "10px" }}>Additional Information</p>
                        <ul>
                            <li>
                                <Link to="cast">Cast</Link>
                            </li>
                            <li>
                                <Link to="reviews">Reviews</Link>
                            </li>
                        </ul>
                    </div>
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </div>
            )}
        </>
    );
};

export default MoviesDetails;