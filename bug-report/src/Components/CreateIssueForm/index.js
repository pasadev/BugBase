import React, {useState, useContext} from 'react';
import { useForm } from "react-hook-form";
//react-hook-form
import axios from "axios";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
//modal is a holdover
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import {backendIpAddress, userLoggedContext} from "../_helpers"


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
  

const CreateIssueForm = (apps) => {

  const {userLogged, setUserLogged} = useContext(userLoggedContext)



    //console.log(apps.apps)


    const handleCreate =(e) => {
        e.preventDefault();
        console.log(e)

        console.log(userLogged)
        
        console.log(token);
        var appname = e.target[0].value;
        var title = e.target[1].value;
        var description = e.target[2].value

        
        

        axios.post(`${backendIpAddress}bugbase/add_issue`,  {

          //headers: { Authorization: 'Bearer ' + token //the token is a variable which holds the token
          //},
            appname: appname,
            title: title,
            description: description,
            status: "UNCONFIRMED",
            severity: "",
            owner: userLogged
          })
          .then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);

        console.log(token);
          });
          
    }

    
// POST  pelle:8081/add_issue
// echo '{"appname": "FutureApp", "title": "FutureBug", "description": "There will be bugs", "status": 0, "severity": 1, "owner": "Unassigned"}'
return (

    <div>

<Form onSubmit={handleCreate}>
  <Form.Group controlId="formAppname">
    <Form.Label>App name</Form.Label>
    <Form.Control type="app" placeholder="Application" />
  </Form.Group>


  <Form.Group controlId="formTitle">
    <Form.Label>Title</Form.Label>
    <Form.Control type="title" placeholder="Title" />
  </Form.Group>

  <Form.Group controlId="formDescription">
    <Form.Label>Description</Form.Label>
    <Form.Control type="description" placeholder="Description" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Create Issue
  </Button>
</Form>
    </div>
        
)

}

export default CreateIssueForm;