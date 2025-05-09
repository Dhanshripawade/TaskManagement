
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


//Create task
export const createTask = createAsyncThunk(
    'auth/createTask',
    async (formData, thunkAPI) => {
      try {
        const response = await axios.post('http://localhost:5000/api/tasks/', formData);
        return response.data;
      } catch (err) {
       
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
      }
    }
  );

//Get all task
  export const getTask = createAsyncThunk("task/getTask", async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/tasks/',);
        console.log(response.data);
        return response.data;
      
        
    }   catch (e) {
        throw new Error(e.response?.data?.message || "Fetching error");
    }
});

//Delete task
export const deletetask = createAsyncThunk(
    'task/deletetask',
    async (id, { rejectWithValue }) => {
      try {
        console.log("Deleating task with ID: " , id);
        
        const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  //Update Task
  export const updateTask = createAsyncThunk(
    'task/updateTask',
    async ({ id, updatedData }, thunkAPI) => {
      try {
        const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

  //View Task
  export const viewTask = createAsyncThunk("task/viewTask", async (id, thunkAPI) => {
  try {
    
  
    const response = await axios.get(`http://localhost:5000/api/tasks/${id}`)
      
    console.log(response.data);
    return response.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Get data by ID failed");
  }
});

