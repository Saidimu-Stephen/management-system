/**
 * UserProfileWrapper Component
 *
 * This component serves as a parent component for the UserProfile component.
 * It provides a function as a prop to the UserProfile component, enabling
 * actions to be triggered when a profile click event occurs.
 *
 * @format
 */

import React from "react";
import UserProfile from "@/app/Components/userProfile";

/**
 * UserProfileWrapper function
 *
 * @returns {JSX.Element} The rendered UserProfile component wrapped with the UserProfileWrapper component.
 */
function UserProfileWrapper() {
  /**
   * handleProfileClick function
   *
   * This function serves as the event handler for the profile click event.
   * However, it's currently empty and needs to be filled with specific functionality.
   */
  const handleProfileClick = () => {
    // Handle click event here
  };

  return <UserProfile onProfileClick={handleProfileClick} />;
}

export default UserProfileWrapper;
