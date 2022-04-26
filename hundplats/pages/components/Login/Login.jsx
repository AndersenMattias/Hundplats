import { useState } from 'react';
import { IoMdLogIn } from 'react-icons/io';
import styles from './Login.module.css';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../../../redux/userActionCreators';
import LoadingPage from '../utils/LoadingPage';
import Link from 'next/link';

/**
 * A function that draws the Login component to the screen.
 *
 * Lets the user put in username and password and then sends them to backend
 * to process login.
 * @returns
 * A JSX component with the Login screen.
 */

const Login = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const dispatch = useDispatch();

  const login = async () => {
    if (userName == '' && password == '') {
      setOpen(!open);
      return;
    }
    setLoginInProgress(true);
    dispatch(fetchUsers({ name: userName, password: password })).then((res) => {
      if (res) {
        setError('Felaktigt användarnamn eller lösenord');
        return;
      }
      setUser(true);
      setTimeout(() => {
        //Timeout is used to display a "welcome" message to the user when login succeeds.
        setUserName('');
        setPassword('');
        setUser(false);
        setOpen(!open);
      }, 1200);
    });
  };

  return (
    <div className={`${styles.login} ${open ? styles.active : ''}`}>
      <div className={`${styles.loginmsg} ${user ? styles.slide : ''}`}>
        Välkommen {userName}
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}>
        <label className={styles.label}>
          {/* Användarnamn */}
          <input
            className={styles.input}
            value={userName}
            autoComplete="username"
            placeholder="Användarnamn"
            onChange={(e) => setUserName(e.target.value)}
            onClick={() => {
              setError('');
              setLoginInProgress(false);
            }}
          />
        </label>
        <label className={styles.label}>
          {/* Lösenord */}
          <input
            className={styles.input}
            autoComplete="current-password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => {
              setError('');
              setLoginInProgress(false);
            }}
          />
        </label>
        <button className={styles.hiddenbtn}>login</button>
      </form>
      <span className={styles.error}>{error}</span>
      <span className={styles.registertext}>
        Ny här?{' '}
        <Link href={`/register`}>
          <span className={styles.registerlink}>Registrera</span>
        </Link>{' '}
        nytt konto.
      </span>
      <div className={styles.btn}>
        {loginInProgress && !error ? (
          <div className={styles.spinner}>
            <LoadingPage />
          </div>
        ) : (
          <IoMdLogIn
            onClick={() => {
              if (!open) {
                setOpen(!open);
              } else {
                login();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
