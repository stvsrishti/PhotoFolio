import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
export const ImageForm = ({
  loading,
  albumName,
  updateIntent,
  updateImage,
  onAdd,
  onUpdate,
}) => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const imageTitleInput = useRef();
  const imageUrlInput = useRef();
  useEffect(() => {
    handleDefaultValues();
  }, [updateIntent]);

  // function to handle image form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = imageTitleInput.current.value.trim();
    const url = imageUrlInput.current.value;
    checkURL(url)
      .then(() => {
        if (updateIntent) {
          onUpdate(title, url);
        } else {
          onAdd(title, url);
        }
      })
      .catch(() => {
        toast.error("Invalid URl");
      });
  };
  // function to thandle clearing the form
  const handleClear = () => {};
  // function to prefill the value of the form input
  const handleDefaultValues = () => {
    if (updateIntent) {
      imageTitleInput.current.value = updateImage.title;
      imageUrlInput.current.value = updateImage.url;
    }
  };

  // function to check dead link
  function checkURL(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
    });
  }

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName}`
          : `Update image ${updateImage.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        <input required placeholder="Image URL" ref={imageUrlInput} />
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button disabled={loading}>{updateIntent ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};
