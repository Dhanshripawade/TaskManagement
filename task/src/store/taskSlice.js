import { createSlice } from "@reduxjs/toolkit";
import { createTask, deletetask, getTask, updateTask, viewTask } from "./taskThunk";

const initialState = {
  user: null,
  task: [],
  taskId : [],
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //get all task
      .addCase(getTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.posts = [];
      })

      //create task
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.task = [];
      })

      //delete task
      .addCase(deletetask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletetask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task = state.task.filter((task) => task._id !== action.payload);
      })
      .addCase(deletetask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      //update task
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = "false";
        state.user = action.payload;
      })

      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      //view task
      .addCase(viewTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(viewTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskId = action.payload;
      })
      .addCase(viewTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
