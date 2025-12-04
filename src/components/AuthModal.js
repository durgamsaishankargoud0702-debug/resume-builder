import React from 'react';
import { X } from 'lucide-react';
import styles from '../styles/ResumeBuilder.module.css';

export default function AuthModal({ isOpen, onClose, onLogin }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>
                <h2 className={styles.modalTitle}>Sign In</h2>
                <p className={styles.modalSubtitle}>Save your progress and access premium features</p>

                <div className={styles.authButtons}>
                    <button className={`${styles.authButton} ${styles.google}`} onClick={() => onLogin('google')}>
                        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
                        Continue with Google
                    </button>
                    <button className={`${styles.authButton} ${styles.facebook}`} onClick={() => onLogin('facebook')}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="Facebook" width="20" height="20" />
                        Continue with Facebook
                    </button>
                    <button className={`${styles.authButton} ${styles.linkedin}`} onClick={() => onLogin('linkedin')}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" width="20" height="20" />
                        Continue with LinkedIn
                    </button>
                </div>
            </div>
        </div>
    );
}
