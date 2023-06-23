import React from 'react';
import Head from 'next/head';

const UserProfile = ({ user }) => {
  return (
    <div>
      <Head>
        <title>User Profile</title>
      </Head>

      <h1>User Profile</h1>

      <div>
        <img src={user.profilePic} alt="Profile Picture" />
        <h2>{user.name}</h2>
        {/* Display more profile details */}
      </div>

      {/* Add additional content for the user profile page */}
    </div>
  );
};

export default UserProfile;
