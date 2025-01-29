import React, {useState, useEffect, createContext, useContext} from 'react';

const UserContextProvider = createContext();

export const UserContext = ({children}) => {
  const [user, setuser] = useState(null);
  const [token, settoken] = useState(null);
  const [userloading, setuserloading] = useState(true);
  const [measure, setmeasure] = useState(null);
  const [meals, setmeals] = useState(null);
  const [singlemeal, setsinglemeal] = useState(null);
  const [nutrients, setnutrients] = useState(null);
  const [ingredients, setingredients] = useState(null);
  const [shoppinglist, setshoppinglist] = useState([]);
  const [exercises, setexercises] = useState([]);
  const [userexercises, setuserexercises] = useState([]);

  const [supersets, setsupersets] = useState([]);
  const [records, setrecords] = useState(null);
  const [exId, setExId] = useState(null);
  const [email, setemail] = useState('');

  return (
    <UserContextProvider.Provider
      value={{
        user,
        setuser,
        userloading,
        setuserloading,
        measure,
        setmeasure,
        meals,
        setmeals,
        singlemeal,
        setsinglemeal,
        nutrients,
        setnutrients,
        ingredients,
        setingredients,
        shoppinglist,
        setshoppinglist,
        exercises,
        setexercises,
        supersets,
        setsupersets,
        records,
        setrecords,
        token,
        settoken,
        userexercises,
        setuserexercises,
        setExId,
        exId,
        email,
        setemail,
      }}>
      {children}
    </UserContextProvider.Provider>
  );
};

export const useUser = () => useContext(UserContextProvider);
