import {useEffect} from 'react';
import {TopNavbar} from './Components/Navbar';
import Body from './Components/Body';
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
                <Body/>
            </StateProvider>
        </div>
    );
}
