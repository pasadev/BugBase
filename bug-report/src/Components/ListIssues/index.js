import React, {useState, useEffect, useContext, useRef} from 'react';
import {Link} from 'react-router-dom'
import axios from "axios";
import CreateIssueForm from "../CreateIssueForm";
import  {Accordion, Table, Card, Form, Button} from 'react-bootstrap'

import "./listIssues.css";
import EditIssueForm from "../EditIssueForm"
import IssueDetails from "./IssueDetails"
import {FiEdit} from "react-icons/fi"


import {AppContext, ExistingAppContext, IssuesContext, FilteredIssuesContext, userLoggedContext, NetworkErrorContext, backendIpAddress, checkIfLogged} from "../_helpers"

const ListIssues = (props) =>{

    const [issuesList, setIssuesList] = useState();
    const [editing, setEditing] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState();
    const [loading, setLoading] = useState(true);


    const {chosenApp, setChosenApp} = useContext(AppContext);

    const {existingApps, setExistingApps} = useContext(ExistingAppContext);
    const {issues, setIssues} = useContext(IssuesContext);
    const {filteredIssues, setFilteredIssues} = useContext(FilteredIssuesContext)
    const {networkError, setNetworkError} = useContext(NetworkErrorContext);
    const {userLogged, setUserLogged} = useContext(userLoggedContext);



const fetchData = async () => {
    //console.log(existingApps)
    

    const issuesUrl=`${backendIpAddress}bugbase/list_issues/${chosenApp}`;

    await axios.get(issuesUrl)
    .then(response =>  {
        //console.log(response)

        setIssues(response.data)   
        setFilteredIssues(response.data)
        //initial data
        setLoading(false)

    }).catch(err => {console.log(err)
    setNetworkError(true)
    })
}

const handleIssueTitleEdit = (e) => {
    console.log(e)
    e.preventDefault()

    setLoading(true)
    
    var id = e.target[0].value;
    var title = e.target[1].value
    var description = e.target[2].value


    axios.post(`${backendIpAddress}bugbase/update_issue`,  {

      //headers: { Authorization: 'Bearer ' + token //the token is a variable which holds the token
      //},
        id: id,
        title: title,
        description: description,
        status: "UNCONFIRMED",
        severity: "",
        owner: userLogged.username
      })
      .then((response) => {
        console.log(response);
        
        if(title !== '') {
            const newIssuesList = issuesList.map((issue) => {
                if (issue.id == id) {
                    
                  const updatedIssue = {
                    ...issue,
                    title: title
                  };
           
                  return updatedIssue;
                }
           
                return issue;
              });
            
              setIssuesList(newIssuesList)
        }

       
        

        setEditing(false);
        setLoading(false);

        
      }, (error) => {
        console.log(error);
        setLoading(false)
        //TODO add specific error handling

      });
}


const handleEditButton = (e, id) => {
    console.log(e);
    e.preventDefault();
    
    setEditing(!editing)

    setSelectedEdit(id)
}



useEffect(() => {
     fetchData();
    //console.log(existingApps.length)
    
  }, [chosenApp]);


useEffect(() => {
    //console.log('check what data is loaded on component mount')
    //console.log(chosenApp)


if (chosenApp === undefined) {
    console.log("chosenApp still loading")
    setChosenApp(existingApps[0])
    // TODO this is loaded many times
}

   
 });

 useEffect(() => {
     setIssuesList(filteredIssues)
     
 }, [filteredIssues])

 useEffect(() => {
    console.log(issuesList)
 }, [issuesList])


    return(
        <> 
        <p>{networkError ? 'Backend not reachable' : ''}</p>
        <div id="issues-list">
    <h1 className="text-center text-dark">{chosenApp}</h1>
        

<Table className="issuesList">
                <tbody>
        {loading ? <tr></tr>:
        
        issuesList.map((data)=>{
            //console.log(data)
            return <tr key={`${data.id}`} className="bugbase-issue">
                    <td><Accordion >
                    <Card>


                    
                    <Card.Header className="issue-title">
                    

                    {/*
                    <Link  style={{fontSize:20}} to={{pathname: `/issue/+${issues[i].id}`,
                                        state: {chosenIssue: `${issues[i]}`}}} >
                                        
                    </Link>
                    */}
                    {loading ? "" 
                    :
                    <>

                    {editing && selectedEdit == (data.id) ?  
                     
                        <>

                        <Form onSubmit={(e) => {handleIssueTitleEdit(e)}}>

                            <Form.Group controlId="formId">
                                <Form.Control type="hidden" defaultValue={data.id} />
                            </Form.Group>

                            <Form.Group controlId="formTitle">
                                <Form.Control type="title" defaultValue={data.title} />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Control type="hidden" defaultValue={data.description} />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Edit Issue
                            </Button>
                        </Form>
                        </>
                        :
                        <>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    
                    <span >{data.title}</span>
                    </Accordion.Toggle>
                    </>
                    }
                    </>

                    }
                     
                   

                    <span className="float-right">{data.owner}</span>
                    <br/>
                    <a onClick={(e) => handleEditButton(e, data.id)} className="float-right"><FiEdit ></FiEdit></a>
                    <span>{data.created}</span>
                    
                    </Card.Header>

                    
                    
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <>

                        <IssueDetails Id={`${data.id}`} />
                        </>
                    </Card.Body>
                    </Accordion.Collapse>
                    
                </Card>
                
            
                </Accordion>
                </td>
            </tr>
        })}
        </tbody>
            </Table>
       

           {/*  TODO: final design to be decided
            

            */}
        </div>

        {checkIfLogged() ? <><CreateIssueForm /> <EditIssueForm /> </>: ''}

        
       
        </>
    )
}



export default ListIssues;