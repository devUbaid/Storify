import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import gsap from "gsap";
import ReactPlayer from "react-player";
import { PDFViewer, PdfFocusProvider } from "@llamaindex/pdf-viewer";
import { useNavigate } from "react-router-dom"; // For redirecting to login
import mammoth from "mammoth"; // ✅ DOCX to HTML converter

function Viewer({ fileName }) {
  const [fileBlob, setFileBlob] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textContent, setTextContent] = useState(""); // Text for text/DOCX files
  const [docxHtml, setDocxHtml] = useState(""); // ✅ State for DOCX preview
  const previRef = useRef();
  const token = localStorage.getItem("token") || null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`${api}files/preview/${fileName}`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const blob = new Blob([response.data]);
        setFileBlob(blob);
        setFileType(response.data.type);

        // ✅ If the file is DOCX, process it using Mammoth
        if (response.data.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const reader = new FileReader();
          reader.onload = async function (event) {
            const arrayBuffer = event.target.result;
            try {
              const result = await mammoth.convertToHtml({ arrayBuffer });
              setDocxHtml(result.value);
            } catch (mammothError) {
              console.error("Error parsing DOCX:", mammothError);
              setError("Failed to preview DOCX file.");
            }
          };
          reader.readAsArrayBuffer(blob);
        }

        // ✅ If it's a text file, read its content
        if (response.data.type.startsWith("text/")) {
          const reader = new FileReader();
          reader.onload = () => setTextContent(reader.result);
          reader.readAsText(blob);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
        if (error.response?.status === 401 || error.response?.status === 400) {
          setError("Please login to access this file.");
        } else if (error.response?.status === 403) {
          setError("You do not have permission to access this file.");
        } else {
          setError("Failed to load file preview. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (fileBlob) {
        URL.revokeObjectURL(fileBlob);
      }
    };
  }, [fileName]);

  useEffect(() => {
    if (previRef.current) {
      gsap.fromTo(
        previRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [fileType]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img className="w-[100px]" src="/Logo/loading.gif" alt="Loading..." />
        <p className="ml-2">Loading file preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-center">
          <p>{error}</p>
          {error === "Please login to access this file." && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-4 py-2 bg-[#004646] text-white rounded-full"
            >
              Login
            </button>
          )}
        </div>
      </div>
    );
  }

  const fileUrl = URL.createObjectURL(fileBlob);

  return (
    <div ref={previRef} className="w-[80%] bg-white h-[80%] rounded-lg my-10 overflow-hidden flex justify-center items-center text-black">
      <div className="overflow-y-scroll w-full flex justify-center items-center">
        {/* Image Preview */}
        {fileType.startsWith("image/") && (
          <img src={fileUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        )}

        {/* Video Preview */}
        {fileType.startsWith("video/") && (
          <ReactPlayer url={fileUrl} controls playing={false} loop={false} style={{ maxWidth: "100%", maxHeight: "100%" }} />
        )}

        {/* PDF Preview */}
        {fileType === "application/pdf" && (
          <PdfFocusProvider>
            <PDFViewer file={{ url: fileUrl }} className="w-full h-full" />
          </PdfFocusProvider>
        )}

        {/* Text File Preview */}
        {fileType.startsWith("text/") && (
          <div className="w-full h-[50vh] p-4 overflow-y-auto">
            <pre>{textContent}</pre>
          </div>
        )}

        {/* ✅ DOCX File Preview */}
        {fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <div className="w-full h-[50vh] p-4 overflow-y-auto bg-gray-100">
            <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
          </div>
        )}

        {/* Fallback for unsupported file types */}
        {!fileType.startsWith("image/") && 
         !fileType.startsWith("video/") && 
         fileType !== "application/pdf" && 
         !fileType.startsWith("text/") &&
         fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <div className="w-full h-full flex justify-center items-center">
            <p>Unsupported file type for preview.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Viewer;
