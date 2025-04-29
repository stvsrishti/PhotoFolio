import { useState, useEffect } from "react";
import styles from "../albumsList/albumsList.module.css";
import { AlbumForm } from "../albumForm/AlbumForm";
import Spinner from "react-spinner-material";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ImagesList } from "../imagesList/ImagesList";
import { toast } from "react-toastify";
export const AlbumsList = () => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [albumAddLoading, setAlbumAddLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  // create function to get all the album from the firebase.
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "albums"), (snapshot) => {
      const albums = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      //console.log(albums);
      setAlbums(albums);
      setLoading(false);
    });
  }, []);
  // create function to handle adding of the album

  const handleAddAlbum = async (albumName) => {
    // Add a new document with a generated id.

    const docRef = await addDoc(collection(db, "albums"), {
      name: albumName,
      createdOn: new Date(),
      images: [],
    });
    setShowForm(false);
    toast.success("Album Created successfully.");
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleAlbumClick = (album) => {
    //e.stopPropogation;
    setCurrentAlbum(album);
  };
  if (loading) {
    return (
      <>
        <div className={styles.loader}>
          <Spinner
            radius={50}
            color={"rgb(160, 160, 249)"}
            stroke={5}
            visible={true}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {currentAlbum ? (
        <ImagesList
          onBack={() => setCurrentAlbum(null)}
          albumName={currentAlbum.name}
          currentAlbum={currentAlbum}
        ></ImagesList>
      ) : (
        <div>
          {showForm && (
            <AlbumForm
              handleCancel={() => setShowForm(false)}
              handleAdd={handleAddAlbum}
            ></AlbumForm>
          )}
          <div className={styles.top}>
            <h3>Album List</h3>
            <button onClick={handleShowForm}>Add Album</button>
          </div>
          <div className={styles.albumsList}>
            {albums.map((album, i) => (
              <div
                className={styles.album}
                key={i}
                onClick={() => handleAlbumClick(album)}
              >
                <img src="/assets/photos.png" alt="photos" />
                <span>{album.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
