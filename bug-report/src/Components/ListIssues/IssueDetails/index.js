import React, {useEffect, useState, useContext} from 'react';
import {  useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import  {Form, Card, Button} from 'react-bootstrap'
import {FiEdit} from "react-icons/fi"


//import { useForm } from "react-hook-form";
import './issueDetails.css';



import {backendIpAddress, userLoggedContext} from "../../_helpers"


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






const IssueDetails = ({Id}) =>{

//const { register, handleSubmit, errors } = useForm();
const {state} = useLocation()

const {userLogged, setUserLogged} = useContext(userLoggedContext);
const [loading, setLoading] = useState(true);

const [comments, setComments] = useState();
const [chosenIssue, setChosenIssue] = useState();
const [editing, setEditing] = useState(false);
const [editTarget, setEditTarget] = useState();
const [selectedEdit, setSelectedEdit] = useState();


let history = useHistory();

function HandleIssueNotExist() {

        history.push("/issueError")
    console.log("redirect")
}

    // FETCH ISSUES DATA
    const fetchData = async () => {
            //console.log(`${Id}`)

        const issueUrl = `${backendIpAddress}bugbase/get_issue/${Id}`;
        const commentsUrl=`${backendIpAddress}bugbase/get_comments/${Id}`;

        await axios.get(issueUrl)
        .then(response => {//console.log(response)


            if (response.data.length !== 0) {
                setChosenIssue(response.data[0])

            } else {
                HandleIssueNotExist()
            }
            
        
        }).catch(err => {console.log(err)
        })

            // useEffect cancels axios call when component is unmounted because issue doesnt exist
       
        axios.get(commentsUrl)
        .then(response => {//console.log(response)
            
            setComments(response.data)
            setLoading(false)
            console.log(response.data)

        }).catch((error) => {
            console.log(error);

              if (axios.isCancel(error)) return;
          });
          
       
    }
    
    // USEEFFECT LOAD ISSUE DATA
    useEffect(() => {
        
        fetchData();
        
      }, []);

    useEffect(() =>  {
            //console.log(comments)
        createCommentsList(comments)
    }, [comments])
    



    const handleEditButton = (e, id) => {
        setEditing(!editing)
        
        console.log(e)
        console.log(id)
        var clickTarget = "";
        
        if (e.target.nodeName == "path") {
            clickTarget = e.target.farthestViewportElement.classList[0]
        } else if (e.target.nodeName == "svg") {
            clickTarget = e.target.classList[0]
        }

        // TODO change FiEdit to png 


        console.log(clickTarget)

        if (clickTarget == "description-edit" ) {
            //console.log(e)
            setEditTarget("description")
        } 
        if (clickTarget == "comment-edit" ) {
            //console.log(e)
            setEditTarget("comment")
        } 
    }
    const handleIssueDescriptionEdit = (e) => {

    console.log(e)
    e.preventDefault()

    console.log(userLogged)
    console.log(chosenIssue)
    
    var id = e.target[0].value;
    var description = e.target[1].value

    setLoading(true)
    

    axios.post(`${backendIpAddress}bugbase/update_issue`,  {

      //headers: { Authorization: 'Bearer ' + token //the token is a variable which holds the token
      //},
        id: id,
        title: chosenIssue.title,
        description: description,
        status: "UNCONFIRMED",
        severity: "",
        owner: userLogged.username
      })
      .then((response) => {
        console.log(response);
          
        if(description !== '') {
            const newChosenIssue = {
                    ...chosenIssue,
                    description:description
                  };
              setChosenIssue(newChosenIssue)
                }
              setLoading(false);
              setEditing(false);
            

      }, (error) => {
        console.log(error);
        setLoading(false);
        //TODO add specific error handling

      });
}

const handleIssueCommentEdit = (e) => {

    console.log(e)
    e.preventDefault()

    console.log(userLogged)
    console.log(chosenIssue)
    
    var id = e.target[0].value;
    var comment = e.target[1].value

    setLoading(true)
    

    axios.post(`${backendIpAddress}bugbase/update_comment`,  {

      //headers: { Authorization: 'Bearer ' + token //the token is a variable which holds the token
      //},
        comment_id: id,
        comment: comment,
        owner: userLogged.username
      })
      .then((response) => {
        console.log(response);
          
              setLoading(false);
              setEditing(false);
            

      }, (error) => {
        console.log(error);
        setLoading(false);
        //TODO add specific error handling

      });
}

useEffect(()=> {
console.log(loading)
}, [loading])
    
    // ADD COMMENT
      const handleSubmit = (e) => {
        //console.log(e)
        e.preventDefault()

        var comment = e.target[0].value;


        console.log(Id);
        axios.post(`${backendIpAddress}bugbase/add_comment`, {

            
            issue_id: Id,
            comment: comment,
            owner: userLogged.username,
           
          })
          .then((response) => {
            //console.log(response);

            fetchData()


          })
        }

    // ITERATE COMMENTS LIST
      const createCommentsList = (comments) =>{
       
            if (comments === undefined) {
                return(''  )
                
                
            } else {
                return (
                <>
                    
                        
                    {comments.map((comment, i )=> {
                        return(
                            
                            <Card className="comment" key={i}>

                                <Card.Header>
                                    {comment.username}
                                </Card.Header>
                                
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        
                                    <p>{comment.comment}</p>
                                    {
                                            //add comment author data
                                        }
                                    <p> {comment.timestamp}</p>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                            
                    )})}
        
                </>)
            }
    }


            return(
                <>

                
                    <Card >
                    <Card.Body>

                
                {loading ? 'loading'
                :   
                        <blockquote className="blockquote mb-0">


                        {
                        
                        editing && editTarget == ("description") ? 
                            <Form onSubmit={handleIssueDescriptionEdit}>


                            <Form.Group controlId="formId">
                                <Form.Control type="hidden" defaultValue={chosenIssue.id} />
                            </Form.Group>

                            <Form.Group controlId="formDescription">
                                <Form.Control type="description" defaultValue={chosenIssue.description} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Edit Issue
                            </Button>
                            </Form>
                        :
                         <>
                         <p>{chosenIssue.description}</p>
                         <footer className="blockquote-footer">{chosenIssue.status} <cite title="Source Title">{chosenIssue.appname}</cite></footer> 
                        </>
                        
                        }
                        <a className="description-edit float-right"><FiEdit className="description-edit" onClick={(e) => handleEditButton(e, chosenIssue.id)}></FiEdit></a>

                        </blockquote>     
                    }

                    </Card.Body>
                    </Card>
                    


                    <div className="comments-list">


                    <br/>

                    


                    {loading ? ""
                    :
                    comments.map((comment, i )=> {
                        console.log(comment)
                            
                        return <Card className="comment" key={i}>
                            {

                            editing && editTarget == ("comment") ? 
                            <>
                            <Card.Header>
                                {comment.username}
                            </Card.Header>
                            
                            <Card.Body>
                            <Form onSubmit={handleIssueCommentEdit}>

                                <Form.Group controlId="formId">
                                    <Form.Control type="hidden" defaultValue={comment.id} />
                                </Form.Group>

                                <Form.Group controlId="formComment">
                                    <Form.Control type="comment" defaultValue={comment.comment} />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Edit Comment
                                </Button>
                                <a className="comment-edit float-right" ><FiEdit className="comment-edit" onClick={(e) => handleEditButton(e, comment.id)}></FiEdit></a>

                            </Form>


                            </Card.Body>
                            </>
                            
                            :
                                <>
                                <Card.Header>
                                    {comment.username}
                                </Card.Header>
                                
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        
                                    <p>{comment.comment}</p>
                                    <a className="comment-edit float-right" ><FiEdit className="comment-edit" onClick={(e) => handleEditButton(e, comment.id)}></FiEdit></a>

                                    {
                                            //add comment author data
                                        }
                                    <p> {comment.timestamp}</p>
                                    </blockquote>
                                </Card.Body>
                                </>
                            }
                            </Card>
                            
                
                    
                    })}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formComment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control type="comment" placeholder="Comment" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit comment
                        </Button>
                        </Form>

                    </div>
                    
        
                </>

                
            )
  
}



export default IssueDetails;