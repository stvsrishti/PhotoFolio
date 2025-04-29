import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
export const ImagesList = ({ onBack, albumName, currentAlbum }) => {
  //These state and functions are create just for your convience you can create modify or delete the state as per your requirement.
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const searchInput = useRef();
  // async function
  const getImages = async () => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "albums", currentAlbum.id), (doc) => {
      //console.log("Current data: ", doc.data().images);
      setImages(doc.data() ? doc.data().images : []);
    });
    //console.log(images);
    setLoading(false);
  };

  useEffect(() => {
    getImages();
  }, []);

  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [updateImage, setUpdateImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // function to handle toggle next image
  const handleNext = () => {
    if (activeImageIndex !== images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };
  // function to handle toggle previous image
  const handlePrev = () => {
    if (activeImageIndex != 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };
  // function to handle cancel
  const handleCancel = () => {
    setActiveImageIndex(null);
  };
  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent(!searchIntent);
  };
  // function to handle search functionality for image
  const handleSearch = () => {
    const searchText = searchInput.current.value;
    if (searchText.length > 0) {
      let output = images.filter((image) =>
        image.title.toLowerCase().includes(searchText.toLowerCase())
      );
      console.log(output);
      setImages(output);
    } else {
      getImages();
    }
  };

  // async functions
  const handleAdd = async (imageTitle, imageUrl) => {
    const existingImage = images.filter((image) => {
      return image.title === imageTitle;
    });
    if (existingImage.length > 0) {
      setAddImageIntent(false);
      toast.success("Image already exists.");
      return;
    }
    const imgObj = { title: imageTitle, url: imageUrl };
    await updateDoc(doc(db, "albums", currentAlbum.id), {
      images: [imgObj, ...images],
    });
    //setImages(imagesArray);
    setAddImageIntent(false);
    toast.success("Image added to the album successfully.");
  };
  // function to handle update image
  const handleUpdate = async (title, url) => {
    //console.log(images);
    let temp = [...images];
    temp.splice(selectedImageIndex, 1);
    for (let i of temp) {
      if (title === i.title) {
        toast.error("Image Already Exists");
        return;
      }
    }
    const imgObj = { title, url };

    images.splice(selectedImageIndex, 1, imgObj);
    //console.log(currentAlbum.id, images);
    await updateDoc(doc(db, "albums", currentAlbum.id), {
      images: images,
    });

    toast.success("Image Edited Successfully");
    setSelectedImageIndex(null);
    setUpdateImageIntent(false);
  };
  // function to handle delete image
  const handleDelete = async (e) => {
    e.stopPropagation();
    images.splice(selectedImageIndex, 1);
    const update = async () => {
      await updateDoc(doc(db, "albums", currentAlbum.id), {
        images: images,
      });
    };
    update();
    toast.success("Image Deleted Successfully");
  };

  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={onBack}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAdd}
            albumName={albumName}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
          updateImage={updateImage}
        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {albumName}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}
        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(true);
                  setUpdateImage(image);
                  setSelectedImageIndex(i);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>
              <div
                className={`${styles.delete} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
