import React, { useState, useEffect } from "react";
// import {
//   getTask,
//   createTask,
//   deletetask,
//   updateTask,
//   viewTask,
// } from "../store/taskThunk.js";
import { getTask } from "../store/taskThunk.js";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const dispatch = useDispatch();
  const { task, taskId } = useSelector((state) => state.task);

  //get all task
  useEffect(() => {
    dispatch(getTask());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //delete task
  const handleDelete = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletetask(selectedDeleteId)).unwrap();
      dispatch(getTask());
    } catch (err) {
      console.error("Error during deletion:", err);
    } finally {
      setShowDeleteConfirm(false);
      setSelectedDeleteId(null);
    }
  };

  //view task
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleView = async (id) => {
    try {
      const taskData = await dispatch(viewTask(id)).unwrap();
      setSelectedTask(taskData);
      setShowViewModal(true);
    } catch (error) {
      console.error("View error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(
          updateTask({ id: editingId, updatedData: formData })
        ).unwrap();
      } else {
        await dispatch(createTask(formData)).unwrap();
      }
      setFormData({ title: "", description: "" });
      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
      dispatch(getTask());
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  //edit task
  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
    });
    setShowModal(true);
    setIsEditing(true);
    setEditingId(item._id || item.id);
  };

  return (
    <div className="flex justify-center min-h-screen p-4 bg-gray-100">
      <div className="relative w-full max-w-5xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          To-do List
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="absolute px-5 py-2 text-white bg-blue-600 rounded top-6 right-6 hover:bg-blue-700"
        >
          Add Task
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-md shadow table-auto">
            <thead className="text-gray-700 bg-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {task?.length > 0 ? (
                task.map((item, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 border-t border-b">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 border-t border-b">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 border-t border-b">
                      <div className="flex gap-3">
                        <FaEye
                          className="text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => handleView(item._id || item.id)}
                        />
                        <FaEdit
                          className="text-green-600 cursor-pointer hover:text-green-800"
                          onClick={() => handleEdit(item)}
                        />
                        <FaTrash
                          className="text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() => handleDelete(item._id || item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No tasks available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded shadow-lg w-80">
              <h2 className="mb-4 text-lg font-semibold text-center">
                Are you sure you want to delete this task?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/*  Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  rows="3"
                  required
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Task Modal */}
        {showViewModal && selectedTask && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="relative w-full max-w-md p-6 mx-auto mt-20 bg-white shadow-xl rounded-xl">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute text-xl font-bold text-red-600 top-3 right-3 hover:text-red-800"
              >
                ×
              </button>

              <h2 className="mb-4 text-2xl font-bold text-gray-800 ">
                Task Details
              </h2>

              <ul className="space-y-3 text-black">
                <li className="pb-1 ">
                  <span className="font-medium">ID:</span>{" "}
                  <span className="break-all">{selectedTask._id}</span>
                </li>
                <li className="pb-1 ">
                  <span className="font-medium">Title:</span>{" "}
                  {selectedTask.title}
                </li>
                <li className="pb-1">
                  <span className="font-medium">Description:</span>{" "}
                  {selectedTask.description}
                </li>
                <li className="pb-1 ">
                  <span className="font-medium">Status:</span>{" "}
                  {selectedTask.status}
                </li>
                <li className="pb-1 ">
                  <span className="font-medium">Created At:</span>
                  {selectedTask.createdAt}
                </li>
                <li>
                  <span className="font-medium">Updated At:</span>{" "}
                  {selectedTask.updatedAt}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
