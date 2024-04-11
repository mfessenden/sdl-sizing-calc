import {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {TopNavbart} from './Components/Navbar';
import Body from './Components/Body';
import {StateProvider} from './Model/Context';


export default function App() {

    useEffect(() => {
        document.title = 'SDL Calculator';
    }, []);

    return (
        <div className='App'>
            <StateProvider>
                <TopNavbart/>
                <Body/>
            </StateProvider>

        </div>
    );
}
