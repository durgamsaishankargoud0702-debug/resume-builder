import React from 'react';
import styles from '../styles/AuthPopup.module.css'; // Reusing modal styles for consistency
import TemplateCard from './TemplateCard';
import { TEMPLATES } from '../lib/templates';

export default function TemplatePopup({ isOpen, onClose, currentTemplate, onSelectTemplate }) {
    if (!isOpen) return null;

    const templates = TEMPLATES;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <h2 className={styles.title}>Choose Template</h2>
                <p className={styles.subtitle}>Select a design for your resume</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '2rem',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '0.5rem'
                }}>
                    {templates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            currentTemplate={currentTemplate}
                            onSelectTemplate={onSelectTemplate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

