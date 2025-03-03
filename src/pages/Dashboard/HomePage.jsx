import React, { useEffect, useState } from "react";
import Stats from "./Stats";
import Recent from "./Recent";
import FolderPopup from "./FolderPopup";
import axios from "axios";
import api from "../../utils/api";
import SharedFiles from "../Shared/SharedFiles";

function HomePage({ open, data = [], data2 = [], isFolderOpen, toggleFolder, preview }) {
  const [folderFiles, setFolderFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [shared, setShared] = useState([]);

  // 📌 Folder click handler
  const handleFolderClick = async (folderId) => {
    try {
      const response = await axios.get(`${api}folders/${folderId._id}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolderFiles(Array.isArray(response.data) ? response.data : []);
      setSelectedFolder(folderId);
    } catch (error) {
      console.error("Error fetching folder files:", error);
    }
  };

  // 📌 Go back to root
  const handleGoBack = () => {
    setSelectedFolder(null);
    setFolderFiles([]);
  };

  // 📌 Upload handler
  const handleUpload = (folderId) => {
    open(true, folderId);
  };

  // 📌 Fetch shared files
  const fetchSharedFiles = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token") || "";
    
    if (!token) return;

    try {
      const res = await axios.get(`${api}files/sharedfile?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShared(Array.isArray(res.data?.files) ? res.data.files : []);
    } catch (error) {
      console.error("Error fetching shared files:", error);
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  return (
    <div className="font-inter relative top-14 md:top-16 lg:top-20 p-2 bg-white h-full">
      {/* ✅ Navbar */}
      <div className="flex w-[78%] md:w-[88%] lg:w-[84%] justify-between items-center top-14 md:top-16 lg:top-20 bg-white pt-2 pb-4 md:pb-6 z-10 fixed">
        <h1 className="text-lg md:text-xl lg:text-2xl font-[600] pl-2 ">Welcome To Storify</h1>
        <div className="flex gap-1 justify-evenly">
          <button className="btnAction1 z-20" onClick={toggleFolder}>
            <p className="hidden lg:block">Create</p>
            <i className="fa-regular fa-plus"></i>
          </button>
          <button className="btnAction2 z-20" onClick={() => open(true)}>
            <p className="hidden lg:block">Upload</p>
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* ✅ Content */}
      <div className="mt-14 md:mt-16 lg:mt-20">
        <Stats data={data} data2={data2} />
        <div className="mt-2">
          <Recent
            data={selectedFolder ? folderFiles : data}
            onFolderClick={handleFolderClick}
            selectedFolder={selectedFolder}
            handleGoBack={handleGoBack}
            preview={preview}
            data2={data2}
            open={open}
            handleUpload={handleUpload}
          />
        </div>
      </div>

      {/* ✅ Shared Files */}
      <div className="p-1">
        {shared.length > 0 && !selectedFolder && (
          <SharedFiles preview={preview} data={shared} text="Shared with me" />
        )}
      </div>
    </div>
  );
}

export default HomePage;
