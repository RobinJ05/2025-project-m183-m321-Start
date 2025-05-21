import React, { useState, useEffect } from "react";
import './App.css'
import Menu from './components/Menu';
import Mountain from './components/Mountain';
import Login from './components/Login';
import LoginKeycloak from './components/LoginKeycloak';
import Register from './components/Register';
import MountainGallery from './components/MountainGallery';
import Statistics from './components/Statistics';
import mountainService from './services/mountainService';
import AuthService from './services/authenticationService';

function App() {
  // menu
  const menuIdHome = 'menuIdHome';
  const menuIdLogin = 'menuIdLogin';
  const menuIdRegister = 'menuIdRegister';
  const menuIdAddMountain = 'menuIdAddMountain';
  const menuIdStatistics = 'menuIdStatistics';
  const ELEVATION_THRESHOLD = 3000; // Configurable elevation threshold in meters
  const [selectedItem, setSelectedItem] = useState(menuIdHome);
  
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);


  const useKeycloak = true; // Flag to determine which login component to use also change backend


  const [selectedMountain, setSelectedMountain] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  const fetchStatistics = async () => {
    try {
      const stats = await mountainService.getStatistics(ELEVATION_THRESHOLD);
      setStatistics(stats);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  const fetchMountains = async () => {
    try {
      // Fetch list of mountain IDs
      const mountainList = await mountainService.loadMountainList();
      // Fetch details for each mountain
      const mountainDetails = await Promise.all(
        mountainList.map(async (mountainId) => {
          return mountainService.loadMountain(mountainId);
        })
      );
      setMountains(mountainDetails);
    } catch (err) {
      console.error("Failed to load mountains:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Keycloak
    AuthService.initKeycloak(() => {
      console.log('Keycloak initialized successfully');
      const isLoggedIn = AuthService.isLoggedIn();
      setIsAuthenticated(isLoggedIn);
      if (isLoggedIn) {
        // Get roles from token
        const token = AuthService.getToken();
        let roles = [];
        if (token) {
          try {
            const parsed = JSON.parse(atob(token.split('.')[1]));
            roles = parsed.realm_access?.roles || [];
          } catch (e) {
            console.error('Failed to parse token for roles', e);
          }
        }
        setUserRoles(roles);
        fetchStatistics();
      }
    }); 
    fetchMountains();
  }, []);

  const handleLoginSubmit = () => {
    AuthService.doLogin();
  };

  const handleMountainSelect = (mountain) => {
    setSelectedMountain(mountain);
    setSelectedItem(menuIdAddMountain);
  };

  if (loading) {
    return <div>Die Berge werden geladen ...</div>;
  }
  if (mountains.length === 0) {
    return <div>Es wurden keine Berge gefunden. Versuchen Sie es nochmals.</div>;
  }

  // Update menu items based on authentication state

  const canSeeStatistics = isAuthenticated && userRoles.includes('statistics');

  const availableMenuItems = [
    { name: 'Home', id: menuIdHome },
    { name: 'Login', id: menuIdLogin },
    { name: 'Registrieren', id: menuIdRegister },
    ...(isAuthenticated ? [
      { name: 'Berg hinzufügen', id: menuIdAddMountain },
      ...(canSeeStatistics ? [{ name: 'Statistiken', id: menuIdStatistics }] : [])
    ] : [])
  ];

  return (
    <div>
      <Menu setSelectedItem={setSelectedItem} menuItems={availableMenuItems} isAuthenticated={isAuthenticated} />
      {selectedItem === menuIdHome && <MountainGallery mountains={mountains} onMountainSelect={handleMountainSelect} />}
      {selectedItem === menuIdAddMountain && <Mountain selectedMountain={selectedMountain} />}
      {selectedItem === menuIdLogin && 
        (useKeycloak ? 
          <LoginKeycloak handleLoginSubmit={handleLoginSubmit} /> : 
          <Login />)
      }
      {selectedItem === menuIdRegister && <Register />}
      {selectedItem === menuIdStatistics && canSeeStatistics && <Statistics statistics={statistics} />}
    </div>
  )
}

export default App
