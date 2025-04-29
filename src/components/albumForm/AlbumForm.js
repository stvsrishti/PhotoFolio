import styles from "./albumForm.module.css";
import { useRef } from "react";

export const AlbumForm = ({ handleCancel, handleAdd }) => {
  const albumNameInput = useRef();
  // function  to handle the clearing of the form
  const handleClear = () => {
    handleCancel();
  };
  // function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(albumNameInput.current.value);
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear}>
          Clear
        </button>
        <button>Create</button>
      </form>
    </div>
  );
};
