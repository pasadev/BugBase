import React, {useEffect, useState, useContext} from 'react';
import { Redirect} from "react-router-dom"
import { useParams, useLocation, useHistory } from "react-router-dom";
import axios from "axios";

//import { useForm } from "react-hook-form";
import './issuePage.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {NetworkErrorContext} from "../_helpers"

import {backendIpAddress} from "../_helpers"


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






const IssuePage = () =>{

  
//const { register, handleSubmit, errors } = useForm();
const {state} = useLocation()

const {id} = useParams();

const [comments, setComments] = useState();
const [chosenIssue, setChosenIssue] = useState();
const [loading, setLoading] = useState(true)
const {networkError, setNetworkError} = useContext(NetworkErrorContext);


let history = useHistory();

function HandleIssueNotExist() {

        history.push("/issueError")
    console.log("redirect")
}
    const fetchData = async () => {


        const issueUrl = `${backendIpAddress}bugbase/get_issue/${id}`;
        const commentsUrl=`${backendIpAddress}bugbase/get_comments/${id}`;

        await axios.get(issueUrl)
        .then(response => {console.log(response)

            console.log(response.data.length)

            if (response.data.length !== 0) {
                console.log("notempty")
                setChosenIssue(response.data[0])

                setLoading(false)
            } else {
                console.log("empty")
                HandleIssueNotExist()
            }
            
        
        }).catch(err => {console.log(err)
            setNetworkError(true)
        })

       
        axios.get(commentsUrl)
        .then(response => {console.log(response)
            setComments(response.data)
        
        }).catch((error) => {
            console.log(error);

          });
          
        
    
    }
    
    
    useEffect(() => {
        
        fetchData();
        
      }, []);
    


      const handleSubmit = (e) => {
        console.log(e.target[0])
        e.preventDefault()
        console.log(e)

        var comment = e.target[0].value;


        axios.post(`${backendIpAddress}bugbase/add_comment`, {
            
            issue_id: {id},
            comment: comment,
           
          })
          .then((response) => {
            console.log(response);
                createCommentsList()
              
          })
        }

      
      const createCommentsList = (comments) =>{
       
            if (comments === undefined) {
                return(""  )
                
                
            } else {
                return (
                <>
                    
                    <div className="container">
                        
                    {comments.map((comment, i )=> {
                        return(
                            <div className="card" key={i}>
                                
                                <div className="card-body">
                                    <blockquote className="blockquote mb-0">
                                    <p>{comment[1]}</p>
                                    <footer className="blockquote-footer">{comment[0]}</footer>
                                    </blockquote>
                                </div>
                            </div>
                    )})}
                    </div>
        
                </>)
            }
    }
            return(
                <>

                {networkError ? 'Backend not reachable' 
                
                :
                
                <div className="container">
                
                {loading ? 'loading'
                :
                
                <>         
                <div className="card" >
                <div className="card-header">
                    {chosenIssue.title}
                </div>
                <div className="card-body">
                    <blockquote className="blockquote mb-0">
                    <p>{chosenIssue.description}</p>
                    <footer className="blockquote-footer">{chosenIssue.status} <cite title="Source Title">{chosenIssue.appname}</cite></footer>
                    </blockquote>
                </div>
            </div>
                
            <div className="comments container">


            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formComment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control type="comment" placeholder="Comment" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit comment
                </Button>
                </Form>

            

            {createCommentsList(comments) }

            </div>
                
            </>
                }
           
            </div>
                }
              


                </>

                
            )
  
}



export default IssuePage;