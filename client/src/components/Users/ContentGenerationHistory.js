import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaRegEdit,
  FaTrashAlt,
  FaEye,
  FaPlusSquare,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { profileAPI } from "../../apis/usersAPI";
import {
  updateContentAPI,
  deleteContentAPI,
} from "../../apis/contentHistoryAPI";
import StatusMessage from "../Alert/StatusMessage";

const ContentGenerationHistory = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, isError, data, error } = useQuery({
    queryFn: profileAPI,
    queryKey: ["profile"],
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteContentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateContentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsEditModalOpen(false);
    },
  });

  // Handlers
  const handleView = async (content) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const handleEdit = (content) => {
    setSelectedContent(content);
    setEditedContent(content.content);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (content) => {
    setContentToDelete(content);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contentToDelete._id);
      setIsDeleteModalOpen(false);
      setContentToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        contentId: selectedContent._id,
        content: editedContent,
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  //----- Loading State -----
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  //----- Error State -----
  if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] rounded-lg p-1">
            <div className="bg-white rounded-md px-6 py-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470]">
                Content Generation History
              </h2>
            </div>
          </div>
        </div>

        <Link
          to="/generate-content"
          className="inline-block mb-6 bg-gradient-to-r from-[#432752] via-[#5a3470] to-[#6d4088] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 flex items-center shadow-md"
        >
          <FaPlusSquare className="mr-2" /> Create New Content
        </Link>

        <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl border border-gray-100">
          {!data?.user?.history || data?.user?.history?.length <= 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg font-medium">
                No History Found
              </p>
              <p className="text-gray-400 mt-2">
                Start generating content to see your history here
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data?.user?.history?.map((content) => (
                <li
                  key={content._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between space-x-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {content?.content}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(content?.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleView(content)}
                      className="p-2 hover:bg-green-50 rounded-full transition-colors duration-150"
                    >
                      <FaEye className="text-green-500 hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(content)}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-150"
                    >
                      <FaRegEdit className="text-blue-500 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(content)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors duration-150"
                    >
                      <FaTrashAlt className="text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] relative">
            {/* Close button */}
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4 pr-8">Content Details</h3>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(80vh-8rem)] mb-4 pr-2">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedContent?.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] relative">
            {/* Close button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4 pr-8">Edit Content</h3>

            {/* Scrollable textarea */}
            <div className="mb-4">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-40 p-2 border rounded-lg focus:ring-2 focus:ring-[#432752] focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-2 border-t pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-gradient-to-r from-[#432752] via-[#5a3470] to-[#6d4088] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this content? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setContentToDelete(null);
                }}
                className="px-4 py-2 rounded text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationHistory;
