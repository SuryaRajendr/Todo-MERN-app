import { useEffect, useState } from 'react';

export default function Todo() {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [todos, setTodos]  = useState([]);
    const [error, setError] =   useState("");
    const [message, setMessage] =   useState("");
    const [editId, seteditId] =   useState("");

    const [editTitle,seteditTitle] = useState("");
    const [editDescription,seteditDescription] = useState("");

    const apiUrl = "http://localhost:8000"

    const handlSubmit = () => {
        setError("")
        //check input
        if(title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todos",{
                method:"post",
                headers: {
                    'content-Type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok) {
                    setTodos([...todos,{title,description}])
                    setMessage( "Item added successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                } else {
                    //set error
                    setError("unable to create todo item")
                }
            }).catch((error) =>{
                setError("unable to create todo item")
            })
            
        }
    }

    useEffect(() => {
        getItems()
    },[])

    const getItems = () => {
        fetch(apiUrl+'/todos')
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            setTodos(res)
        })
    }

    const handleEdit = (item) => {
        seteditId(item._id)
        seteditTitle(item.title)
        seteditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("")
        //check input
        if(editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl+"/todos/"+editId,{
                method:"put",
                headers: {
                    'content-Type':'application/json'
                },
                body:JSON.stringify({editTitle,editDescription})
            }).then((res)=>{
                if(res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setMessage( "Item Updated successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                    seteditId(-1)
                } else {
                    //set error
                    setError("unable to create todo item")
                }
            }).catch((error) =>{
                setError("unable to create todo item")
            })
            
        }

    }

    const handleEditCancel = () => {
        seteditId(-1)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE"
            })
            .then(() => {
               const updatedTodos = todos.filter((item) => item._id !== id)
               setTodos(updatedTodos)
            })
        }
    }

    return <>
        <div className="row p-3 bg-success text-light">
        <h1>Todo Project with ERN stack</h1>
        </div>
        <div className="row">
            <h3> Add Item</h3>
            {message && <p className="text-success"> {message}</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control"></input>
                <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control"></input>
                <button className="btn btn-dark" onClick={handlSubmit}>Submit</button>
            </div>
            {error && <p className='text-danger'>{error}</p>}
        </div>
        <div className='row mt-3'>
            <h3> Tasks</h3>
            <ul className='list-group'>
                {
                    todos.map((item) => 
                        <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
                        <div className='d-flex flex-column'>
                            {/* {
                                editId === -1 || editId !== item._id ? <>
                                  <span className='fw-bold'>{item.title}</span>
                                  <span >{item.description}</span>
                                </> : <>
                                <div className="form-group d-flex gap-2">
                                    <input placeholder="Title" onChange={(e) => seteditId(e.target.value)} value={editTitle} className="form-control"  type="text"></input>
                                    <input placeholder="Description" onChange={(e) => seteditDescription(e.target.value)} value={editDescription} className="form-control"  type="text"></input>
                                </div>
                                </>
                            } */}

                        {
                            editId == -1 || editId !==  item._id ? <>
                                <span className="fw-bold">{item.title}</span>
                                <span>{item.description}</span>
                            </> : <>
                            <div className="form-group d-flex gap-2">
                                <input placeholder="Title" onChange={(e) => seteditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                                <input placeholder="Description" onChange={(e) => seteditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                            </div>
                            </>
                        }
                          
                        </div>
                        <div className='d-flex gap-2'>
                           {
                            editId === -1 || editId !== item._id ? <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={handleUpdate}>Update</button>
                           }
                            
                            {
                                 editId === -1 || editId !== item._id ?  <button className='btn btn-danger'onClick={() => handleDelete(item._id)}>Delete</button> : <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>
                            }
                           
                        </div>
                    </li>
                    )
                }

            </ul>
        </div>
    </>
 
}