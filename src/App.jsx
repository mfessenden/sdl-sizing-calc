import {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Body from './components/Body';
import TopNavbar from './components/Navbar';
import {StateProvider} from './model/Data';
import {SDL_TITLE} from './Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


export default function App() {
    const isAdmin = false
    useEffect(() => {
        // update browser params
        document.title = SDL_TITLE;
    }, []);

    return (
        <div className='App'>
            <StateProvider>
                <TopNavbar adminMode={isAdmin}/>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Body/>}/>
                    </Routes>
                </BrowserRouter>
            </StateProvider>
        </div>
    );
}
