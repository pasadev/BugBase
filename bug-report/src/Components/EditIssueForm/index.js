import React, {useState, useContext} from 'react';
//react-hook-form
import axios from "axios";
import 'react-responsive-modal/styles.css';
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
  

const EditIssueForm = (apps) => {

  const {userLogged, setUserLogged} = useContext(userLoggedContext)


    const [open, setOpen] = useState(false);


    let formAppname = document.querySelector('#appname');
    let formTitle = document.querySelector('#title');
    let formDescription = document.querySelector('#description');

    //console.log(apps.apps)


    const handleEdit =(e) => {
        e.preventDefault();
        console.log(e)

        console.log(userLogged)
        
        console.log(token);
        var id = e.target[0].value;
        var title = e.target[1].value;
        var description = e.target[2].value

        
        

        axios.post(`${backendIpAddress}bugbase/update_issue`,  {

          //headers: { Authorization: 'Bearer ' + token //the token is a variable which holds the token
          //},
            id: id,
            appname: "Robo-e",
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

<Form onSubmit={handleEdit}>
<Form.Group controlId="formId">

    <Form.Control type="id" placeholder="title" />
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
    Edit Issue
  </Button>
</Form>
    </div>
        
)

}

export default EditIssueForm;