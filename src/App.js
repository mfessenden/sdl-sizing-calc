import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SDLNavbar from './Components/Navbar';
import Body from './Components/Body';
import useStateStore from './Models';


export default function App() {
    const data = useStateStore()
    console.log('App:')
    console.log(data)
    return (
        <div className='App'>
            <SDLNavbar/>
            <Body/>
        </div>
    );
}

