import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function SDLNavbar() {
    return (
        <>
            <Navbar className='bg-body-tertiary'>
                <Container>
                    <Navbar.Brand href='#home'>
                        <img
                            alt=''
                            src='images/sdl-header.svg'
                            width='278'
                            height='48'
                            className='d-inline-block align-top'
                        />{' '}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}


export default SDLNavbar;