import React, { useEffect, useState } from "react";
import { checkType } from "../../utils/fileType";
import { setTime, setDate } from "../../utils/timeConverter";

const SharedFiles = ({ data = [], preview, text = "Files" }) => {
  const [fileTypes, setFileTypes] = useState({});

  useEffect(() => {
    if (!data || data.length === 0) return; // Agar data null/undefined hai, toh return kar jao

    const fetchFileTypes = async () => {
      try {
        const types = await Promise.all(
          data.map(async (item) => {
            const category = await checkType(item?.type);
            return { [item?.fileName]: category };
          })
        );
        setFileTypes(types.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
      } catch (error) {
        console.error("Error fetching file types:", error);
      }
    };

    fetchFileTypes();
  }, [data]);

  return (
    <>
      <h2 className="text-lg md:text-xl lg:text-2xl mt-2 lg:mt-4">{text}</h2>

      {/* Agar koi file nahi hai toh error na aaye */}
      {data?.length > 0 ? (
        data.map((item, i) => (
          <div
            key={i}
            className="flex w-full cursor-pointer justify-between p-3 my-2 items-center bg-[#e7e7e763] text-[12px] font-inter rounded-[16px] hover:bg-[#e7e7e7a2]"
          >
            <div className="itemName flex items-center w-[60%] md:w-[25%]">
              <img
                src={
                  fileTypes[item?.fileName] === "Document"
                    ? "/Logo/Recent/doc.svg"
                    : fileTypes[item?.fileName] === "Video"
                    ? "/Logo/Recent/video.svg"
                    : fileTypes[item?.fileName] === "Image"
                    ? "/Logo/Recent/image.svg"
                    : "/Logo/Recent/other.svg"
                }
                alt=""
                className="w-5"
              />
              <p
                onClick={() => preview && preview(true, item)}
                className="mx-2 hover:underline truncate"
              >
                <span className="block sm:max-w-[15ch] md:max-w-[20ch] lg:max-w-none">
                  {item?.fileName || "Unknown File"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-evenly w-[40%] md:w-[75%]">
              <div className="size hidden md:block lg:block">
                <p className="text-gray-700">
                  <span className="text-teal-600">
                    {item?.size ? (item.size / 1024 / 1024).toFixed(1) : "0"}
                  </span>{" "}
                  MB
                </p>
              </div>
              <div className="type hidden md:block lg:block">
                <p>
                  {fileTypes[item?.fileName] || "Other"}
                </p>
              </div>
              <div className="accessTime hidden md:block">
                <p className="bg-white p-2 rounded-full">
                  Last Opened | {setTime(item?.lAccess) || "N/A"}
                </p>
              </div>
              <div className="accessName hidden md:block lg:block">
                <p>{item?.lName || "Unknown"}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No shared files available.</p>
      )}
    </>
  );
};

export default SharedFiles;
