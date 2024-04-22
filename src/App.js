import {useEffect} from 'react';
import Body from './Components/Body';
import {StateProvider} from './Model/Data';
import TopNavbar from './Components/Navbar';
import {SDL_TITLE} from "./Constants";
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
                <TopNavbar/>
                <Body/>
            </StateProvider>
        </div>
    );
}
