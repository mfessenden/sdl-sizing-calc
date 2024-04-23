import {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Components/Body';
import SettingsPanel from './Components/Settings';
import AdminPanel from './Components/Admin';
import {StateProvider} from './Model/Data';
import TopNavbar from './Components/Navbar';
import {SDL_TITLE} from './Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


export default function App() {

    useEffect(() => {
        // update browser params
        document.title = SDL_TITLE;
    }, []);

    return (
        <div className='App'>
            <StateProvider>
                <TopNavbar adminMode={true}/>
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
