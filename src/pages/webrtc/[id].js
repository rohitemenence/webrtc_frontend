import React from 'react';
import { useRouter } from 'next/router';

import UserProfile from '../userProfile/userProfile';

const User = () => {
    const router = useRouter();
    const { id } = router.query;


    const user = {
        id: 1,
        name: 'John Doe',
        profilePic: '/profile-pic-1.jpg', // Replace with the actual path to the profile picture
      };


      if (id !== user.id) {
        return <div>Loading...</div>; // Handle loading state while fetching user data
      }

      return <UserProfile user={user} />;
}


export default User;


