import React, { useEffect, useRef, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function EditorPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated]);

  // if (loading || !isAuthenticated) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    if (!textareaRef.current) return;

    const initEditor = () => {
      window.tinymce.init({
        selector: "#my-editor",
        height: 400,
        plugins: "link paste table code image media",
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | removeformat | code",
        menubar: true,
      });
    };

    if (window.tinymce) {
      initEditor();
    } else {
      const script = document.createElement("script");
      script.src = "/tinymce/tinymce.min.js";
      script.onload = initEditor;
      document.body.appendChild(script);
    }

    return () => {
      if (window.tinymce) window.tinymce.remove("#my-editor");
    };
  }, []);

  const getContent = () => alert(window.tinymce.get("my-editor").getContent());

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Edit Content</h2>
        <textarea id="my-editor" ref={textareaRef} />
        <button style={{ marginTop: 15 }} onClick={getContent}>
          Get Content
        </button>
      </div>
    </div>
  );
}

// import { useEffect, useRef } from "react";

// export default function Editor() {
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (!textareaRef.current) return;

//     const initEditor = () => {
//       window.tinymce.init({
//         selector: "#my-editor",
//         height: 400,
//         theme: "modern",
//         skin: "lightgray",
//         plugins: "link paste",
//        toolbar: "undo redo | bold italic underline strikethrough | \
// alignleft aligncenter alignright alignjustify | \
// bullist numlist outdent indent | blockquote | \
// link image media | forecolor backcolor | removeformat | code",
//         menubar: false
//       });
//     };

//     // If tinymce already loaded
//     if (window.tinymce) {
//       initEditor();
//     } else {
//       const script = document.createElement("script");
//       script.src = "/static/tinymce/tinymce.min.js";
//       script.onload = initEditor;
//       document.body.appendChild(script);
//     }

//     return () => {
//       if (window.tinymce) {
//         window.tinymce.remove("#my-editor");
//       }
//     };
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>TinyMCE v4 Editor</h2>
//       <textarea id="my-editor" ref={textareaRef} />
//     </div>
//   );
// }
