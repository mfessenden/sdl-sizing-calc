import {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './Components/Admin';
import Body from './Components/Body';
import SettingsPanel from './Components/Settings';
import TopNavbar from './Components/Navbar';
import {StateProvider} from './Model/Data';
import {SDL_TITLE} from './Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


export default function App() {
    const isAdmin = true //process.env.SDL_ADMIN === 1
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
                        <Route path='admin' element={<AdminPanel/>}/>
                        <Route path='settings' element={<SettingsPanel/>}/>
                    </Routes>
                </BrowserRouter>
            </StateProvider>
        </div>
    );
}
