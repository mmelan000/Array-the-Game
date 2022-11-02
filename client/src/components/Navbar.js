function Navbar({ currentPage, handlePageChange }) {
  return (
    <nav bg='dark' variant='dark' expand='lg'>
      <div
        onClick={() => handlePageChange('Home')}
        className={currentPage === 'Home'}
        href='#home'
      >
        Home
      </div>
      <div
        onClick={() => handlePageChange('Account')}
        className={currentPage === 'Account'}
        href='#Account'
      >
        Account
      </div>
      <div
        onClick={() => handlePageChange('Forums')}
        className={currentPage === 'Forums'}
        href='#Forums'
      >
        Forums
      </div>
      <div
        onClick={() => handlePageChange('LFG')}
        className={currentPage === 'LFG'}
        href='#LFG'
      >
        LFG
      </div>
      <div
        onClick={() => handlePageChange('Lobby')}
        className={currentPage === 'Lobby'}
        href='#Lobby'
      >
        Lobby
      </div>
      <div
        onClick={() => handlePageChange('Login')}
        className={currentPage === 'Login'}
        href='#Login'
      >
        Login
      </div>
      <div
        onClick={() => handlePageChange('Signup')}
        className={currentPage === 'Signup'}
        href='#Signup'
      >
        Signup
      </div>
    </nav>
  );
}

export default Navbar;
