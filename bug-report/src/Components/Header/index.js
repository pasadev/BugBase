import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import {NavDropdown,  Navbar, Nav, Form, Button} from 'react-bootstrap';
import {AppContext, userLoggedContext, ExistingAppContext, NetworkErrorContext} from "../_helpers"

import Search from "./Search"

import './header.css' ;



const Header = (props) =>{


  const {existingApps, setExistingApps} = useContext(ExistingAppContext);

  const [selectedApp, setSelectedApp] = useState("Select Project");

  const {userLogged, setUserLogged} = useContext(userLoggedContext)

  const {networkError, setNetworkError} = useContext(NetworkErrorContext)
  
const {chosenApp, setChosenApp} = useContext(AppContext);


function changeChosenApp(chosenApp) {
  setChosenApp(chosenApp);
}

  const setApp = (event) => {

    var appName = event.target.innerText;
    console.log(appName)

    setSelectedApp(appName)

    changeChosenApp(appName);

  }



  useEffect(() => {
      setSelectedApp(selectedApp)
    
    
  }, []);
  

useEffect(() => {
  if (selectedApp == "Select Project"){
    return;
  }
  console.log(selectedApp)
    changeChosenApp(selectedApp)
  console.log(chosenApp)
  
  
}, [selectedApp]);


//console.log(chosenApp)
//console.log(selectedApp)
//var token = localStorage.getItem("logintoken");
//console.log(token?"logged":"not logged");

const handleHeaderLinks = (key) => {
console.log("hello")


  if (key == 'logout') {
            localStorage.clear('logintoken')

            // TODO change localstorage token handling?
            setUserLogged(false)
        }
  }



    return(
      <>
     
     <Navbar  className="header header-background" expand="lg" >
        <Navbar.Brand className="header-title" href="/">Mpaja BugBase</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="header-background">
          <Nav>
            <NavDropdown title={selectedApp} className="selected-app-dropdown" id="basic-nav-dropdown">

                            <NavDropdown.Item  >Select Project</NavDropdown.Item>

                            <NavDropdown.Divider />
                              {existingApps && existingApps.length > 0 && (
                        
                              existingApps.map((app, index) => {//console.log(app)
                            return( 
                                      <NavDropdown.Item as={Link} to="/" onClick={setApp} key={index} value={app}>
                                      {app}
                                      </NavDropdown.Item> 
                                    
                              )})
                    )}
            </NavDropdown>


        </Nav>

        <Nav>

        <Search />

        </Nav>



            <Nav className="header-log-user ml-auto"
            onSelect={(selectedKey) =>  handleHeaderLinks(selectedKey)}>
            {userLogged ? 
            <>
            {//TODO profile link     
            }
            <Nav.Link eventKey="logout" href="#">Logout</Nav.Link>
            </>
            : <>
             
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
              
              </>
            }
            </Nav>
            </Navbar.Collapse>
      </Navbar>

      <>
     

    </>
    </>
    )
}



export default Header;