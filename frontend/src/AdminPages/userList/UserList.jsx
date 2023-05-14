import React, { useContext, useEffect, useState } from 'react';
import './userList.css';
import AxiosAdminJwt from '../../Axios/AxiosAdmin';
import { AuthContext } from '../../context/AuthContext';
import Pagination from '../../AdminComponents/Pagination/Pagination';

const UserList = () => {
  const [users, setUsers] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  console.log(users, lastPostIndex, firstPostIndex)
  const {AdminAuth} = useContext(AuthContext)
  const AxiosAdmin = AxiosAdminJwt()
  useEffect(()=>{
    const loadUsers = async()=>{
      await AxiosAdmin.get("users").then((result)=>{
        setUsers(result.data)
      }).catch((error)=>{
        console.log(error)
      })
    }
    loadUsers()
  },[])
  
  const currentPosts = users?.slice(firstPostIndex, lastPostIndex)
  console.log(currentPosts)
  const handleBlockUser = async(userId) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, blocked: !user.blocked } : user
    );
    await AxiosAdmin.post("block", {userId : userId}).then((result)=>{
      console.log(result.data)
    }).catch((error)=>{
      console.log(error)
    })
    setUsers(updatedUsers);
  };

  return (
    <div className="userList">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Blocked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentPosts?.map((user) => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.mobile}</td>
            <td>{user?.blocked ? 'Yes' : 'No'}</td>
            <td>
              <button className='tableUserButton' onClick={() => handleBlockUser(user._id)}>
                {user.blocked ? 'Unblock' : 'Block'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <Pagination totalPosts={users?.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
    </div>
  );
};

export default UserList;



// import "./userList.css";
// // import { DataGrid } from "@material-ui/data-grid";
// // import { DeleteOutline } from "@material-ui/icons";
// import { userRows } from "../../dummyData";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function UserList() {
//   const [data, setData] = useState(userRows);

//   const handleDelete = (id) => {
//     setData(data.filter((item) => item.id !== id));
//   };
  
//   const columns = [
//     { field: "id", headerName: "ID", width: 90 },
//     {
//       field: "user",
//       headerName: "User",
//       width: 200,
//       renderCell: (params) => {
//         return (
//           <div className="userListUser">
//             <img className="userListImg" src={params.row.avatar} alt="" />
//             {params.row.username}
//           </div>
//         );
//       },
//     },
//     { field: "email", headerName: "Email", width: 200 },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//     },
//     {
//       field: "transaction",
//       headerName: "Transaction Volume",
//       width: 160,
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 150,
//       renderCell: (params) => {
//         return (
//           <>
//             <Link to={"/user/" + params.row.id}>
//               <button className="userListEdit">Edit</button>
//             </Link>
//             Hello
//             {/* <DeleteOutline
//               className="userListDelete"
//               onClick={() => handleDelete(params.row.id)}
//             /> */}
//           </>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="userList">
//       {/* <DataGrid
//         rows={data}
//         disableSelectionOnClick
//         columns={columns}
//         pageSize={8}
//         checkboxSelection
//       /> */}
//       Hello
//     </div>
//   );
// }
