import React, { useEffect, useState } from "react";
import Layout from "../../../layouts";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSubCategory,
  subCategoryList,
} from "../../../toolkit/action/shoppingAction";
import { IMAGE_URL } from "../../../utils/endpoints";
import Form from "./Form";
import { BsPlus } from "react-icons/bs";
import TopBar from "../../../common/TopBar";
import Pagination from "../../../common/Pagination";
import Options from "../../../common/Options";
import Confrimation from "../../../common/Confirmation";

const SubCategories = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    form: false,
    deleteModal: false,
  });
  const [editData, setEditData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { subCategoriesList, loading, fetchLoad } = useSelector(
    (state) => state.shoppingReducer
  );

  // handle modals
  const handleOpenModal = (name) => {
    setModal({ ...modal, [name]: true });
  };
  const handleCloseModal = (name) => {
    setModal({ ...modal, [name]: false });
  };

  // handle delete
  const handleDelete = async () => {
    const response = await dispatch(removeSubCategory(editData._id));
    if (response?.payload?.Status) {
      handleCloseModal("deleteModal");
    }
  };

  // Pagination Logic
  const perPageItems = 10;
  const totalItems = subCategoriesList?.length;
  const trimStart = (currentPage - 1) * perPageItems;
  const trimEnd = trimStart + perPageItems;
  const handlePrev = () => currentPage !== 1 && setCurrentPage(currentPage - 1);
  const handleForw = () => {
    trimEnd <= totalItems && setCurrentPage(currentPage + 1);
  };

  // useEffect
  useEffect(() => {
    dispatch(subCategoryList());
  }, [dispatch]);
  return (
    <>
      <TopBar
        text="New Sub Category"
        title="Sub Categories"
        icon={<BsPlus />}
        action={() => handleOpenModal("form")}
      />

      {/* Table */}
      <div class="w-full bg-white my-3 rounded shadow-md p-3 mx-auto overflow-auto">
        <div className="rounded text-left whitespace-no-wrap w-full border overflow-auto">
          <table class="table-auto divide-y whitespace-nowrap w-full text-left">
            <thead className="bg-gray-100 title-font tracking-wider text-sm">
              <tr>
                <th class="px-4 py-3 rounded-tl">Image</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Description</th>
                <th class="px-4 py-3 rounded-tr ">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {subCategoriesList?.slice(trimStart, trimEnd).map((item) => {
                return (
                  <tr key={item._id} className="text-sm ">
                    <td class="px-4 py-3">
                      <img
                        alt={item._id}
                        src={`${IMAGE_URL}${item.image}`}
                        className="w-9 h-9 rounded-full"
                      />
                    </td>
                    <td class="px-4 py-3">{item.name}</td>
                    <td class="px-4 py-3">{item.description}</td>
                    <td class="px-4 py-3">
                      <Options
                        handleDelete={() => {
                          setEditData(item);
                          handleOpenModal("deleteModal");
                        }}
                        handleEdit={() => {
                          setEditData(item);
                          handleOpenModal("form");
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            handlePrev={handlePrev}
            from={trimStart}
            to={trimEnd}
            total={totalItems}
            handleForw={handleForw}
            fetchLoad={fetchLoad}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Form
        isOpen={modal.form}
        editData={editData}
        handleCloseModal={() => handleCloseModal("form")}
      />

      {/* Confirmation Modal */}
      <Confrimation
        title="Sub Category"
        isOpen={modal.deleteModal}
        handleCancel={() => {
          setEditData({});
          handleCloseModal("deleteModal");
        }}
        handleConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
};

export default Layout(SubCategories);
