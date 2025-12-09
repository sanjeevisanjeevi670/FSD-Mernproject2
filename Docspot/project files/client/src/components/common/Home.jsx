import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';


const Home = () => {
  return (
    <>
      <Navbar expand="lg" className="bg" >
        <Container fluid >
          <Navbar.Brand  >
            <Link to={'/'} >MedicoHub</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '150px' }}
              navbarScroll
            >
            </Nav>
            <Nav >
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='home-container'>
        <div className="left-side">
          <img alt="" src={'https://media.istockphoto.com/photos/healthcare-and-technology-doctor-using-digital-tablet-with-icon-on-picture-id1182619271?k=20&m=1182619271&s=612x612&w=0&h=GRRH6eEKPbuouj3YCJ6juoQAWU5Ytd8shL4TONRYFEU='} />
        </div>
        <div className="right-side">
          <p>
            <span className='f-letter'>Book your doctor in seconds</span><br />
            <span className='s-letter'>Fast and easy scheduling</span> <br />
            <span className='t-letter'>putting your health in your hands.</span><br />
            <Button color='black' className='mt-3 register'><Link to={'/Login'}>Book your Doctor</Link></Button>
          </p>
        </div>
      </div>


      <Container>
        <h1 className='text-center mb-4'>About Us</h1>
        <div className="right-side">
          <p>
           Booking a doctor is now quick and hassle-free with our easy online system.
You can explore many doctors, check their details, and pick the one that suits your needs.
Choose any available time slot and confirm your visit in just a few clicks.
You’ll get instant updates and reminders so you never miss an appointment.
Enjoy smooth, simple, and fast healthcare booking from anywhere.
          </p>
        </div>
      </Container>



    </>
  )
}

export default Home
