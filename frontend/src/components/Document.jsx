import { React, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import shareDBConnection from "../connections/Sharedb.js";
import QuillCursors from "quill-cursors";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/client";
import {
  ADD_CLICKED_DOCUMENTS,
  CHANGE_DOCUMENT_TITLE,
  GET_DOCUMENT,
} from "../queries/Document";
import { useSelector } from "react-redux";
import LogOutButton from "./LogOutButton";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import "../css/Document.css";
import { randomColor } from "randomcolor";

const Document = () => {
  const { docId } = useParams();
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["authToken"]);
  const doc = shareDBConnection.get("collaborations", docId);
  const presence = shareDBConnection.getDocPresence("collaborations", docId);
  Quill.register("modules/cursors", QuillCursors);
  const [addClickedDoc] = useMutation(ADD_CLICKED_DOCUMENTS);
  const [changeDocumentTitle] = useMutation(CHANGE_DOCUMENT_TITLE);
  const [content, setContent] = useState("");
  const [getDocument] = useMutation(GET_DOCUMENT);
  const [title, setTitle] = useState("Untitled");
  const [name, setName] = useState("");
  let quill;

  const wrapperRef = useCallback((wrapper) => {
    getDocumentTitle();

    verifyToken();
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    quill = new Quill(editor, {
      theme: "snow",
      modules: { cursors: true },
    });
    quill.setContents(doc.data);
  }, []);
  const initializeQuill = useCallback(() => {
    setContent(quill.root.innerHTML);
    const cursors = quill.getModule("cursors");
    cursors.createCursor("cursor", "Pranali", "pink");
    const localPresence = presence.create();
    quill.setContents(doc.data);

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        doc.submitOp(delta, { source: quill }, (err) => {
          if (err) console.error("Submit OP returned an error:", err);
        });
        const content = quill.root.innerHTML;
        setContent(content);
        console.log(content);
      }
    });

    doc.on("op", (op, source) => {
      if (quill && source !== quill) {
        quill.updateContents(op);
      }
    });

    presence.subscribe();

    presence.on("receive", (id, cursorData) => {
      // console.log(cursorData.range);
      if (cursorData.range === null) {
        console.log("remote left");
      } else {
        var name = (cursorData && cursorData.name) || "Anonymous";
        var randomHexColor = randomColor();
        cursors.createCursor(id, name, "blue");
        cursors.moveCursor(id, cursorData.range);
      }
    });

    quill.on("selection-change", (range, oldRange, source) => {
      if (source !== "user") return;
      if (!range) return;
      else {
        setTimeout(() => cursors.moveCursor("cursor", range));
        localPresence.submit({ range, name: "Pranali" }, function (error) {
          if (error) throw error;
        });
      }
    });
  }, []);

  const handleAddClickedDocuments = async () => {
    try {
      const { data } = await addClickedDoc({
        variables: {
          userId,
          docId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getDocumentTitle = async () => {
    try {
      const { data } = await getDocument({
        variables: {
          docId,
        },
      });
      setTitle(data.getDocument.title);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyToken = () => {
    const authToken = cookies["authToken"];
    console.log(authToken);

    if (authToken) {
      doc.subscribe((err) => {
        if (err) throw err;
        handleAddClickedDocuments();
        initializeQuill();
      });
    } else {
      console.log("AuthToken is not set.");
      navigate(`/`);
    }
  };

  const downloadDocumentAsPDF = async () => {
    const pdf = await pdfExporter.generatePdf(doc.data);
    saveAs(pdf, "pdf-export.pdf");
  };

  const handleBlur = async () => {
    const { data } = await changeDocumentTitle({
      variables: {
        title,
        docId,
      },
    });
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleNameBlur = (event) => {
    setName(event.target.value);
    console.log(name);
  };

  return (
    <>
      <LogOutButton />
      <div className="container">
        <div className="title-bar">

        <input
          className="title"
          value={title}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <button
          className="download"
          onClick={downloadDocumentAsPDF}
        >
          Download
        </button>
        </div>

      <div ref={wrapperRef}></div>
      </div>

    </>
  );
};

export default Document;
