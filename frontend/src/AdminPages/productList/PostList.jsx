import React, { useContext, useEffect, useState } from 'react';
import './PostList.css';
import AxiosAdminJwt from '../../Axios/AxiosAdmin';
const PostList = () => {
  const [posts, setPosts] = useState();
  const AxiosAdmin = AxiosAdminJwt()
  useEffect(()=>{
   const getPosts = async()=>{
     await AxiosAdmin.get('reportedPosts').then((result)=>{
       console.log(result.data)
       setPosts(result.data)
     }).catch((error)=>{
      console.log(error)
     })
   }
   getPosts()
  },[])

  const handleBlockPost = (postId) => {
    const updatedPosts = posts.map((post) =>
      post._id === postId ? { ...post, blocked: !post.blocked } : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="userList">
    <table>
      <thead>
        <tr>
          <th>UserId</th>
          <th>Post Id</th>
          <th>No of reports</th>
          <th>Blocked</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts?.map((post) => (
          <tr key={post._id}>
            <td>{post.userId}</td>
            <td>{post._id}</td>
            <td>{post.reports.length}</td>
            <td>{post.blocked ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => handleBlockPost(post._id)}>
                {post.blocked ? 'Unblock' : 'Block'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default PostList;


// import "./productList.css";
// import { DataGrid } from "@material-ui/data-grid";
// import { DeleteOutline } from "@material-ui/icons";
// import { productRows } from "../../dummyData";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function ProductList() {
//   const [data, setData] = useState(productRows);

//   const handleDelete = (id) => {
//     setData(data.filter((item) => item.id !== id));
//   };

//   const columns = [
//     { field: "id", headerName: "ID", width: 90 },
//     {
//       field: "product",
//       headerName: "Product",
//       width: 200,
//       renderCell: (params) => {
//         return (
//           <div className="productListItem">
//             <img className="productListImg" src={params.row.img} alt="" />
//             {params.row.name}
//           </div>
//         );
//       },
//     },
//     { field: "stock", headerName: "Stock", width: 200 },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       width: 160,
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 150,
//       renderCell: (params) => {
//         return (
//           <>
//             <Link to={"/product/" + params.row.id}>
//               <button className="productListEdit">Edit</button>
//             </Link>
//             <DeleteOutline
//               className="productListDelete"
//               onClick={() => handleDelete(params.row.id)}
//             />
//           </>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="productList">
//       <DataGrid
//         rows={data}
//         disableSelectionOnClick
//         columns={columns}
//         pageSize={8}
//         checkboxSelection
//       />
//     </div>
//   );
// }
