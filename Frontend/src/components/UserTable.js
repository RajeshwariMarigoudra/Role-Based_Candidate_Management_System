import React from 'react';

const UserTable = ({ users }) => {
  // Ensure that the users array is not undefined or null
  if (!users || users.length === 0) {
    return <div>No users found</div>;
  }
  console.log(users);
  
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          // Make sure each property you're accessing is not undefined
          const name = user.username ? user.name : 'N/A';
          const email = user.email ? user.email : 'N/A';
          const role = user.role ? user.role : 'N/A';

          return (
            <tr key={index}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{role}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserTable;
