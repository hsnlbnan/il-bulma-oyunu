import React from "react";
import styles from "./index.module.css";
const Modal = ({ showModal, knew, resetGame }) => {
  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Oyun Bitti</h2>
        </div>

        <div className={styles.modalBody}>
          <p> {knew} şehri bildin.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.button} onClick={() => resetGame()}>
            Tekrar Oyna
          </button>
        </div>
      </div>
    </div>
  );
};

export { Modal };
