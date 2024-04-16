import {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {TopNavbar} from './Components/Navbar';
import Body from './Components/Body';
import SettingsBody from './Components/Settings';
import DeviceEditor from './Components/DataEdit';
import {StateProvider} from './Model/Data';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


export default function App() {

    useEffect(() => {
        document.title = 'SDL Calculator';
    }, []);

    return (
        <div className='App'>
            <StateProvider>
                <TopNavbar/>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Body/>}/>
                        <Route path='data-edit' element={<DeviceEditor/>}/>
                        <Route path='settings' element={<SettingsBody/>}/>
                    </Routes>
                </BrowserRouter>
            </StateProvider>
        </div>
    );
}
