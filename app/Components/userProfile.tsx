/**
 * UserProfile Component
 *
 * This component displays the user profile information and provides functionality
 * to interact with the user profile, such as logging out and closing the profile popup.
 * It also receives a function as a prop to handle profile click events.
 *
 * @format
 */

import { useRouter } from "next/navigation"; // Import useRouter from Next.js


import React, { useState, useRef, useEffect } from "react";
import { VscAccount } from "react-icons/vsc";

// Define the structure of user data
interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define props for the UserProfile component
interface UserProfileProps {
  onProfileClick: () => void; // Function to handle profile click events
}

// Define the structure of user data main
interface UserDataMain {
  userData: UserData;
  expiry: number;
}

/**
 * UserProfile function
 *
 * @param {UserProfileProps} onProfileClick Function to handle profile click events.
 * @returns {JSX.Element} The rendered UserProfile component.
 */
function UserProfile({ onProfileClick }: UserProfileProps) {
  const [issOpen, setIsOpen] = useState<boolean>(false);
  const [userDataMain, setUserData] = useState<UserDataMain | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [expiryTime, setExpiryTime] = useState<number>(0);
  const [expiryTime11, setExpiryTime11] = useState<number>(0);

  const router = useRouter();

  const popupRef = useRef<HTMLDivElement>(null);

  /**
   * toggleDropdown function
   *
   * Toggles the user profile dropdown and calls the onProfileClick function.
   */
  const toggleDropdown = () => {
    if (loggedIn) {
      setIsOpen((prevIsOpen) => !prevIsOpen);
      onProfileClick();
    }
  };

  // Effect hook to check if user data and token exist in local storage

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedData = localStorage.getItem("userData");

    if (storedToken) {
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }

      setToken(storedToken);

      setLoggedIn(true); // Set loggedIn to true if token exists
    } else {
      logOut();
    }
  }, []);

  // Effect hook to check if the user is logged in
  useEffect(() => {
    if (username != "") {
      setIsLoading(true);

      console.log(username);
    }
  }, [username]);

  // Effect hook to update user data when userDataMain changes
  useEffect(() => {
    if (userDataMain) {
      setUsername(userDataMain.userData.username);
      setEmail(userDataMain.userData.email);
      setFirstName(userDataMain.userData.firstName);
      setLastName(userDataMain.userData.lastName);
      setIsLoading(false);

      const { expiry } = userDataMain;
      console.log("Expiry time:", expiry);
      setExpiryTime(expiry);
    }
  }, [userDataMain]);

  function getCurrentTimeInMillis(): number {
    return Date.now();
  }

  // Clear the timer when the component unmounts or when the user logs out
  // return () => clearTimeout(timer);

  //
  //
  //
  useEffect(() => {
    if (expiryTime >= 0) {
      startContinuousTimer((timeInMillis) => {
        console.log(expiryTime);
        console.log(timeInMillis);
      });
    } else {
      if (userDataMain != null) {
        const { expiry } = userDataMain;
        console.log("Expiry time:", expiry);

        setExpiryTime(expiry);
      }
    }
  }, [expiryTime]); // Explicit dependency on expiryTime

  function startContinuousTimer(callback: (timeInMillis: number) => void) {
    if (expiryTime <= 0 || expiryTime === null || expiryTime === undefined) {
      // throw new Error("Expiry time is not set or invalid.");
    }

    // Call the callback immediately with initial time
    const currentTimeInMillis = getCurrentTimeInMillis();
    callback(currentTimeInMillis);

    // Set up interval
    const intervalId = setInterval(() => {
      const currentTimeInMillis = getCurrentTimeInMillis();
      callback(currentTimeInMillis);

      const remainingTime = calculateRemainingTime(
        expiryTime,
        currentTimeInMillis
      );
      setExpiryTime11(remainingTime);

      checkRemainingTime(remainingTime);
      console.log("Time remaining until expiry:", remainingTime);
    }, 1000);
    return intervalId;
  }

  function checkRemainingTime(remainingTime: number): void {
    console.log(remainingTime);
    if (remainingTime < 0) {
      console.log("logging out");
      console.log(remainingTime);
    }
  }

  function calculateRemainingTime(
    expiryTime: number,
    currentTimeInMillis: number
  ): number {
    return expiryTime - currentTimeInMillis;
  }

  // Define function to get current time in milliseconds (e.g., using Date.now())

  //
  //

  // function to direct user to log in page if no user is logged in
  function checkLoginedUser(username: string) {
    if (username == "") {
      console.log(username);
      // logOut();
    }
  }
  const closeProfilePopUp = () => {
    setIsOpen(false);
  };

  /**
   * logOut function
   *
   * Logs out the user by removing token and user data from local storage
   * and redirects to the login page.
   */
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setLoggedIn(false);
    setUserData(null);
    setUsername("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setIsOpen(false);
    localStorage.removeItem("refreshed");
    router.push("/login");
  };

  return (
    <div className='user-profile'>
      {isLoading ? (
        <p>Loading user data...</p>
      ) : (
        <div className='user-profile'>
          <div className='profile-image flex flex-col items-center'>
            <div>
              <VscAccount
                onClick={toggleDropdown}
                className='clickable hover:text-blue-600 text-gray-800 text-3xl mb-4 cursor-pointer'
              />
            </div>

            {issOpen && (
              <div
                className='fixed z-50 top-12 right-6 bg-white shadow-lg rounded-md p-6'
                ref={popupRef}>
                <div className='flex justify-center'>
                  <VscAccount
                    onClick={toggleDropdown}
                    className='clickable hover:text-blue-600 text-gray-800 text-4xl mb-4 cursor-pointer'
                  />
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <div className='flex justify-center py-2'>
                    <p className='text-xl text-gray-600 font-semibold mr-2'>
                      {firstName}
                    </p>
                    <p className='text-xl text-gray-600 font-semibold'>
                      {lastName}
                    </p>
                  </div>
                  <p className='text-lg font-medium text-gray-600 mb-4'>
                    {email}
                  </p>
                  <div className='flex justify-center'>
                    <button
                      onClick={logOut}
                      className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>
                      Log Out
                    </button>
                  </div>
                  <div className='flex pt-4 justify-center'>
                    <button
                      onClick={closeProfilePopUp}
                      className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75'>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default UserProfile;




