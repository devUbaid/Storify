import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import { setTime, setDate } from "../../utils/timeConverter";
import { checkType } from "../../utils/fileType";
import SharedFiles from "./SharedFiles";

const SharedHome = ({ preview }) => {
  const [data, setData] = useState([]); // ✅ Ensure `data` is always an array
  const [fileTypes, setFileTypes] = useState({});
  const nav = useNavigate();
  const token = localStorage.getItem("token") || "";

  const fetchSharedFiles = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      nav("/");
      return;
    }

    if (token) {
      try {
        const res = await axios.get(`${api}files/sharedfile?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.files && Array.isArray(res.data.files)) {
          setData(res.data.files);
        } else {
          setData([]); // ✅ Prevent undefined issues
        }
      } catch (error) {
        console.error("Error fetching shared files:", error);
        setData([]);
      }
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      fetchSharedFiles();
    }
  }, [data]);

  return (
    <div className="font-inter relative top-14 md:top-16 lg:top-20 p-3 bg-white h-auto">
      <div className="flex w-[78%] md:w-[88%] lg:w-[84%] justify-between items-center top-14 md:top-16 bg-white lg:top-20 pt-2 pb-4 md:pb-6  z-10 fixed ">
        <h1 className="text-lg md:text-xl lg:text-2xl flex font-[400]">
          Shared With Me
        </h1>
      </div>
      <div className="mt-14 md:mt-16 lg:mt-20">
        {data?.length > 0 ? (
          <SharedFiles preview={preview} data={data} />
        ) : (
          <p>No shared files available.</p>
        )}
      </div>
    </div>
  );
};

export default SharedHome;
