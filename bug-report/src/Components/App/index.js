import React, {useState, useContext, useEffect}  from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './app.css';

import {login} from "../_helpers"
import axios from "axios"

import IssuePage from "../IssuePage";
import ListIssues from "../ListIssues";
import Header from "../Header";
import Footer from "../Footer";
import Login from "../Login";
import Signup from "../Signup";
import NotFound from "../NotFound";
import CreateIssueForm from "../CreateIssueForm";

import { Switch } from 'react-router';
import { Route } from "react-router-dom";


import {checkIfLogged} from '../_helpers'
import {Container} from 'react-bootstrap'


import { AppContext,
         ExistingAppContext,
         userLoggedContext,
         IssuesContext,
         FilteredIssuesContext,
         NetworkErrorContext,
         backendIpAddress } from '../_helpers/'

const App = () => {

  const [userLogged, setUserLogged] = useState();  
  const [apps, setApps] = useState();
  const [chosenApp, setChosenApp] = useState();
  const [existingApps, setExistingApps] = useState([]);
  const [issues, setIssues] = useState();
  const [filteredIssues, setFilteredIssues] = useState();
  const [networkError, setNetworkError] = useState();




const checkUsername = async () => {

  var token = localStorage.getItem("logintoken");


  axios.interceptors.request.use(
  config => {
  config.headers.authorization = `Bearer ${token}`;
  return config;
  },
  error => {
  return Promise.reject(error);
  }
  )
  
    await axios.get(`${backendIpAddress}check-user`, {})
    .then((response) => {
        console.log(response);
        console.log("Long console message to notice it among others")
        setUserLogged({username: response.data.username,
                        id: response.data.user_id})
        // this works
        // On app load check if user is
      }, (error) => {
        console.log(error);
    })
  }

  



  const fetchData = async () => {
    //console.log(existingApps)
    const appsUrl=`${backendIpAddress}bugbase/list_apps`

    
    
    await axios.get(appsUrl).then(response => {console.log(response)

     for ( var i = 0, len = response.data.length; i < len; i++) {
        setExistingApps(existingApps => [...existingApps, response.data[i]])
      
       

       console.log(response.statusText)
     }
    
    }).catch(err => {console.log(err)
    setNetworkError(true)
    window.alert("Backend not reachable")
    })



}

useEffect(() => {

    
  fetchData();
  var logged = checkIfLogged();

  console.log(logged)

  if (logged) {
    console.log("logged")
    setUserLogged(true)
    // initial set as logged

    checkUsername(logged);

  } else {
    console.log("not logged")
    return
  }
}, []);  


   return(
    
    

    <Container>
      <IssuesContext.Provider value={{issues, setIssues}}>
      <FilteredIssuesContext.Provider value={{filteredIssues, setFilteredIssues}}>
      
      <ExistingAppContext.Provider value={{existingApps, setExistingApps}} >
      <AppContext.Provider value={{chosenApp, setChosenApp}}>
      <NetworkErrorContext.Provider value={{networkError, setNetworkError}} >
      <userLoggedContext.Provider value={{userLogged, setUserLogged}} >
      <Header />
        <Switch>


        
          <Route exact path="/" >
            <ListIssues />
          </Route >
          
          <Route path="/login" >

              <Login />

          </Route>

          <Route path="/signup" >
              <Signup />
          </Route> 

          <Route path="/issue/:id" >
              <IssuePage />
          </Route>

          <Route path="/createIssue" >
                  
                      <CreateIssueForm />
          </Route>                 

          <Route > 
            <NotFound/>
          </Route>


          
          

        </Switch>




        <Footer />
        </userLoggedContext.Provider>
        </NetworkErrorContext.Provider>
        </AppContext.Provider> 
        </ExistingAppContext.Provider>
        </FilteredIssuesContext.Provider>
        </IssuesContext.Provider>
        
    </Container>
    )
   

}

export default App;