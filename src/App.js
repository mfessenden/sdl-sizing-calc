import {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/Admin';
import Body from './components/Body';
import SettingsPanel from './components/Settings';
import TopNavbar from './components/Navbar';
import {StateProvider} from './model/Data';
import {SDL_TITLE} from './Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


export default function App() {
    const isAdmin = true
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
