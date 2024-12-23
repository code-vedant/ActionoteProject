import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function TinyRTE({ initialValue, handleEditorChange }) {
  return (
    <Editor
      apiKey={`${import.meta.env.VITE_TINY_API_KEY}`}
      init={{
        min_height: "80vh", // Set editor height to 80% of viewport height
        plugins: [
          'autoresize', 'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
          'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        forced_root_block: false, // Disable forced wrapping in <p> tags
        block_formats: 'Normal=n;Heading 1=h1;Heading 2=h2;Heading 3=h3;Blockquote=blockquote', // Block formats
      }}
      initialValue={initialValue || ""}  // Default to empty string if no initialValue is provided
      onEditorChange={(content, editor) => handleEditorChange(content)}  // Pass the content to parent
    />
  );
}

export default TinyRTE;
