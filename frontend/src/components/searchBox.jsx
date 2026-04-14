import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({history}) => {
  const [keyword, setKeyword] = useState('')
  const submitHandler = (e) => {
      e.preventDefault ()
      if(keyword.trim()){
        history.push(`/search/${keyword}`)
      }else{
          history.push(`/`)
      }
  }
  return (
    <Form onSubmit={submitHandler} className='nav-search-form'>
      <Form.Control
        type='text'
        value={keyword}
        name='q'
        placeholder='Search students...'
        className='nav-search-input'
        onChange={(e) => setKeyword(e.target.value)}
      ></Form.Control>
      <Button className='nav-search-button' type='submit' variant='outline-light'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
