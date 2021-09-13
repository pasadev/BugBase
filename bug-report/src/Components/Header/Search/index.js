import React, {useEffect, useState, useContext} from 'react';
import axios from "axios";
import './search.css'

import Form from 'react-bootstrap/Form';
import {Redirect, useHistory} from 'react-router-dom';
    

import {IssuesContext, NetworkErrorContext, FilteredIssuesContext} from "../../_helpers"
import { FormControl } from 'react-bootstrap';


const Search = (props) =>{



    const [searchTerm, setSearchTerm] = useState("");
    
    const {issues, setIssues} = useContext(IssuesContext);
    const {filteredIssues, setFilteredIssues} = useContext(FilteredIssuesContext);


    const {networkError, setNetworkError} = useContext(NetworkErrorContext)


    const filterIssues = (issues, searchTerm) => {
      if (!searchTerm) {
          return issues;
      }
      if (networkError) {
        return;
      }

  
      return issues.filter((issue) => {
          const issueName = issue.title.toLowerCase();
          return issueName.includes(searchTerm.toLowerCase());
      });
  };

    //const filteredIssues = filterIssues(issues, searchTerm);


    
    const handleChange = event => {
      setSearchTerm(event.target.value);
      //console.log(event.target.value)
      //console.log(searchTerm)
    }
    // the functions in handleChange are executed with a delay
    // putting setFilteredIssues into useEffect linked to searchTerm
    // fixes the character input lag
    useEffect(() => {
      console.log(searchTerm)
      setFilteredIssues(filterIssues(issues, searchTerm));
    }, [searchTerm])
  
            return(
                <>

<Form inline onSubmit={filterIssues}>
<label htmlFor="header-search">            
    <span className="visually-hidden">Search project issues</span>
    </label>
    {// label can be read by screenreader for accessibility
    }
  <Form.Group controlId="header-search">
    <Form.Control className="sm" type="text" placeholder="search issues" value={searchTerm} onChange={handleChange} />
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>
  </Form>
                                
              </>
                
            )
  
}



export default Search;