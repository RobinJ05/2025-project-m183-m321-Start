import axios from 'axios';

import AuthService from './authenticationService.js';

const backendHost = import.meta.env.VITE_BACKEND;

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
    throw err; // Propagate the error instead of showing alert
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
    throw err; // Propagate the error instead of showing alert
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

export default { loadMountainList, loadMountain, createMountain, uploadMountainImage };
