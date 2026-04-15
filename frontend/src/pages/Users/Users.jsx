import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../features/user/userSlice";
import AddUserForm from "./AddUserForm";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isFetching, isError, refetch, error } = useGetUsersQuery({
    page: currentPage,
    search: searchValue,
  });

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleAddUser = async (formData) => {
    try {
      await addUser(formData).unwrap();
      refetch();
      toast.success("User added successfully!");
      closeModal();
    } catch (error) {
      toast.error(
        `${error?.data?.message || "Failed to add user. Please try again."}`
      );
    }
  };

  const handleEditUser = async (formData, id) => {
    try {
      await updateUser({ id, formData }).unwrap();
      refetch();
      toast.success("User updated successfully!");
      closeModal();
    } catch (error) {
      toast.error(
        `${error?.data?.message || "Failed to update user. Please try again."}`
      );
    }
  };

  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(deleteId).unwrap();
      refetch();
      toast.success("User deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(
        `${
          error?.data?.message ||
          "Failed to delete user. Please try again later."
        }`
      );
    }
  };

  return (
    <section>
      {isError ? (
        <p>Error</p>
      ) : (
        <>
          {showModal && (
            <AddUserForm
              closeModal={closeModal}
              onSave={editingUser ? handleEditUser : handleAddUser}
              editingUser={editingUser}
              isLoading={editingUser ? isUpdating : isAdding}
            />
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && <p>Modal</p>}
        </>
      )}
    </section>
  );
}
