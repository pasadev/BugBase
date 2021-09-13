import React, {useEffect, useState, useContext} from 'react';
import axios from "axios";
import {Link, Redirect, useHistory} from 'react-router-dom'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {checkIfLogged} from "../_helpers";
import {NetworkErrorContext, userLoggedContext, backendIpAddress} from "../_helpers"

const Login = (props) =>{



  const {networkError, setNetworkError} = useContext(NetworkErrorContext);
  const {userLogged, setUserLogged} = useContext(userLoggedContext)

  const [userError, setUserError] = useState(false);

    const history = useHistory();



    const handleLogin = async (e) => {
      e.preventDefault()

      var email = e.target[0].value;
      var password = e.target[1].value;

      console.log(email)
      console.log(password)

        await axios.post(`${backendIpAddress}login`, {

      headers: {
    },
            
            email: email,
            password: password,
           
          })     .then((response) => {
            if (response.data.error === "Unknown user"){
              console.log(response.data.error);
              setUserError(true)
              return

            }
            
            console.log(response);
            localStorage.setItem('logintoken', response.data.access_token)
            setUserLogged(true)
            
            // add data as prop when if accounts get different access levels
         
          }, (error) => {
            console.log(error);
          });
          
        }


      //console.log(userLogged)

     useEffect(() => {
        //use when loaded page.
        //check if logged
          var check= checkIfLogged(); 


          if (!check) {
            console.log("check login not login")
            return
            // if logged in redirect away
          } else {

            ''
            

          }
  
        
      }, [])

      useEffect(() => {

        //console.log(userLogged)

      }, [userLogged])
    

            return(
                <>

{networkError ? 'Backend not reachable' : ''}


{userError ? <p>The Email or password are not right</p>: ''}

{userLogged?  



<Redirect to="/" />

:

<>
<Form onSubmit={handleLogin}>
  <Form.Group controlId="formLogEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
  </Form.Group>


  <Form.Group controlId="formLogPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Login
  </Button>
</Form>

<p>Don't have an account? <Link to={{pathname: "/signup"}}>Sign Up</Link></p>


<br/>
</>

}
            </>    



            )
  
}



export default Login;