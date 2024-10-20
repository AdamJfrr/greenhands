import classes from './Search.module.css';
import React,{useState,useEffect} from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import UserCard from '../components/usercard/UserCard';
import { Timestamp } from 'firebase/firestore';

const Search = () => {
  const [inputValue,setInputValue] = useState('Berlin');
  const [searchValue,setSearchValue] = useState(inputValue)
  const [users, setUsers] = useState([]);

  const changeInput = (e) => {
    const input = e.target.value;
    const value = input.charAt(0).toUpperCase()+input.slice(1).toLowerCase()
    setInputValue(value);
  }

  useEffect(()=>{
    const fetchUponLoading = async() =>{
      try {
        const usersCollection = collection(db, 'users');
        const q = query(
          usersCollection,
          where('city', '==', inputValue),
          where('becomeMember', '==', true)  
        );
        const querySnapshot = await getDocs(q);

        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(usersList)
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    }
     fetchUponLoading();
  },[])

  const fetchUsers = async() => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('city', '==', inputValue));
      const querySnapshot = await getDocs(q);

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchValue(inputValue)
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  }
  console.log(users)

  const formatDate = (timestamp) => {
   if (timestamp instanceof Timestamp) {
     return timestamp.toDate().toLocaleDateString();
   }
   return '';
  };

  return (
    <div className={classes.searchPage}>
      <div className={classes.searchBar}>
        <div className={classes.label}>Enter your city</div>
        <input onChange={changeInput} type='text' value={inputValue}/>
        <div className={classes.buttonDiv}><button onClick={fetchUsers} type='button'>&#x2192;</button></div>
      </div>
      <div className={classes.header}>Your results in {searchValue} ({users.length})</div>
      <div className={classes.results}>
        {users.map(element=><UserCard key={element.id} uid={element.id} rating={element.rating} source={element.image} name={element.firstName + ' ' + element.lastName.charAt(0)} memberDate={formatDate(element.createdAt)}/>)}
      </div>
    </div>
  )
}
export default Search;
