import axios from 'axios';

import AuthService from './authenticationService.js';

let backendHost = import.meta.env.VITE_BACKEND;
//if(process.env.CONTAINERISED === "true")
  //backendHost = `${process.env.API_HOST}:${process.env.API_PORT}`;

//console.log(process.env);

async function loadMountainList() {
  try {
    console.log("start loadMountainList");
    console.log("Cookies:", document.cookie);
    let res = await axios.get(`${backendHost}/mnts`, { withCredentials: true });
    let mntList = res.data;
    console.log("end loadMountainList: ", mntList);
    return mntList;
  } catch (err) {
    console.error("Error loading mountain list:", err);
    throw err;
  }
}

async function loadMountain(mntId) {
  try {
    let res = await axios.get(`${backendHost}/mnts/${mntId}`, { withCredentials: true });
    let mnt = res.data;
    console.log("loadMountain: ", mnt);
    return mnt;
  } catch (err) {
    console.error("Error loading mountain:", err);
    throw err;
  }
}

async function createMountain(mountainData) {
  try {
    let token = AuthService.getToken();
    console.log("token: ", token);
    let res = await axios.post(`${backendHost}/mnts`, mountainData, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    let mnt = res.data;
    console.log("createMountain: ", mnt);
    return mnt;
  } catch (err) {
    alert(err.message, "error");
  }
}

async function updateMountain(mountainData) {
  try {
    let token = AuthService.getToken();
    console.log("token: ", token);
    let res = await axios.put(`${backendHost}/mnts/${mountainData.id}`, mountainData, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    let mnt = res.data;
    console.log("updateMountain: ", mnt);
    return mnt;
  } catch (err) {
    alert(err.message, "error");
  }
}

async function uploadMountainImage(mntId, imageFile) {
  try {
    const formData = new FormData();
    formData.append('img', imageFile);
    
    let res = await axios.put(`${backendHost}/mnts/${mntId}/img`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    let mnt = res.data;
    console.log("uploadMountainImage: ", mnt);
    return mnt;
  } catch (err) {
    alert(err.message, "error");
  }
}

async function deleteMountain(mountainId) {
  try {
    let token = AuthService.getToken();
    await axios.delete(`${backendHost}/mnts/${mountainId}`, { 
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return true;
  } catch (err) {
    alert(err.message, "error");
    return false;
  }
}

async function getStatistics(elevationLevel) {
  try {
    let token = AuthService.getToken();
    let res = await axios.get(`${backendHost}/statistics/${elevationLevel}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching statistics:", err);
    throw err;
  }
}

export default { loadMountainList, loadMountain, createMountain, updateMountain, uploadMountainImage, deleteMountain, getStatistics };
