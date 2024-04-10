import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SDLNavbar from './Components/Navbar';
import Body from './Components/Body';
import {StateProvider} from './Model/Context';


export default function App() {
    return (
        <div className='App'>
            <StateProvider>
                <SDLNavbar/>
                <Body/>
            </StateProvider>

        </div>
    );
}
